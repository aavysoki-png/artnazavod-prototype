// Пост-обработка обычного `npm run build`: собирает пакет передачи —
// HTML с инлайненными JS/CSS/фото (base64 data:-URI) + папки `media/`,
// `hero/` РЯДОМ с ним (относительные пути, без инлайна). Раньше это был
// ровно один файл, но с финальной фактурой заказчика (2026-08-20) видео
// объектов+хиро выросли до сотен МБ даже сжатыми — base64 (+33% к размеру)
// в одном HTML-файле для видео такого объёма нежизнеспособен, браузеры
// плохо тянут гигантские data:-URI video. Компромисс: маленькая папка,
// которую так же просто зазипить и отправить коллеге, а фото (уже
// компактные после `prepare-final-media.mjs`) по-прежнему инлайнятся —
// открыть index.html двойным кликом всё ещё можно (обычный `file://`
// блокирует ES-модули и `<link>` по CORS, но не блокирует инлайновые
// <script>/<style>, data:-URI и относительные <video src="media/...">).
//
// Не часть обычного dev/build-цикла — отдельная команда для конкретной
// задачи передачи: посмотреть прототип «как есть», без доступа к DS-пакетам
// и без сервера. Реальный dev/build (`npm run dev`/`npm run build`) этот
// скрипт не трогает и не заменяет.
//
// ОГРАНИЧЕНИЕ (с 2026-08-21, после переноса MapSection на React.lazy для
// живого сайта): секция карты грузится отдельным чанком через динамический
// `import()`, а его файла в этом пакете физически нет (не копируется —
// пробовал: копирование главного JS-чанка рядом с уже инлайненной его
// копией в HTML даёт ДВА независимых экземпляра React-модуля на одной
// странице, второй пытается сам примонтироваться поверх первого и ломает
// всё приложение целиком, не только карту — хуже, чем просто отсутствие
// карты). Секция карты обёрнута в ErrorBoundary (`App.tsx`) именно ради
// этого случая — сбой её чанка гасится локально, остальная страница
// (карточки, фото, хиро-видео) работает и открытая двойным кликом по
// `file://`, и через любой сервер. Если карта в пакете передачи всё же
// нужна — смотреть живой стенд (dribble/ВПС), не этот файл.
import { readFileSync, writeFileSync, existsSync, statSync, mkdirSync, cpSync, rmSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const distDir = join(__dirname, '..', 'dist');
const outDir = join(__dirname, '..', 'dist-singlefile', 'АртНаЗавод-прототип');
const outFile = join(outDir, 'index.html');

const MIME_BY_EXT = {
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.png': 'image/png',
	'.svg': 'image/svg+xml',
	'.mp4': 'video/mp4',
	'.woff2': 'font/woff2',
	'.woff': 'font/woff',
	'.ttf': 'font/ttf',
};

function toDataUri(absPath) {
	const ext = extname(absPath).toLowerCase();
	const mime = MIME_BY_EXT[ext];
	if (!mime) throw new Error(`Неизвестный MIME для ${absPath}`);
	const buf = readFileSync(absPath);
	return `data:${mime};base64,${buf.toString('base64')}`;
}

function escapeRegExp(s) {
	return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Инлайнит ссылки на локальные файлы дист-папки, найденные в тексте JS/CSS
// как есть — паттерн строится от реального содержимого dist/, а не
// угадывается. После `base: './'` (vite.config.ts) вид ссылок разный для
// двух случаев:
//   - шрифты (`assets/`) лежат РЯДОМ с самим CSS-файлом (тот же `dist/
//     assets/`), Vite ссылается на них просто именем файла с `./` —
//     `url(./SbrIcons-....woff2?168...)`, без сегмента `assets/`;
//   - фото/лого (`photos/`, `logo/`) — рантайм-строки в React (`src={...}`),
//     это относительные от корня dist пути БЕЗ ведущего слэша и БЕЗ `./`:
//     `"photos/<slug>/01.jpg"`, `"logo/artnazavod-logo.svg"`.
// `sameDir: true` — искать по имени файла (случай шрифтов), `false` — по
// пути от корня dist (случай photos/logo). Cache-busting query у части
// шрифтов (`?168...`) учтён отдельно — без него base64-подстановка
// ломается на границе замены.
function inlineLocalAssetRefs(text, rootDirs, { sameDir = false } = {}) {
	let result = text;
	let replaced = 0;
	for (const dir of rootDirs) {
		const dirAbs = join(distDir, dir);
		if (!existsSync(dirAbs)) continue;
		const walk = (relDir) => {
			const absDir = join(distDir, relDir);
			for (const entry of readDirSafe(absDir)) {
				const relPath = join(relDir, entry.name).split('\\').join('/');
				const absPath = join(absDir, entry.name);
				if (entry.isDirectory()) {
					walk(relPath);
					continue;
				}
				const urlRef = sameDir ? `./${entry.name}` : relPath;
				const pattern = new RegExp(escapeRegExp(urlRef) + '(\\?[0-9]*)?', 'g');
				if (pattern.test(result)) {
					const dataUri = toDataUri(absPath);
					result = result.replace(pattern, dataUri);
					replaced++;
				}
			}
		};
		walk(dir);
	}
	return { text: result, replaced };
}

import { readdirSync } from 'node:fs';
function readDirSafe(dir) {
	try {
		return readdirSync(dir, { withFileTypes: true });
	} catch {
		return [];
	}
}

const html = readFileSync(join(distDir, 'index.html'), 'utf8');

const scriptMatch = html.match(/<script[^>]*src="\.\/(assets\/[^"]+\.js)"[^>]*><\/script>/);
const cssMatch = html.match(/<link[^>]*href="\.\/(assets\/[^"]+\.css)"[^>]*>/);
if (!scriptMatch || !cssMatch) {
	throw new Error('Не нашёл <script src> или <link href> в dist/index.html — структура сборки изменилась, обнови скрипт.');
}

let js = readFileSync(join(distDir, scriptMatch[1]), 'utf8');
let css = readFileSync(join(distDir, cssMatch[1]), 'utf8');

// Шрифты — рядом с самим CSS-файлом (тот же dist/assets/), Vite ссылается
// на них просто именем файла (`./SbrIcons-....woff2?168...`).
const cssInlined = inlineLocalAssetRefs(css, ['assets'], { sameDir: true });
css = cssInlined.text;

// Фото/логотип — строковые пути в JS (React src) и в CSS (фон первого
// экрана), уже относительные от корня dist (`photos/<slug>/01.jpg`,
// `logo/....svg`, см. build-objects-ts.mjs и vite.config.ts base:'./').
// Видео (`media/`, `hero/`) сознательно НЕ инлайнится (см. комментарий в
// шапке файла) — папки просто копируются рядом с HTML, пути в JS-бандле
// уже относительные и правки не требуют.
const jsInlined = inlineLocalAssetRefs(js, ['photos', 'logo']);
js = jsInlined.text;
const cssInlined2 = inlineLocalAssetRefs(css, ['photos', 'logo']);
css = cssInlined2.text;

console.log(`Инлайнено ассетов: CSS(шрифты) ${cssInlined.replaced}, JS(фото/лого) ${jsInlined.replaced}, CSS(фото/лого) ${cssInlined2.replaced}`);

// Замена ФУНКЦИЕЙ, не строкой: у `String.replace` строка-замена имеет
// спецсинтаксис ($&, $`, $', $$) — полтора мегабайта минифицированного кода
// почти гарантированно содержат `$`` или `$'` где-то внутри (шаблонные
// литералы после минификации), и обычная строковая замена молча подставляет
// вместо них «текст до/после совпадения», задваивая весь HTML внутри
// бандла и ломая структуру документа. Функция-замена вставляет текст
// буквально, без интерпретации.
const singleHtml = html
	.replace(/<script[^>]*src="\.\/assets\/[^"]+\.js"[^>]*><\/script>/, () => `<script type="module">${js}</script>`)
	.replace(/<link[^>]*href="\.\/assets\/[^"]+\.css"[^>]*>/, () => `<style>${css}</style>`);

rmSync(outDir, { recursive: true, force: true });
mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, singleHtml.replace(/^\uFEFF/, ''), 'utf8');
for (const rel of ['media', 'hero']) {
	const src = join(distDir, rel);
	if (existsSync(src)) cpSync(src, join(outDir, rel), { recursive: true });
}
// Раз наш favicon-тег (`<link rel="icon">` в index.html) — сырая разметка,
// не текст внутри JS/CSS, inlineLocalAssetRefs его не видит и не инлайнит —
// нужен реальный файл рядом, иначе 404 при раздаче сервером (под file://
// браузер такие ссылки просто не запрашивает, там незаметно).
const logoSrc = join(distDir, 'logo');
if (existsSync(logoSrc)) cpSync(logoSrc, join(outDir, 'logo'), { recursive: true });
for (const icon of ['favicon-32.png', 'favicon.png', 'apple-touch-icon.png']) {
	const src = join(distDir, icon);
	if (existsSync(src)) cpSync(src, join(outDir, icon));
}

// Ленивые чанки (сейчас — MapSection) сюда сознательно НЕ копируются —
// пробовал, ломает всё приложение (см. пояснение в шапке файла). Секция
// карты просто не откроется в этом пакете, изолированно, благодаря
// ErrorBoundary в App.tsx.

const sizeMb = (statSync(outFile).size / 1024 / 1024).toFixed(1);
const du = (dir) => {
	if (!existsSync(dir)) return 0;
	let total = 0;
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const p = join(dir, entry.name);
		total += entry.isDirectory() ? du(p) : statSync(p).size;
	}
	return total;
};
const mediaMb = ((du(join(outDir, 'media')) + du(join(outDir, 'hero'))) / 1024 / 1024).toFixed(1);
console.log(`Готово: ${outDir} (index.html ${sizeMb} МБ + media/hero рядом ~${mediaMb} МБ)`);
console.log('Открыть index.html двойным кликом можно — всё работает, кроме карты (её');
console.log('чанк в пакет не входит, см. комментарий в шапке файла) — остальное не задето.');
