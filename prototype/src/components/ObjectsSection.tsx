import { Typography } from '@sibur/design-system-react';

import { ART_OBJECTS } from '../data/objects';
import { ObjectCard } from './ObjectCard';

interface ObjectsSectionProps {
	readonly expandedSlug: string | null;
	readonly onToggle: (slug: string) => void;
}

/**
 * «Раздел объектов» из ТЗ: «После карты без дополнительного заголовка
 * отображается плитка фотографий всех объектов» — заголовка секции
 * намеренно нет, это прямое требование, не пропуск.
 */
export function ObjectsSection({ expandedSlug, onToggle }: ObjectsSectionProps) {
	return (
		<section className="gallery-section" aria-label="Объекты «АртНаЗавод»">
			<div className="gallery-container">
				<div className="gallery-grid">
					{ART_OBJECTS.map((object) => (
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
