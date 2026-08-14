import { ThemeProvider } from '@sibur/design-system-react';

import { AboutSection } from './components/AboutSection';
import { HeroSection } from './components/HeroSection';
import { HistorySection } from './components/HistorySection';
import { MapSection } from './components/MapSection';
import { ObjectsSection } from './components/ObjectsSection';
import { StatsSection } from './components/StatsSection';
import { useDeepLink } from './hooks/useDeepLink';
import './theme/gallery-theme.scss';

/**
 * Порядок секций — прямое требование ТЗ («Раздел объектов»/структура
 * страницы): первый экран → о проекте → ключевые показатели → таймлайн по
 * годам → карта → плитка объектов (без заголовка секции) → процесс создания.
 * `ProcessSection` временно скрыт по просьбе пользователя (2026-08-07) —
 * компонент цел в `components/ProcessSection.tsx`, просто не рендерится.
 */
function App() {
	const [expandedSlug, setExpandedSlug] = useDeepLink();

	const onToggle = (slug: string) => {
		setExpandedSlug(expandedSlug === slug ? null : slug);
	};

	return (
		<ThemeProvider isRoot theme="light">
			<div className="gallery-theme">
				<HeroSection />
				<AboutSection />
				<StatsSection />
				<HistorySection />
				<MapSection />
				<ObjectsSection expandedSlug={expandedSlug} onToggle={onToggle} />
			</div>
		</ThemeProvider>
	);
}

export default App;
