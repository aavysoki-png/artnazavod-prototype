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

// Инлайнит все ссылки на локальные файлы дист-папки (`/photos/...`,
// `/media/...`, `/logo/...`), найденные в тексте JS/CSS как есть — паттерн
// строится от реального содержимого dist/, а не угадывается. Часть ссылок на
// шрифты несёт cache-busting query (`?168...`) — без явного учёта этого
// хвоста base64 в data:-URI ломается на границе замены.
function inlineLocalAssetRefs(text, rootDirs) {
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
				const urlRef = `/${relPath}`;
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

const scriptMatch = html.match(/<script[^>]*src="\/(assets\/[^"]+\.js)"[^>]*><\/script>/);
const cssMatch = html.match(/<link[^>]*href="\/(assets\/[^"]+\.css)"[^>]*>/);
if (!scriptMatch || !cssMatch) {
	throw new Error('Не нашёл <script src> или <link href> в dist/index.html — структура сборки изменилась, обнови скрипт.');
}

let js = readFileSync(join(distDir, scriptMatch[1]), 'utf8');
let css = readFileSync(join(distDir, cssMatch[1]), 'utf8');

// Шрифты подключены из assets/ через относительные url() в CSS.
const cssInlined = inlineLocalAssetRefs(css, ['assets']);
css = cssInlined.text;

// Фото/логотип — строковые пути в JS (React src) и в CSS
// (`url('/photos/...')` для фона первого экрана). Видео (`/media/`,
// `/hero/`) сознательно НЕ инлайнится (см. комментарий в шапке файла) —
// вместо этого папки копируются рядом с HTML, а пути в JS-бандле
// становятся относительными.
const jsInlined = inlineLocalAssetRefs(js, ['photos', 'logo']);
js = jsInlined.text;
const cssInlined2 = inlineLocalAssetRefs(css, ['photos', 'logo']);
css = cssInlined2.text;

const beforeRelPaths = js;
js = js.split('/media/').join('media/').split('/hero/').join('hero/');
const relPathsReplaced = js === beforeRelPaths ? 0 : (beforeRelPaths.match(/\/(media|hero)\//g) ?? []).length;

console.log(`Инлайнено ассетов: CSS(шрифты) ${cssInlined.replaced}, JS(фото/лого) ${jsInlined.replaced}, CSS(фото/лого) ${cssInlined2.replaced}; переведено в относительные пути (video) ${relPathsReplaced}`);

// Замена ФУНКЦИЕЙ, не строкой: у `String.replace` строка-замена имеет
// спецсинтаксис ($&, $`, $', $$) — полтора мегабайта минифицированного кода
// почти гарантированно содержат `$`` или `$'` где-то внутри (шаблонные
// литералы после минификации), и обычная строковая замена молча подставляет
// вместо них «текст до/после совпадения», задваивая весь HTML внутри
// бандла и ломая структуру документа. Функция-замена вставляет текст
// буквально, без интерпретации.
const singleHtml = html
	.replace(/<script[^>]*src="\/assets\/[^"]+\.js"[^>]*><\/script>/, () => `<script type="module">${js}</script>`)
	.replace(/<link[^>]*href="\/assets\/[^"]+\.css"[^>]*>/, () => `<style>${css}</style>`);

rmSync(outDir, { recursive: true, force: true });
mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, singleHtml.replace(/^\uFEFF/, ''), 'utf8');
for (const rel of ['media', 'hero']) {
	const src = join(distDir, rel);
	if (existsSync(src)) cpSync(src, join(outDir, rel), { recursive: true });
}

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
