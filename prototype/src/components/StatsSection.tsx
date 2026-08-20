import { Grid, GridItem, Typography } from '@sibur/design-system-react';

/**
 * «Ключевые показатели» — финальные цифры заказчика («Фактура для сайта
 * 2026-08-20.docx», вводный блок), не расчёт по `ART_OBJECTS`: это цифры
 * всей программы «АртНаЗавод» по компании, а не только по объектам,
 * попавшим в этот прототип с готовыми фото (их меньше — материалы на часть
 * программы ещё не переданы, см. `CLAUDE.md`).
 *
 * «ХХ тыс. м² искусства» — заказчик сам оставил площадь как плейсхолдер в
 * исходном тексте (не досчитана на момент передачи материалов), здесь
 * воспроизведено дословно, а не подставлено правдоподобное число.
 */
const STATS = [
	{ value: '40+', label: 'арт-объектов', variant: 'teal' },
	{ value: '12', label: 'регионов уже охвачено', variant: 'warm' },
	{ value: 'ХХ тыс.', label: 'м² искусства', variant: 'light' },
	{ value: '~7 000 км', label: 'от западной до восточной точки проекта', variant: 'gradient' },
	{ value: '3200 м²', label: 'самый большой мурал', variant: 'teal' },
] as const;

const TEXT_COLOR_ON_DARK = 'colorTextWhiteInverse' as const;
const CAPTION_COLOR_ON_DARK = 'colorTextLightInactive' as const;

export function StatsSection() {
	return (
		<section className="gallery-section">
			<div className="gallery-container">
				<Grid columns={5} gap="x6" className="gallery-stats__grid">
					{STATS.map((stat) => (
						<GridItem key={stat.label}>
							<div className={`gallery-stat-card gallery-stat-card--${stat.variant}`}>
								<Typography
									variant="h1"
									as="span"
									color={stat.variant === 'light' ? undefined : TEXT_COLOR_ON_DARK}
									className="gallery-display-tracking gallery-text-wrap"
								>
									{stat.value}
								</Typography>
								<Typography variant="body2" as="p" color={stat.variant === 'light' ? 'colorTextGreyInactive' : CAPTION_COLOR_ON_DARK}>
									{stat.label}
								</Typography>
							</div>
						</GridItem>
					))}
				</Grid>
			</div>
		</section>
	);
}
