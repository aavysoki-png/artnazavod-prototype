import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, Ref } from 'react';
import { Icon, IconButton, Typography } from '@sibur/design-system-react';
import { Icons } from '@sibur/design-tokens/js/iconfont';

import type { ArtObject } from '../data/objects';

interface ObjectCardProps {
	readonly object: ArtObject;
	readonly expanded: boolean;
	readonly onToggle: (slug: string) => void;
}

type MediaItem = { kind: 'photo'; src: string } | { kind: 'video'; src: string };

/**
 * Карточка объекта — единственный компонент, который несёт Inline Expansion
 * (ТЗ, раздел «Раздел объектов»): раскрытие происходит **в потоке страницы**,
 * не в Popup/Drawer/на отдельном роуте — ТЗ прямо это запрещает.
 *
 * Технически это одно и то же React-дерево в двух состояниях, не переход
 * между компонентами: `grid-column: 1 / -1` на раскрытой карточке (см.
 * gallery-theme.scss, `.gallery-card--expanded`) заставляет её занять всю
 * ширину CSS Grid, а соседние карточки сами перетекают на следующую
 * строку — это и есть «остальные карточки автоматически смещаются ниже» без
 * ручного пересчёта позиций.
 */
export function ObjectCard({ object, expanded, onToggle }: ObjectCardProps) {
	// Один и тот же элемент — кнопка в свёрнутом состоянии, div в раскрытом
	// (см. комментарий у Ref ниже); ref общий для обоих ради scrollIntoView.
	const ref = useRef<HTMLButtonElement | HTMLDivElement>(null);
	const wasExpanded = useRef(expanded);
	const carouselRef = useRef<HTMLDivElement>(null);
	const mediaWrapRef = useRef<HTMLDivElement>(null);
	const [activeMedia, setActiveMedia] = useState(0);
	// Фото/видео с фотобанка — внешний ресурс, запрос может не отдаться (404,
	// сеть). Без обработки ошибки браузер молча показывает битую иконку —
	// здесь вместо неё та же честная градиентная заглушка, что и для
	// объектов без фото вообще.
	const [failedSrcs, setFailedSrcs] = useState<ReadonlySet<string>>(new Set());
	const markFailed = (src: string) => setFailedSrcs((prev) => (prev.has(src) ? prev : new Set(prev).add(src)));

	useEffect(() => {
		// Скроллим к карточке только при переходе false → true (клик или Deep
		// Link), не при каждом ре-рендере — иначе повторный клик для
		// сворачивания тоже дёрнет скролл. Индекс медиа тоже сбрасываем на
		// свежем раскрытии — иначе после «Стихи Тукая» → свернуть → «Тюльпаны»
		// откроется на третьем кадре чужого объекта.
		if (expanded && !wasExpanded.current) {
			setActiveMedia(0);
			ref.current?.scrollIntoView({
				behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
				block: 'start',
			});
			// Раскрытая карточка заменяет <button> на <div> — старый фокус с
			// кнопки-триггера пропадает вместе с ней (браузер сбрасывает фокус
			// на <body>), поэтому стрелки ←/→ сразу после раскрытия никуда не
			// попадали бы. Переносим фокус на область карусели явно.
			mediaWrapRef.current?.focus({ preventScroll: true });
		}
		wasExpanded.current = expanded;
	}, [expanded]);

	// Карусель: центрируем активный слайд каждый раз, когда меняется индекс
	// (стрелка, клик по превью). Слайды разной ширины (высота фиксирована,
	// ширина — по контенту), поэтому центр каждый раз в новом месте — считаем
	// от реальных размеров DOM, не от фиксированного шага.
	const centerActiveMedia = (instant?: boolean) => {
		const container = carouselRef.current;
		const activeEl = container?.children[activeMedia] as HTMLElement | undefined;
		if (!container || !activeEl) return;
		const target = activeEl.offsetLeft + activeEl.offsetWidth / 2 - container.clientWidth / 2;
		container.scrollTo({
			left: target,
			behavior: instant || window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
		});
	};

	useEffect(() => {
		centerActiveMedia();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeMedia, expanded]);

	const photo = object.media.photos[0] ?? null;

	if (!expanded) {
		// Настоящий <button>, не div+role="button": карточка переключает
		// состояние (Inline Expansion), а не переходит по ссылке — у
		// CardTemplate из DS кликабельна вся карточка только через href
		// (рендерится <a>, то есть навигация), что не подходит для
		// stateful-переключателя. Нативная кнопка даёт клавиатурную
		// активацию (Enter/Space) и фокус бесплатно, без ручной эмуляции.
		return (
			<button
				ref={ref as Ref<HTMLButtonElement>}
				id={`card-${object.slug}`}
				type="button"
				className="gallery-card"
				onClick={() => onToggle(object.slug)}
			>
				{photo && !failedSrcs.has(photo) ? (
					<img className="gallery-card__media" src={photo} alt="" onError={() => markFailed(photo)} />
				) : (
					<div className="gallery-card__media" aria-hidden="true" />
				)}
				<Typography variant="subtitle2" as="h3" style={{ marginTop: 'var(--size-spacing-x3)' }}>
					{object.title}
				</Typography>
				<Typography variant="body3" as="p" color="colorTextGreyInactive">
					{object.facility} · {object.city}
					{object.year ? ` · ${object.year}` : ''}
				</Typography>
			</button>
		);
	}

	// Медиагалерея объекта — реальные фото и видео этого конкретного мурала
	// (финальная фактура заказчика, 2026-08-20), не общий пул площадки.
	const media: MediaItem[] = [
		...object.media.photos.map((src): MediaItem => ({ kind: 'photo', src })),
		...object.media.videos.map((src): MediaItem => ({ kind: 'video', src })),
	];

	const goTo = (index: number) => setActiveMedia(((index % media.length) + media.length) % media.length);

	// Листание стрелками — раньше отсутствовало вовсе (только клик по кнопкам
	// и превью). Вешаем на обёртку, а не на сам скроллящийся `.carousel`: так
	// стрелки работают одинаково, где бы ни стоял фокус внутри неё — на кнопке
	// prev/next или на самой области (после программного `.focus()` выше).
	const handleGalleryKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
		if (media.length <= 1) return;
		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			goTo(activeMedia - 1);
		} else if (event.key === 'ArrowRight') {
			event.preventDefault();
			goTo(activeMedia + 1);
		}
	};

	return (
		<div ref={ref as Ref<HTMLDivElement>} id={object.slug} className="gallery-card gallery-card--expanded">
			<div className="gallery-card__media-header">
				<IconButton variant="plain" size="large" iconName={Icons.Close} aria-label="Свернуть" onClick={() => onToggle(object.slug)} />
			</div>

			<div
				className="gallery-card__expanded-media-wrap"
				ref={mediaWrapRef}
				tabIndex={-1}
				role="group"
				aria-label="Фото и видео объекта, переключение стрелками влево-вправо"
				onKeyDown={handleGalleryKeyDown}
			>
				{/* Карусель по образцу заказчика: центральный слайд виден целиком,
				    соседние — частично по бокам, обрезаны краем контейнера. Высота
				    фиксирована, ширина каждого слайда — по его реальным пропорциям
				    (photo/video сами задают ширину через `height:100%`, без серых
				    полей — то, от чего явно отказались). Это относится и к
				    активному слайду: до 10.09 он один расширялся до ширины колонки
				    и из-за этого кропался, см. комментарий в gallery-theme.scss. */}
				<div className="gallery-card__carousel" ref={carouselRef}>
					{media.map((item, i) => {
						const isError = failedSrcs.has(item.src);
						return (
							<div key={`${item.kind}-${item.src}-${i}`} className={`gallery-card__carousel-item${i === activeMedia ? ' gallery-card__carousel-item--active' : ''}`}>
								{item.kind === 'video' && !isError ? (
									<video
										className="gallery-card__carousel-media gallery-card__carousel-media--video"
										src={item.src}
										controls={i === activeMedia}
										muted={i !== activeMedia}
										playsInline
										onError={() => markFailed(item.src)}
										// Слайды разной ширины считаются от реальных размеров DOM
										// (см. эффект центрирования выше) — до того, как видео
										// отдаст свои метаданные, offsetWidth ещё 0, и центровка
										// уезжает мимо. Пересчитываем, когда размер стал известен.
										onLoadedMetadata={() => i === activeMedia && centerActiveMedia(true)}
									/>
								) : item.kind === 'video' ? (
									<div className="gallery-card__carousel-media gallery-card__carousel-media--video gallery-card__carousel-media--error" role="alert">
										<Icon iconName={Icons.WarningTriangle} />
										<Typography variant="body2" as="span" color="colorTextLightInactive">
											Не удалось загрузить видео
										</Typography>
									</div>
								) : item.src && !isError ? (
									<img
										className="gallery-card__carousel-media"
										src={item.src}
										alt={i === activeMedia ? object.title : ''}
										onError={() => markFailed(item.src)}
										onLoad={() => i === activeMedia && centerActiveMedia(true)}
									/>
								) : (
									<div className="gallery-card__carousel-media gallery-card__carousel-media--placeholder" aria-hidden="true" />
								)}
							</div>
						);
					})}
				</div>

				{media.length > 1 ? (
					<>
						<IconButton
							variant="overlay"
							iconName={Icons.NavArrowLeft}
							aria-label="Предыдущее фото или видео"
							className="gallery-card__media-nav gallery-card__media-nav--prev"
							onClick={() => goTo(activeMedia - 1)}
						/>
						<IconButton
							variant="overlay"
							iconName={Icons.NavArrowRight}
							aria-label="Следующее фото или видео"
							className="gallery-card__media-nav gallery-card__media-nav--next"
							onClick={() => goTo(activeMedia + 1)}
						/>
					</>
				) : null}
			</div>

			{media.length > 1 ? (
				<div className="gallery-card__thumbs" role="tablist" aria-label="Фото и видео объекта">
					{media.map((item, i) => (
						<button
							key={`${item.kind}-${item.src}-${i}`}
							type="button"
							role="tab"
							aria-selected={i === activeMedia}
							aria-label={item.kind === 'video' ? `Видео ${i + 1}` : `Фото ${i + 1}`}
							className={`gallery-card__thumb-button${i === activeMedia ? ' gallery-card__thumb-button--active' : ''}`}
							onClick={() => setActiveMedia(i)}
						>
							{item.kind === 'video' && !failedSrcs.has(item.src) ? (
								<video
									className="gallery-card__thumb gallery-card__thumb--video"
									src={item.src}
									muted
									playsInline
									onError={() => markFailed(item.src)}
								/>
							) : item.kind === 'photo' && item.src && !failedSrcs.has(item.src) ? (
								<img className="gallery-card__thumb" src={item.src} alt="" onError={() => markFailed(item.src)} />
							) : (
								<span className="gallery-card__thumb" />
							)}
							{item.kind === 'video' ? (
								<span className="gallery-card__thumb-play" aria-hidden="true">
									<Icon iconName={Icons.Play} />
								</span>
							) : null}
						</button>
					))}
				</div>
			) : null}

			<div className="gallery-card__expanded-body">
				<div>
					<Typography variant="h3" as="h3">
						{object.title}
					</Typography>
					<Typography variant="body2" as="p" color="colorTextGreyInactive" style={{ marginTop: 'var(--size-spacing-x1)' }}>
						{object.facility} · {object.city}
						{object.year ? ` · ${object.year}` : ' · год не указан в исходных материалах'}
					</Typography>

					{object.description ? (
						<Typography variant="body1" as="p" style={{ marginTop: 'var(--size-spacing-x4)' }}>
							{object.description}
						</Typography>
					) : (
						<Typography variant="body2" as="p" color="colorTextGreyInactive" style={{ marginTop: 'var(--size-spacing-x4)' }}>
							Описание концепции для этого объекта ещё не передано заказчиком.
						</Typography>
					)}

					{object.artist ? (
						<Typography variant="body2" as="p" color="colorTextGreyInactive" style={{ marginTop: 'var(--size-spacing-x3)' }}>
							Художник: {object.artist}
						</Typography>
					) : null}
				</div>

				{object.facts.length > 0 ? (
					<dl className="gallery-card__facts">
						{object.facts.map((fact) => (
							<div key={fact.label} className="gallery-card__fact">
								<Typography variant="overline" as="dt" color="colorTextGreyInactive">
									{fact.label}
								</Typography>
								<Typography variant="body2" as="dd">
									{fact.value}
								</Typography>
							</div>
						))}
					</dl>
				) : null}
			</div>
		</div>
	);
}
