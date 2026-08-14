import { Grid, GridItem, Stack, Typography } from '@sibur/design-system-react';

/**
 * «О проекте» — описание концепции прототипным текстом, собранным из
 * реальных формулировок реестра (задача 31: описания резервуаров/муралов
 * сплошь говорят об одном и том же принципе — заводская архитектура как
 * холст для локального сюжета региона). Это не дословная цитата ТЗ
 * заказчика (в реестре нет отдельного «текста о проекте» как такового) —
 * честная сборка из подтверждённых фактов, а не автора-фантазия.
 */
export function AboutSection() {
	return (
		<section className="gallery-section">
			<div className="gallery-container">
				{/* Отступ логотип↔заголовок — 72px, втрое больше шага x6 (24px):
				    вне шкалы DS (та кончается на x10=40px), поэтому не токен. */}
				<Stack direction="horizontal" align="center" className="gallery-about__heading" style={{ gap: '72px' }}>
					<img className="gallery-about__logo" src="/logo/artnazavod-logo.svg" alt="АртНаЗавод" />
					<Typography variant="h2" as="h2" className="gallery-display-tracking" style={{ maxWidth: 860 }}>
						Промышленное искусство СИБУРа — <span className="gallery-accent-brand">галерея под открытым небом</span> на территории предприятий компании
					</Typography>
				</Stack>
				{/* 60px — вне шкалы DS (та кончается на x10=40px), по прямому
				    решению пользователя, 2026-08-07. */}
				<Grid columns={2} gap="x8" style={{ marginTop: '60px' }} className="gallery-about__grid">
					<GridItem>
						<Typography variant="body1" as="p" color="colorTextGreyInactive">
							«АртНаЗавод» — программа СИБУРа по созданию муралов и арт-объектов на
							действующих производственных площадках. Резервуары, ресиверы,
							градирни, защитные экраны и фасады цехов становятся полотном для
							сюжетов, связанных с местом: краснокнижная природа Тобольска,
							звериный стиль Пермского края, стихи Тукая на резервуарах Казани,
							национальные костюмы Татарстана на муралах Нижнекамска, символика
							сотрудничества России и Китая на площадке в Свободном.
						</Typography>
					</GridItem>
					<GridItem>
						<Typography variant="body1" as="p" color="colorTextGreyInactive">
							Каждый объект решает две задачи одновременно: становится точкой
							притяжения для сотрудников и жителей города и рассказывает о самом
							производстве — его продукции, процессах и людях — языком,
							понятным без специального образования.
						</Typography>
					</GridItem>
				</Grid>
			</div>
		</section>
	);
}
