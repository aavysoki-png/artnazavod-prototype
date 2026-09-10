import { useEffect, useRef } from 'react';
import { IconButton, Modal, Typography } from '@sibur/design-system-react';
import { Icons } from '@sibur/design-tokens/js/iconfont';

export type MediaItem = { kind: 'photo'; src: string } | { kind: 'video'; src: string };

interface MediaLightboxProps {
	readonly media: readonly MediaItem[];
	readonly index: number;
	readonly title: string;
	readonly onIndexChange: (index: number) => void;
	readonly onClose: () => void;
}

/**
 * Просмотр кадра на весь экран (запрос пользователя, 2026-09-10) — и на
 * десктопе, и на мобильной.
 *
 * Запрет ТЗ на Popup/Drawer относится к раскрытию КАРТОЧКИ объекта (оно
 * обязано оставаться Inline Expansion в потоке страницы) — здесь же
 * временный просмотр одного кадра поверх уже раскрытой карточки, состояние
 * страницы под ним не меняется.
 *
 * `Modal` из ДС даёт ровно две нужные вещи — портал в корень приложения (иначе
 * `position: fixed` внутри full-bleed карусели с `transform`-предками ведёт
 * себя непредсказуемо) и блокировку прокрутки страницы под слоем. Оверлея,
 * кнопки закрытия и клавиатуры он не несёт, поэтому они здесь свои.
 */
export function MediaLightbox({ media, index, title, onIndexChange, onClose }: MediaLightboxProps) {
	const layerRef = useRef<HTMLDivElement>(null);
	const touchStartX = useRef<number | null>(null);
	const item = media[index];

	useEffect(() => {
		// Фокус на слой: без него клавиатура ушла бы к элементу под слоем, а
		// screen reader зачитал бы страницу позади просмотра.
		layerRef.current?.focus({ preventScroll: true });
	}, []);

	useEffect(() => {
		// Слушаем на document, а не на слое: слой живёт в портале, и фокус
		// внутри него может уехать на кнопку или на контролы видео.
		const onKeyDown = (event: globalThis.KeyboardEvent) => {
			if (event.key === 'Escape') {
				event.preventDefault();
				onClose();
			} else if (event.key === 'ArrowLeft' && media.length > 1) {
				event.preventDefault();
				onIndexChange(index - 1);
			} else if (event.key === 'ArrowRight' && media.length > 1) {
				event.preventDefault();
				onIndexChange(index + 1);
			}
		};
		document.addEventListener('keydown', onKeyDown);
		return () => document.removeEventListener('keydown', onKeyDown);
	}, [index, media.length, onClose, onIndexChange]);

	if (!item) return null;

	// Листание пальцем. Нативной прокрутки здесь нет (кадр ровно один, он
	// вписан в экран), поэтому горизонтальный жест приходится читать самим:
	// порог 48px отсекает дрожание пальца при обычном тапе, а сравнение с
	// вертикальной дельтой — вертикальный смахивающий жест браузера.
	const onTouchStart = (event: React.TouchEvent) => {
		touchStartX.current = event.touches[0]?.clientX ?? null;
	};

	const onTouchEnd = (event: React.TouchEvent) => {
		const start = touchStartX.current;
		touchStartX.current = null;
		if (start === null || media.length <= 1) return;
		const delta = (event.changedTouches[0]?.clientX ?? start) - start;
		if (Math.abs(delta) < 48) return;
		onIndexChange(delta < 0 ? index + 1 : index - 1);
	};

	return (
		<Modal open>
			<div
				className="gallery-lightbox"
				ref={layerRef}
				tabIndex={-1}
				role="dialog"
				aria-modal="true"
				aria-label={`${title} — просмотр на весь экран`}
				onTouchStart={onTouchStart}
				onTouchEnd={onTouchEnd}
				// Клик мимо кадра закрывает просмотр — привычное поведение
				// лайтбокса. Проверка на сам слой обязательна: без неё закрытием
				// оборачивался бы и клик по стрелке или по самому фото.
				onClick={(event) => {
					if (event.target === event.currentTarget) onClose();
				}}
			>
				<div className="gallery-lightbox__bar">
					{media.length > 1 ? (
						<Typography variant="body2" as="span" color="colorTextLightActive">
							{index + 1} / {media.length}
						</Typography>
					) : (
						<span />
					)}
					<IconButton variant="overlay" size="large" iconName={Icons.Close} aria-label="Закрыть просмотр" onClick={onClose} />
				</div>

				{item.kind === 'video' ? (
					// eslint-disable-next-line jsx-a11y/media-has-caption
					<video className="gallery-lightbox__media" src={item.src} controls autoPlay playsInline />
				) : (
					<img className="gallery-lightbox__media" src={item.src} alt={title} />
				)}

				{media.length > 1 ? (
					<>
						<IconButton
							variant="overlay"
							size="large"
							iconName={Icons.NavArrowLeft}
							aria-label="Предыдущий кадр"
							className="gallery-lightbox__nav gallery-lightbox__nav--prev"
							onClick={() => onIndexChange(index - 1)}
						/>
						<IconButton
							variant="overlay"
							size="large"
							iconName={Icons.NavArrowRight}
							aria-label="Следующий кадр"
							className="gallery-lightbox__nav gallery-lightbox__nav--next"
							onClick={() => onIndexChange(index + 1)}
						/>
					</>
				) : null}

				{/* Подсказка только для мыши и клавиатуры — на тачскрине она врёт
				    (Esc нет, «клик по фону» — не тот жест), поэтому на узком
				    экране скрыта через CSS. */}
				<Typography variant="body3" as="p" className="gallery-lightbox__hint" color="colorTextLightInactive">
					Esc или клик по фону — закрыть
				</Typography>
			</div>
		</Modal>
	);
}
