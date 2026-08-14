import { useState } from 'react';
import { Header, IconButton } from '@sibur/design-system-react';
import { Icons } from '@sibur/design-tokens/js/iconfont';

/**
 * Реальные видео заказчика (14.08.2026) — заменили фото-заглушку
 * «Батискафа». Файлы лежат вне git-трекинга прототипа (`public/hero/`,
 * тот же принцип, что у `public/media/demo-*`), исходники — в
 * `Pilot-sibur-landing-Mural/content/`, скопированы сюда без пережатия
 * (ffmpeg на машине не было). Порядок — не смысловая последовательность,
 * а порядок файлов, которые дал пользователь.
 */
const HERO_VIDEOS: readonly string[] = ['/hero/tnh-shishka.mp4', '/hero/sosedi-sibura.mp4', '/hero/sibur-color.mov'];

/**
 * Первый экран (ТЗ, п.7): «Полноэкранная фотография, логотип проекта,
 * название, слоган, ключевые показатели». Логотип проекта временно скрыт на
 * видео-заглушке по решению пользователя (2026-08-07) — сам логотип теперь
 * стоит рядом с заголовком в «О проекте», здесь остаётся просто видеоряд.
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
		<>
			<Header nameLogo="logoThemeable" />

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
		</>
	);
}
