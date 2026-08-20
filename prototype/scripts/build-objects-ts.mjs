// Генерирует prototype/src/data/objects.ts из final-content-manifest.json +
// фактического списка файлов в public/photos/<slug>/ и public/media/<slug>/
// (заполняются prepare-final-media.mjs). Файл — не рантайм-fetch: Vite
// fs.allow не отдаёт файлы вне src/, поэтому итог — обычный TS-модуль,
// импортируемый как код, просто пишется скриптом, а не руками.

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const prototypeRoot = path.resolve(__dirname, '..');
const manifest = JSON.parse(readFileSync(path.join(__dirname, 'final-content-manifest.json'), 'utf8'));

function listOutputFiles(dir) {
	try {
		return readdirSync(dir)
			.filter((f) => !f.startsWith('.'))
			.sort((a, b) => a.localeCompare(b, 'en'));
	} catch {
		return [];
	}
}

function tsString(value) {
	return JSON.stringify(value);
}

function tsStringOrNull(value) {
	return value === null || value === undefined ? 'null' : JSON.stringify(value);
}

const entries = manifest.objects.map((o) => {
	const photos = listOutputFiles(path.join(prototypeRoot, 'public', 'photos', o.slug)).map((f) => `/photos/${o.slug}/${f}`);
	const videos = listOutputFiles(path.join(prototypeRoot, 'public', 'media', o.slug)).map((f) => `/media/${o.slug}/${f}`);
	return { ...o, photos, videos, facts: o.facts ?? [] };
});

const lines = [];
lines.push('/**');
lines.push(' * Реестр объектов «АртНаЗавод» — финальная фактура заказчика (2026-08-20).');
lines.push(' *');
lines.push(' * Этот файл СГЕНЕРИРОВАН скриптом `scripts/build-objects-ts.mjs` из');
lines.push(' * `scripts/final-content-manifest.json` (тексты) и содержимого');
lines.push(' * `public/photos/<slug>/`, `public/media/<slug>/` (медиа, подготовлены');
lines.push(' * `scripts/prepare-final-media.mjs`). Не редактировать руками — правки');
lines.push(' * потеряются при следующем запуске генератора. Чтобы поправить текст —');
lines.push(' * правь манифест и перезапускай `node scripts/build-objects-ts.mjs`.');
lines.push(' *');
lines.push(' * Объекты без найденной папки с фото у заказчика в эту версию не вошли —');
lines.push(' * см. `excludedNoFolder` в манифесте.');
lines.push(' */');
lines.push('');
lines.push('export interface ArtObjectMedia {');
lines.push('\treadonly photos: readonly string[];');
lines.push('\treadonly videos: readonly string[];');
lines.push('}');
lines.push('');
lines.push('export interface ArtObjectFact {');
lines.push('\treadonly label: string;');
lines.push('\treadonly value: string;');
lines.push('}');
lines.push('');
lines.push('export interface ArtObject {');
lines.push('\treadonly slug: string;');
lines.push('\treadonly facility: string;');
lines.push('\treadonly city: string;');
lines.push('\treadonly title: string;');
lines.push('\treadonly year: string | null;');
lines.push('\treadonly description: string | null;');
lines.push('\treadonly artist: string | null;');
lines.push('\t/** Объект/техника/площадь и другие факты производства — докс заказчика, поле «Общая информация». */');
lines.push('\treadonly facts: readonly ArtObjectFact[];');
lines.push('\treadonly media: ArtObjectMedia;');
lines.push('}');
lines.push('');
lines.push('export const ART_OBJECTS: readonly ArtObject[] = [');
for (const e of entries) {
	lines.push('\t{');
	lines.push(`\t\tslug: ${tsString(e.slug)},`);
	lines.push(`\t\tfacility: ${tsString(e.facility)},`);
	lines.push(`\t\tcity: ${tsString(e.city)},`);
	lines.push(`\t\ttitle: ${tsString(e.title)},`);
	lines.push(`\t\tyear: ${tsStringOrNull(e.year)},`);
	lines.push(`\t\tdescription: ${tsStringOrNull(e.description)},`);
	lines.push(`\t\tartist: ${tsStringOrNull(e.artist)},`);
	lines.push('\t\tfacts: [');
	for (const fact of e.facts) {
		lines.push(`\t\t\t{ label: ${tsString(fact.label)}, value: ${tsString(fact.value)} },`);
	}
	lines.push('\t\t],');
	lines.push('\t\tmedia: {');
	lines.push(`\t\t\tphotos: [${e.photos.map(tsString).join(', ')}],`);
	lines.push(`\t\t\tvideos: [${e.videos.map(tsString).join(', ')}],`);
	lines.push('\t\t},');
	lines.push('\t},');
}
lines.push('] as const;');
lines.push('');
lines.push('export const OBJECTS_COUNT = ART_OBJECTS.length;');
lines.push('export const CITIES_COUNT = new Set(ART_OBJECTS.map((o) => o.city)).size;');
lines.push('export const FACILITIES_COUNT = new Set(ART_OBJECTS.map((o) => o.facility)).size;');
lines.push('');
lines.push('/**');
lines.push(' * Год как число для сортировки/группировки — берёт первые 4 цифры из');
lines.push(' * `year` (у диапазонов вида «2022/2026» это 2022). `null` остаётся');
lines.push(' * `null`.');
lines.push(' */');
lines.push('export function yearOf(object: ArtObject): number | null {');
lines.push('\tif (!object.year) return null;');
lines.push('\tconst match = object.year.match(/\\d{4}/);');
lines.push('\treturn match ? Number(match[0]) : null;');
lines.push('}');
lines.push('');
lines.push('const KNOWN_YEARS = ART_OBJECTS.map(yearOf).filter((y): y is number => y !== null);');
lines.push('export const YEARS_LABEL = `${Math.min(...KNOWN_YEARS)}–${Math.max(...KNOWN_YEARS)}`;');
lines.push('');

writeFileSync(path.join(prototypeRoot, 'src', 'data', 'objects.ts'), lines.join('\n'), 'utf8');

const noMedia = entries.filter((e) => e.photos.length === 0);
console.log(`Записано ${entries.length} объектов в src/data/objects.ts`);
if (noMedia.length > 0) {
	console.warn('Внимание — объекты без фото (проверь public/photos/<slug>/):', noMedia.map((e) => e.slug));
}
