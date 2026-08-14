import { useLayoutEffect, useRef, useState } from 'react';
import { IconButton, Stack, Typography } from '@sibur/design-system-react';
import { Icons } from '@sibur/design-tokens/js/iconfont';

import { ART_OBJECTS, yearOf } from '../data/objects';

const YEAR_GROUPS = (() => {
	const groups = new Map<number | null, string[]>();
	for (const object of ART_OBJECTS) {
		const year = yearOf(object);
		const titles = groups.get(year) ?? [];
		titles.push(object.title);
		groups.set(year, titles);
	}
	const known = [...groups.entries()]
		.filter((entry): entry is [number, string[]] => entry[0] !== null)
		.sort((a, b) => a[0] - b[0]);
	const unknown = groups.get(null);
	return unknown ? [...known, [null, unknown] as [null, string[]]] : known;
})();

/**
 * «Горизонтальный таймлайн по годам» (ТЗ). Сознательно НЕ используется DS
 * `Timeline`: его семантика — линейный прогресс сценария (пройдено/сейчас/
 * будет/ошибка, один активный шаг), а здесь — просматриваемый архив, где все
 * года «завершены» и нет единственного «текущего» шага. Собрано из
 * `Stack`/`Typography`, полоса скроллится горизонтально своим собственным
 * `overflow-x` (см. `.gallery-history__track` в теме) — это НЕ блокирует
 * вертикальный скролл страницы, ТЗ прямо требует этого не делать.
 */
export function HistorySection() {
	const trackRef = useRef<HTMLDivElement>(null);
	const firstDotRowRef = useRef<HTMLDivElement>(null);
	// Сплошная ось таймлайна должна перекрыть ВЕСЬ скроллящийся контент, а не
	// только видимую часть — ширины 100% через CSS недостаточно внутри
	// горизонтально скроллящегося flex-контейнера. Меряем scrollWidth реально
	// отрендеренного трека и держим в состоянии, а не считаем на глаз.
	const [axisWidth, setAxisWidth] = useState(0);
	// Вертикальное положение оси считаем от реального центра первой строки с
	// точкой, а не подбираем магическое число пикселей вручную — оно ломается
	// при любом изменении размера точки/шрифта заголовка года.
	const [axisTop, setAxisTop] = useState(0);

	useLayoutEffect(() => {
		const track = trackRef.current;
		const dotRow = firstDotRowRef.current;
		if (!track || !dotRow) return;
		const update = () => {
			setAxisWidth(track.scrollWidth);
			setAxisTop(dotRow.offsetTop + dotRow.offsetHeight / 2);
		};
		update();
		const observer = new ResizeObserver(update);
		observer.observe(track);
		return () => observer.disconnect();
	}, []);

	const scrollBy = (direction: 1 | -1) => {
		const track = trackRef.current;
		if (!track) return;
		// Ширина одной карточки года + gap (см. `.gallery-history__year`/
		// `.gallery-history__track` в теме) — на шаг вперёд/назад, не на
		// случайную величину.
		track.scrollBy({ left: direction * 284, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
	};

	return (
		<section className="gallery-section">
			<div className="gallery-container">
				<Stack direction="horizontal" justify="start" align="center" spacing="x4">
					<Typography variant="h2" as="h2" className="gallery-display-tracking">
						По годам
					</Typography>
					<Stack direction="horizontal" spacing="x2">
						<IconButton variant="outlined" iconName={Icons.ArrowLeft} aria-label="Прокрутить историю влево" onClick={() => scrollBy(-1)} />
						<IconButton variant="outlined" iconName={Icons.ArrowRight} aria-label="Прокрутить историю вправо" onClick={() => scrollBy(1)} />
					</Stack>
				</Stack>

				<div className="gallery-history__wrap" style={{ marginTop: 'var(--size-spacing-x6)' }}>
					<div className="gallery-history__track" ref={trackRef}>
						<div className="gallery-history__axis" style={{ width: axisWidth, top: axisTop }} aria-hidden="true" />
						{YEAR_GROUPS.map(([year, titles], index) => (
							<div key={year ?? 'unknown'} className="gallery-history__year">
								<Typography variant="h3" as="span" className={year ? 'gallery-accent' : undefined} color={year ? undefined : 'colorTextGreyInactive'}>
									{year ?? 'Год не указан'}
								</Typography>
								<div className="gallery-history__dot-row" ref={index === 0 ? firstDotRowRef : undefined} aria-hidden="true">
									<span className="gallery-history__dot" />
								</div>
								<Stack direction="vertical" spacing="x1">
									{titles.map((title) => (
										<Typography key={title} variant="body3" as="p" color="colorTextGreyInactive">
											{title}
										</Typography>
									))}
								</Stack>
							</div>
						))}
					</div>
					<div className="gallery-history__fade" aria-hidden="true" />
				</div>
			</div>
		</section>
	);
}
