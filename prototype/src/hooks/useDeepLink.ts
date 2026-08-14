import { useCallback, useEffect, useState } from 'react';

/**
 * Deep Link на уровне поведения (ТЗ, п.12) — без серверной части, чисто
 * клиентский `location.hash`. Открытие `#<slug>` должно: показать общий
 * лонгрид (он и так один), проскроллить к нужному объекту, раскрыть его
 * карточку, сохранить URL для шеринга.
 *
 * Прогонка через History API (`pushState`), а не голое присвоение `hash`,
 * чтобы повторный клик по той же карточке (закрытие) не плодил дубли в
 * истории браузера — используется `replaceState`.
 */
export function useDeepLink(): [string | null, (slug: string | null) => void] {
	const [slug, setSlugState] = useState<string | null>(() => {
		const raw = window.location.hash.replace(/^#/, '');
		return raw || null;
	});

	useEffect(() => {
		const onHashChange = () => {
			const raw = window.location.hash.replace(/^#/, '');
			setSlugState(raw || null);
		};
		window.addEventListener('hashchange', onHashChange);
		return () => window.removeEventListener('hashchange', onHashChange);
	}, []);

	const setSlug = useCallback((next: string | null) => {
		const url = next ? `#${next}` : window.location.pathname + window.location.search;
		window.history.replaceState(null, '', url);
		setSlugState(next);
	}, []);

	return [slug, setSlug];
}
