import { SegmentControl, Typography } from '@sibur/design-system-react';
import type { SegmentControlOption } from '@sibur/design-system-react';
import { useMemo, useState } from 'react';

import { ART_OBJECTS, areaOf, sortYearOf } from '../data/objects';
import type { ArtObject } from '../data/objects';
import { ObjectCard } from './ObjectCard';

interface ObjectsSectionProps {
	readonly expandedSlug: string | null;
	readonly onToggle: (slug: string) => void;
}

type SortMode = 'date' | 'facility' | 'area';

const SORT_OPTIONS: readonly SegmentControlOption[] = [
	{ id: 'date', label: 'Сначала новые' },
	{ id: 'facility', label: 'По предприятию' },
	{ id: 'area', label: 'По площади' },
];

/**
 * Сортировки плитки. Порядок по умолчанию — по дате, новые сверху (решение
 * пользователя от 2026-09-10); до этого плитка шла в порядке манифеста, то
 * есть фактически произвольно — на это и пожаловался заказчик.
 *
 * Общее правило для объектов без данных (площадь указана у 31 из 33): они
 * всегда уходят в конец списка, а не считаются нулём — иначе мурал без
 * замеров выглядел бы самым маленьким. Сортировка массива стабильная (это
 * гарантирует спека JS), поэтому равные значения сохраняют порядок манифеста.
 */
function sortObjects(objects: readonly ArtObject[], mode: SortMode): readonly ArtObject[] {
	const byDateDesc = (a: ArtObject, b: ArtObject) => {
		const ya = sortYearOf(a);
		const yb = sortYearOf(b);
		if (ya === yb) return 0;
		if (ya === null) return 1;
		if (yb === null) return -1;
		return yb - ya;
	};

	if (mode === 'date') return [...objects].sort(byDateDesc);

	if (mode === 'area') {
		return [...objects].sort((a, b) => {
			const aa = areaOf(a);
			const ab = areaOf(b);
			if (aa === ab) return 0;
			if (aa === null) return 1;
			if (ab === null) return -1;
			return ab - aa;
		});
	}

	// По предприятию: сами предприятия — по алфавиту (предсказуемее, чем
	// порядок появления в манифесте), внутри предприятия — снова новые сверху,
	// чтобы группа читалась как хронология площадки.
	return [...objects].sort((a, b) => {
		const byFacility = a.facility.localeCompare(b.facility, 'ru');
		return byFacility !== 0 ? byFacility : byDateDesc(a, b);
	});
}

/**
 * «Раздел объектов» из ТЗ: «После карты без дополнительного заголовка
 * отображается плитка фотографий всех объектов» — заголовка секции
 * намеренно нет, это прямое требование, не пропуск.
 */
export function ObjectsSection({ expandedSlug, onToggle }: ObjectsSectionProps) {
	const [sortMode, setSortMode] = useState<SortMode>('date');
	const objects = useMemo(() => sortObjects(ART_OBJECTS, sortMode), [sortMode]);
	const selectedOption = SORT_OPTIONS.find((option) => option.id === sortMode);

	return (
		<section className="gallery-section" aria-label="Объекты «АртНаЗавод»">
			<div className="gallery-container">
				<div className="gallery-sort">
					<Typography variant="body2" as="span" color="colorTextGreyInactive">
						Порядок
					</Typography>
					<SegmentControl
						size="small"
						options={[...SORT_OPTIONS]}
						selectedOption={selectedOption}
						onChange={(option) => setSortMode(option.id as SortMode)}
					/>
				</div>
				<div className="gallery-grid">
					{objects.map((object) => (
						<ObjectCard key={object.slug} object={object} expanded={expandedSlug === object.slug} onToggle={onToggle} />
					))}
				</div>
				{expandedSlug && !ART_OBJECTS.some((o) => o.slug === expandedSlug) ? (
					<Typography variant="body2" as="p" color="colorTextGreyInactive" style={{ marginTop: 'var(--size-spacing-x6)' }}>
						Объект по этой ссылке не найден.
					</Typography>
				) : null}
			</div>
		</section>
	);
}
