import { useState } from 'react';
import { IconButton } from '@sibur/design-system-react';
import { Icons } from '@sibur/design-tokens/js/iconfont';

/**
 * Финальная хиро-нарезка заказчика (2026-08-20, папка «___НАРЕЗКА для
 * шапки»), транскодирована `scripts/prepare-final-media.mjs` (сырые дампы
 * с камер/дронов пережаты под веб — H.264 ≤1080p). Файлы лежат в
 * `public/hero/` и с переездом в корпоративный GitLab (2026-09-04) входят
 * в репозиторий через Git LFS — прежняя оговорка «вне git-трекинга»
 * больше не действует. Порядок — не смысловая последовательность, а
 * порядок файлов в исходной папке заказчика.
 */
// Нумерация сплошная и задаётся генератором. Поставка 2026-09-10 заменила
// нарезку шапки целиком: прежних роликов (в том числе двух, снятых с показа
// 2026-09-04) в новой папке заказчика нет вообще, пришло пять других файлов —
// поэтому `heroExclude` пуст, а список тут вырос до hero-1..hero-5.
const HERO_VIDEOS: readonly string[] = [
	'hero/hero-1.mp4',
	'hero/hero-2.mp4',
	'hero/hero-3.mp4',
	'hero/hero-4.mp4',
	'hero/hero-5.mp4',
];

/**
 * Первый экран (ТЗ, п.7): «Полноэкранная фотография, логотип проекта,
 * название, слоган, ключевые показатели». Логотип проекта — рядом с
 * заголовком в «О проекте», здесь просто видеоряд. Шапки сайта (`<Header>`
 * из DS) здесь нет и не будет (2026-08-20) — раздел встраивается в уже
 * существующий sibur.ru, у которого своя шапка; здесь дублирующая была бы
 * лишней.
 *
 * Один `<video>` в моменте, не три слоем друг на друге — исходники по
 * 250-450 МБ, `key={src}` форсирует React пересоздать элемент при смене
 * индекса, чтобы браузер не путал состояние загрузки между разными файлами.
 * Звук выключен по умолчанию (`muted`) — то же требование, что у автоплея:
 * без `muted` браузеры автовоспроизведение с звуком просто не запустят.
 *
 * Ролики листаются сами: `onEnded` переключает на следующий (без `loop` —
 * иначе видео зациклилось бы само на себе и `onEnded` не наступил бы
 * никогда). После последнего — снова первый, `goTo` считает индекс по
 * модулю. Стрелки остаются рядом как ручное переключение, не заменяют
 * автопереход, а дополняют его.
 */
export function HeroSection() {
	const [activeVideo, setActiveVideo] = useState(0);

	const goTo = (index: number): void => setActiveVideo(((index % HERO_VIDEOS.length) + HERO_VIDEOS.length) % HERO_VIDEOS.length);

	return (
		<div className="gallery-hero">
			<div className="gallery-hero__media" aria-hidden="true">
				<video
					key={HERO_VIDEOS[activeVideo]}
					className="gallery-hero__video"
					src={HERO_VIDEOS[activeVideo]}
					muted
					autoPlay
					playsInline
					onEnded={() => goTo(activeVideo + 1)}
				/>
			</div>
			<div className="gallery-hero__scrim" aria-hidden="true" />

			{HERO_VIDEOS.length > 1 ? (
				<>
					<IconButton
						variant="overlay"
						iconName={Icons.NavArrowLeft}
						aria-label="Предыдущее видео"
						className="gallery-hero__nav gallery-hero__nav--prev"
						onClick={() => goTo(activeVideo - 1)}
					/>
					<IconButton
						variant="overlay"
						iconName={Icons.NavArrowRight}
						aria-label="Следующее видео"
						className="gallery-hero__nav gallery-hero__nav--next"
						onClick={() => goTo(activeVideo + 1)}
					/>
				</>
			) : null}
		</div>
	);
}
