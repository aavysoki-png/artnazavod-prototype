import { Grid, GridItem, Stack, Typography } from '@sibur/design-system-react';

const STEPS = [
	{ title: 'Поиск идей', text: 'Креативное агентство предлагает варианты сюжета, отталкиваясь от места и продукции площадки.' },
	{ title: 'Отбор шорт-листа', text: 'Экспертная группа отбирает несколько эскизов из предложенных вариантов.' },
	{ title: 'Голосование', text: 'Сотрудники предприятия голосуют за понравившийся сюжет.' },
	{ title: 'Финализация эскиза', text: 'Агентство дорабатывает выбранный сюжет до финального эскиза для нанесения.' },
];

const AUTHORSHIP_EXAMPLES = [
	{ label: 'Креативное агентство', example: 'Резервуар «Минин», ресиверы «Чкалов» — СИБУР Кстово' },
	{ label: 'Идея сотрудника предприятия', example: '«Автобус» — Нижнекамскнефтехим' },
	{ label: 'Профессиональная команда художников', example: 'Резервуары «Реки» — художники из Москвы и Йошкар-Олы' },
];

/**
 * «Процесс создания» — единственный объект реестра с описанной пошаговой
 * механикой отбора сюжета — резервуар «Минин» (СИБУР Кстово, задача 31):
 * «поиск идей креативным агентством, отбор шорт-листа экспертной группой,
 * голосование среди сотрудников предприятия, дорисовка сюжета агентством».
 * Остальные 34 объекта такой детализации не содержат — раздел не выдаёт этот
 * процесс за универсальный для всех объектов, а честно называет его
 * задокументированным примером и отдельно показывает, что автор эскиза
 * фактически варьируется (агентство / сотрудник / команда художников).
 */
export function ProcessSection() {
	return (
		<section className="gallery-section">
			<div className="gallery-container">
				<Typography variant="h2" as="h2" className="gallery-display-tracking">
					Как рождается сюжет
				</Typography>
				<Typography variant="body2" as="p" color="colorTextGreyInactive" style={{ marginTop: 'var(--size-spacing-x2)', maxWidth: 640 }}>
					Задокументированный пример механики — резервуар «Минин» на СИБУР
					Кстово. Для большинства других объектов реестр не содержит такой же
					детализации процесса.
				</Typography>

				<Grid columns={4} gap="x6" className="gallery-process__grid" style={{ marginTop: 'var(--size-spacing-x6)' }}>
					{STEPS.map((step, index) => (
						<GridItem key={step.title}>
							<Typography variant="h3" as="span" className="gallery-accent gallery-display-tracking">
								{String(index + 1).padStart(2, '0')}
							</Typography>
							<Typography variant="subtitle2" as="h3" className="gallery-text-wrap" style={{ marginTop: 'var(--size-spacing-x2)' }}>
								{step.title}
							</Typography>
							<Typography variant="body3" as="p" color="colorTextGreyInactive" style={{ marginTop: 'var(--size-spacing-x1)' }}>
								{step.text}
							</Typography>
						</GridItem>
					))}
				</Grid>

				<Stack direction="vertical" spacing="x3" style={{ marginTop: 'var(--size-spacing-x8)' }}>
					<Typography variant="subtitle2" as="h3">
						Кто автор эскиза — по факту разное
					</Typography>
					<Grid columns={3} gap="x6" className="gallery-authorship__grid">
						{AUTHORSHIP_EXAMPLES.map((item) => (
							<GridItem key={item.label}>
								<div className="gallery-authorship-card">
									<Typography variant="body2" as="p">
										{item.label}
									</Typography>
									<Typography variant="body3" as="p" color="colorTextGreyInactive" style={{ marginTop: 'var(--size-spacing-x2)' }}>
										{item.example}
									</Typography>
								</div>
							</GridItem>
						))}
					</Grid>
				</Stack>
			</div>
		</section>
	);
}
