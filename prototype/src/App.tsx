import { lazy, Suspense } from 'react';
import { ThemeProvider } from '@sibur/design-system-react';

import { AboutSection } from './components/AboutSection';
import { ErrorBoundary } from './components/ErrorBoundary';
import { HeroSection } from './components/HeroSection';
import { HistorySection } from './components/HistorySection';
import { ObjectsSection } from './components/ObjectsSection';
import { StatsSection } from './components/StatsSection';
import { useDeepLink } from './hooks/useDeepLink';
import './theme/gallery-theme.scss';

// Leaflet (карта) — тяжёлая библиотека, нужна только когда пользователь
// долистает до карты, не для первого экрана — ленивая загрузка своим
// чанком вместо склейки в основной бандл (2026-08-21, аудит перед
// публикацией). Обёрнута в ErrorBoundary (не только Suspense) — если чанк
// не подгрузится (сетевой сбой у реального посетителя, либо пакет
// `dist-singlefile/`, где отдельного чанка физически нет), падает только
// секция карты, а не всё приложение: без границы ошибок необработанный
// сбой `React.lazy` размонтировал бы вообще всё дерево от корня.
const MapSection = lazy(() => import('./components/MapSection').then((m) => ({ default: m.MapSection })));

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
				<ErrorBoundary>
					<Suspense fallback={null}>
						<MapSection />
					</Suspense>
				</ErrorBoundary>
				<ObjectsSection expandedSlug={expandedSlug} onToggle={onToggle} />
			</div>
		</ThemeProvider>
	);
}

export default App;
