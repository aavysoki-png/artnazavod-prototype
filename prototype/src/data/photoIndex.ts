/**
 * Список фото объектов, читаемый при загрузке страницы из `photos/index.json`.
 *
 * Зачем: фото меняют коллеги через GitHub-зеркало, а собрать сайт там нельзя
 * (`@sibur/*` в корп-Artifactory). Поэтому выкладка фото — это копирование
 * папки `photos/` вместе с индексом, без пересборки бандла. Индекс пишет
 * `scripts/build-objects-ts.mjs` (в `npm run build` и в CI зеркала).
 *
 * Списки, вшитые в `objects.ts` при сборке, остаются запасным вариантом:
 * индекс не пришёл (dev-сервер, singlefile-версия, сбой сети) — сайт
 * показывает то, с чем был собран.
 */

type PhotoIndex = Readonly<Record<string, readonly string[]>>;

let index: PhotoIndex | null = null;

const TIMEOUT_MS = 3000;

function isPhotoIndex(value: unknown): value is PhotoIndex {
	if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
	return Object.values(value).every((list) => Array.isArray(list) && list.every((p) => typeof p === 'string'));
}

/** Грузит индекс; никогда не бросает — при любой ошибке остаются вшитые списки. */
export async function loadPhotoIndex(): Promise<void> {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
	try {
		// no-cache: индекс меняется без смены имени, браузер обязан перепроверить.
		const response = await fetch('photos/index.json', { cache: 'no-cache', signal: controller.signal });
		if (!response.ok) return;
		// Dev-сервер на отсутствующий файл отдаёт index.html с 200 — это не JSON.
		const data: unknown = await response.json();
		if (isPhotoIndex(data)) index = data;
	} catch {
		// остаются вшитые списки
	} finally {
		clearTimeout(timer);
	}
}

/** Фото объекта: из индекса, если он загружен и знает объект, иначе вшитые. */
export function photosFor(slug: string, baked: readonly string[]): readonly string[] {
	return index?.[slug] ?? baked;
}
