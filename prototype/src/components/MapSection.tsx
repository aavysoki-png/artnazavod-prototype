import { useEffect, useRef, useState } from 'react';
import { Icon, Stack, Typography } from '@sibur/design-system-react';
import { Icons } from '@sibur/design-tokens/js/iconfont';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import { ART_OBJECTS } from '../data/objects';
import { CITY_COORDS } from '../data/cityCoords';

const CITIES = [...new Set(ART_OBJECTS.map((object) => object.city))].sort((a, b) => a.localeCompare(b, 'ru'));

const OBJECTS_BY_CITY: Readonly<Record<string, readonly (typeof ART_OBJECTS)[number][]>> = (() => {
	const out: Record<string, (typeof ART_OBJECTS)[number][]> = {};
	for (const object of ART_OBJECTS) {
		(out[object.city] ??= []).push(object);
	}
	return out;
})();

// Vite не резолвит дефолтные пути иконок Leaflet (собраны под классическую
// сборку без бандлера) — стандартный фикс: подставить импортированные Vite
// урлы вручную, иначе маркеры рендерятся сломанными картинками.
const defaultIcon = L.icon({
	iconUrl: markerIcon,
	iconRetinaUrl: markerIcon2x,
	shadowUrl: markerShadow,
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41],
});

/**
 * «Интерактивная карта» (ТЗ: монохромный плагин Яндекс.Карт с метками
 * объектов). Яндекс.Карты требуют API-ключ продакшн-домена — для прототипа
 * подставлен Leaflet (открытый, без ключа), тайлы обесцвечены CSS-фильтром —
 * тот же монохромный эффект, другой поставщик тайлов. Замена — вопрос
 * продакшна, не молчаливый произвол (см. tasks.md).
 *
 * **Спутниковые тайлы вместо схематичных (2026-08-21), осознанное решение
 * заказчика.** Схематичные карты (OSM, CARTO и почти любой другой
 * бесплатный провайдер) рисуют административные границы регионов — в
 * частности, по спорной линии Донецкой/Луганской народных республик,
 * Запорожской и Херсонской областей (проверено вживую: граница видна на
 * тайлах CARTO Positron уже на низком зуме, даже в варианте без подписей).
 * Заказчик прямо попросил не занимать в этом вопросе никакой позиции
 * (компания не обязана поддерживать позицию государства) — спутниковый
 * снимок физически не содержит политических границ вообще, ни в чьей
 * трактовке, это не редакционное решение карты, а сама природа аэрофото.
 * Источник — Esri World Imagery, тот же бесплатный принцип, что был у OSM
 * (без API-ключа, публичный сервис). Монохромность (ТЗ) не пострадала —
 * тот же CSS-фильтр `grayscale` в `gallery-theme.scss` обесцвечивает и
 * спутниковый снимок точно так же, как раньше схематичные тайлы.
 *
 * Метки — на уровне ГОРОДА, не конкретного объекта: реестр (задача 31) не
 * содержит координат ни одного мурала/резервуара, это открытый вопрос
 * заказчику (задача 34, п.3). Координаты городов — public geographic data,
 * см. `data/cityCoords.ts`. Клик по попапу города — реальный Deep Link
 * (`href="#slug"`), не декоративная ссылка: срабатывает тот же `useDeepLink`,
 * что и у карточек объектов.
 */
export function MapSection() {
	const mapContainerRef = useRef<HTMLDivElement>(null);
	const mapRef = useRef<L.Map | null>(null);
	const markersRef = useRef<Record<string, L.Marker>>({});
	const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);
	// Тайлы OSM — внешний запрос на каждый кадр карты, сеть может лежать или
	// тормозить. Без явного состояния пользователь просто видит серые
	// клетки и не понимает, грузится карта или уже сломалась.
	const [tilesReady, setTilesReady] = useState(false);
	const [tileErrorCount, setTileErrorCount] = useState(0);

	useEffect(() => {
		const container = mapContainerRef.current;
		if (!container || mapRef.current) return;

		const map = L.map(container, { scrollWheelZoom: false });
		mapRef.current = map;

		// Esri World Imagery — публичный бесплатный сервис без API-ключа,
		// z/y/x (не z/x/y, как у OSM/CARTO) — такой у Esri порядок сегментов
		// URL. maxZoom 19 — паспортный максимум сервиса в заселённых районах,
		// в глухих регионах реальное разрешение ниже, тайлы там просто более
		// размытые — обычное поведение растровых тайлов, не баг.
		const tileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
			attribution: 'Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community',
			maxZoom: 19,
		}).addTo(map);

		// 'load' — все тайлы ТЕКУЩЕГО вида отработали (успешно или с ошибкой),
		// не первый успешный тайл: иначе индикатор загрузки исчезает, пока
		// часть карты ещё серая.
		tileLayer.on('load', () => setTilesReady(true));
		tileLayer.on('tileerror', () => setTileErrorCount((n) => n + 1));

		// Часть городов геометрически близко (например Тобольск/Пермь/Кстово в
		// европейской части России) — на узком мобильном контейнере fitBounds
		// подбирает более мелкий масштаб, и метки визуально накладываются друг
		// на друга (реальная находка гейта `interactive_overlap`, не
		// теоретическая). Кластеризация — стандартное решение именно этого
		// случая: близкие метки группируются в один тап-таргет с числом,
		// раскрываются по клику/зуму.
		const clusterGroup = L.markerClusterGroup({ maxClusterRadius: 40 });
		clusterGroupRef.current = clusterGroup;

		const points: L.LatLngExpression[] = [];
		for (const city of CITIES) {
			const coords = CITY_COORDS[city];
			if (!coords) continue;
			points.push(coords);

			const objects = OBJECTS_BY_CITY[city] ?? [];
			const listHtml = objects
				.map((object) => `<li><a href="#${object.slug}">${object.title.replace(/</g, '&lt;')}</a></li>`)
				.join('');
			const popupHtml = `<div class="gallery-map__popup"><strong>${city}</strong><ul>${listHtml}</ul></div>`;

			const marker = L.marker(coords, { icon: defaultIcon }).bindPopup(popupHtml);
			markersRef.current[city] = marker;
			clusterGroup.addLayer(marker);
		}

		map.addLayer(clusterGroup);

		if (points.length > 0) {
			map.fitBounds(L.latLngBounds(points), { padding: [24, 24] });
		}

		return () => {
			map.remove();
			mapRef.current = null;
			markersRef.current = {};
			clusterGroupRef.current = null;
		};
	}, []);

	const focusCity = (city: string) => {
		const marker = markersRef.current[city];
		const clusterGroup = clusterGroupRef.current;
		if (marker && clusterGroup) {
			// Раскрывает кластер вплоть до нужной метки (если город сейчас
			// схлопнут внутрь кластера), а не просто летит к координатам —
			// иначе попап открывается на метке, которая ещё не видна.
			// Пилюля города навигирует КАРТУ, не страницу — скролл к плитке
			// объектов сюда сознательно не добавлен (был раньше, ломал
			// ощущение «работаю с картой», увозя вниз к фото).
			clusterGroup.zoomToShowLayer(marker, () => marker.openPopup());
		}
	};

	return (
		<section className="gallery-section">
			<div className="gallery-container">
				<Typography variant="h2" as="h2" className="gallery-display-tracking">
					{CITIES.length} городов на карте России
				</Typography>

				<div className="gallery-map" style={{ marginTop: 'var(--size-spacing-x6)' }}>
					<div className="gallery-map__leaflet" ref={mapContainerRef} />
					{!tilesReady ? (
						<div className="gallery-map__loading" aria-live="polite">
							<Typography variant="body2" as="span" color="colorTextGreyInactive">
								Загружаем карту…
							</Typography>
						</div>
					) : null}
				</div>
				{tilesReady && tileErrorCount > 6 ? (
					<Stack direction="horizontal" spacing="x2" align="center" style={{ marginTop: 'var(--size-spacing-x2)' }}>
						<Icon iconName={Icons.WarningTriangle} size="small" />
						<Typography variant="caption" as="p" color="colorTextGreyInactive">
							Часть тайлов карты не загрузилась — проверьте соединение с интернетом.
						</Typography>
					</Stack>
				) : null}
				<Typography variant="caption" as="p" color="colorTextGreyInactive" style={{ marginTop: 'var(--size-spacing-x2)' }}>
					Метка показывает город, не точный адрес объекта — координаты
					конкретных муралов и резервуаров заказчиком ещё не переданы.
				</Typography>

				<Stack direction="horizontal" spacing="x2" wrap="wrap" style={{ marginTop: 'var(--size-spacing-x4)' }}>
					{CITIES.map((city) => (
						<button key={city} type="button" className="gallery-pill gallery-pill--clickable" onClick={() => focusCity(city)} aria-label={`Показать город ${city} на карте`}>
							<Typography variant="body3" as="span">
								{city}
							</Typography>
							<Icon iconName={Icons.ArrowRight} size="small" />
						</button>
					))}
				</Stack>
			</div>
		</section>
	);
}
