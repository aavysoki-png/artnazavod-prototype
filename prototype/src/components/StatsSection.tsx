import { Grid, GridItem, Typography } from '@sibur/design-system-react';

import { CITIES_COUNT, FACILITIES_COUNT, OBJECTS_COUNT, YEARS_LABEL } from '../data/objects';

/**
 * «Ключевые показатели» — развёрнутая версия цифр из первого экрана.
 * Разбивка по городам временно скрыта по просьбе пользователя (2026-08-07);
 * тот же расчёт остаётся в `objects.ts` (город → количество можно снова
 * получить через `ART_OBJECTS`), при возврате раздела не нужно ничего
 * пересчитывать заново.
 */
export function StatsSection() {
	return (
		<section className="gallery-section">
			<div className="gallery-container">
				<Grid columns={4} gap="x6" className="gallery-stats__grid">
					<GridItem>
						<div className="gallery-stat-card gallery-stat-card--teal">
							<Typography variant="h1" as="span" color="colorTextWhiteInverse" className="gallery-display-tracking gallery-text-wrap">
								{OBJECTS_COUNT}
							</Typography>
							<Typography variant="body2" as="p" color="colorTextLightInactive">
								арт-объектов
							</Typography>
						</div>
					</GridItem>
					<GridItem>
						<div className="gallery-stat-card gallery-stat-card--warm">
							<Typography variant="h1" as="span" color="colorTextWhiteInverse" className="gallery-display-tracking gallery-text-wrap">
								{CITIES_COUNT}
							</Typography>
							<Typography variant="body2" as="p" color="colorTextLightInactive">
								городов присутствия
							</Typography>
						</div>
					</GridItem>
					<GridItem>
						<div className="gallery-stat-card gallery-stat-card--light">
							<Typography variant="h1" as="span" className="gallery-display-tracking gallery-text-wrap">
								{FACILITIES_COUNT}
							</Typography>
							<Typography variant="body2" as="p" color="colorTextGreyInactive">
								предприятий-площадок
							</Typography>
						</div>
					</GridItem>
					<GridItem>
						<div className="gallery-stat-card gallery-stat-card--gradient">
							<Typography variant="h1" as="span" color="colorTextWhiteInverse" className="gallery-display-tracking gallery-text-wrap">
								{YEARS_LABEL}
							</Typography>
							<Typography variant="body2" as="p" color="colorTextLightInactive">
								годы реализации
							</Typography>
						</div>
					</GridItem>
				</Grid>
			</div>
		</section>
	);
}
