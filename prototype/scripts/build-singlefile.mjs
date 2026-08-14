// Пост-обработка обычного `npm run build`: собирает ОДИН самодостаточный
// HTML-файл — JS/CSS инлайнятся тегами, все локальные ассеты (фото/видео/
// шрифты/логотип), на которые есть ссылки в HTML/CSS/JS, переводятся в
// base64 data:-URI. Цель — открыть двойным кликом в любом браузере без
// сервера (обычный `file://` блокирует ES-модули и `<link>` по CORS, но не
// блокирует инлайновые <script>/<style> и data:-URI).
//
// Не часть обычного dev/build-цикла — отдельная команда для конкретной
// задачи передачи: посмотреть прототип «как есть», без доступа к DS-пакетам
// и без сервера. Реальный dev/build (`npm run dev`/`npm run build`) этот
// скрипт не трогает и не заменяет.
import { readFileSync, writeFileSync, existsSync, statSync, mkdirSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const distDir = join(__dirname, '..', 'dist');
const outFile = join(__dirname, '..', 'dist-singlefile', 'АртНаЗавод-прототип.html');

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

// Фото/видео/логотип — строковые пути в JS (React src) и в CSS
// (`url('/photos/...')` для фона первого экрана).
const jsInlined = inlineLocalAssetRefs(js, ['photos', 'media', 'logo']);
js = jsInlined.text;
const cssInlined2 = inlineLocalAssetRefs(css, ['photos', 'media', 'logo']);
css = cssInlined2.text;

console.log(`Инлайнено ассетов: CSS(шрифты) ${cssInlined.replaced}, JS(медиа) ${jsInlined.replaced}, CSS(медиа) ${cssInlined2.replaced}`);

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

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, singleHtml.replace(/^\uFEFF/, ''), 'utf8');
const sizeMb = (statSync(outFile).size / 1024 / 1024).toFixed(1);
console.log(`Готово: ${outFile} (${sizeMb} МБ)`);
