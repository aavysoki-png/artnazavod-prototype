import { Grid, GridItem, Typography } from '@sibur/design-system-react';

/**
 * «Ключевые показатели» — финальные цифры заказчика («Фактура_для_сайта_2026_08_20_
 * с_площадями.docx», вводный блок), не расчёт по `ART_OBJECTS`: это цифры
 * всей программы «АртНаЗавод» по компании, а не только по объектам,
 * попавшим в этот прототип с готовыми фото (их меньше — материалы на часть
 * программы ещё не переданы, см. `CLAUDE.md`).
 *
 * Площадь перестала быть плейсхолдером 2026-09-04: заказчик прислал
 * фактуру «с площадями» и каталог «АртНаЗавод_Каталог_муралов_СИБУР.xlsx».
 * 33 тыс. м² — цифра заказчика из фактуры, и она сходится с каталогом:
 * сумма колонки «фактическая площадь рисунка» по всем 38 строкам даёт
 * 31 783 м², то есть заявленное округление честное, а не выдуманное.
 * «3200 м²» (самый большой мурал) — это «Реки» на НКНХ, подтверждено
 * каталогом; в самой фактуре напротив этой цифры стоит пометка заказчика
 * «на перепроверке».
 */
const STATS = [
	{ value: '40+', label: 'арт-объектов', variant: 'teal' },
	{ value: '12', label: 'регионов уже охвачено', variant: 'warm' },
	{ value: '33 тыс.', label: 'м² искусства', variant: 'light' },
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
