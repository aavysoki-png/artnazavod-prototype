import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
	readonly children: ReactNode;
	/** Что показать вместо упавшего поддерева — по умолчанию просто ничего. */
	readonly fallback?: ReactNode;
}

interface ErrorBoundaryState {
	readonly hasError: boolean;
}

/**
 * React не даёт хук-эквивалента error boundary — только класс. Используется
 * вокруг `React.lazy(...)`-секций (сейчас — карта): если чанк не
 * подгрузился (сетевой сбой у реального посетителя, или в пакете
 * `dist-singlefile/` — там его вообще нет физически, см.
 * `build-singlefile.mjs`), падает только эта секция, а не всё дерево
 * приложения целиком.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	state: ErrorBoundaryState = { hasError: false };

	static getDerivedStateFromError(): ErrorBoundaryState {
		return { hasError: true };
	}

	componentDidCatch(error: Error, info: ErrorInfo): void {
		console.error('ErrorBoundary поймал ошибку в дочернем дереве:', error, info.componentStack);
	}

	render(): ReactNode {
		if (this.state.hasError) return this.props.fallback ?? null;
		return this.props.children;
	}
}
