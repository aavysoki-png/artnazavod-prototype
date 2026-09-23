// Скачивает альбом объекта с публичной ссылки Я.Диска в исходную папку,
// откуда его берёт prepare-final-media.mjs:
//   <корень репо>/<sourceRoot из манифеста>/<sourceFolders[0] объекта>/
//
//   node scripts/fetch-yadisk-album.mjs <slug> <публичная ссылка> [путь внутри ссылки]
//
// Ссылка может вести прямо на альбом (disk.yandex.ru/d/...) или на всю
// поставку — тогда путь внутри по умолчанию `/<sourceFolders[0]>`.
//
// Качает по одному файлу через публичный API, а не zip-архивом: в zip от
// Я.Диска кириллица в именах приходит в битой кодировке, и имя из `cover`
// потом не находится. Подпапки (`_не для сайта` и т.п.) не открывает — тот
// же контракт, что у prepare-final-media: на сайт идут только файлы альбома.
// Зависимостей нет, нужен только Node 20+ (встроенный fetch).

import { createWriteStream, mkdirSync, readFileSync, rmSync } from 'node:fs';
import path from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const manifest = JSON.parse(readFileSync(path.join(__dirname, 'final-content-manifest.json'), 'utf8'));

const [slug, publicKey, innerArg] = process.argv.slice(2);
if (!slug || !publicKey) {
	console.error('Использование: node scripts/fetch-yadisk-album.mjs <slug> <публичная ссылка> [путь внутри ссылки]');
	process.exit(1);
}
const obj = manifest.objects.find((o) => o.slug === slug);
if (!obj) throw new Error(`Объекта "${slug}" нет в final-content-manifest.json`);
const folderName = obj.sourceFolders[0];

const API = 'https://cloud-api.yandex.net/v1/disk/public/resources';

async function list(innerPath) {
	const items = [];
	for (let offset = 0; ; offset += 200) {
		const url = new URL(API);
		url.searchParams.set('public_key', publicKey);
		if (innerPath) url.searchParams.set('path', innerPath);
		url.searchParams.set('limit', '200');
		url.searchParams.set('offset', String(offset));
		const res = await fetch(url);
		if (!res.ok) throw new Error(`Я.Диск ответил ${res.status} на ${innerPath || '/'}: ${await res.text()}`);
		const data = await res.json();
		if (data.type !== 'dir') throw new Error(`По ссылке лежит файл, а не папка: ${data.name}`);
		const page = data._embedded.items;
		items.push(...page);
		if (page.length < 200) return { name: data.name, items };
	}
}

// Ссылка на сам альбом или на всю поставку: если путь не задан явно и в
// корне ссылки есть папка альбома — берём её. Смотреть на «в корне нет
// файлов» нельзя: в корне поставки лежит xlsx-каталог.
let root = await list(innerArg);
if (!innerArg && root.items.some((i) => i.type === 'dir' && i.name.normalize('NFC') === folderName.normalize('NFC'))) {
	root = await list(`/${folderName}`);
}

const files = root.items.filter((i) => i.type === 'file');
const skipped = root.items.filter((i) => i.type === 'dir').map((i) => i.name);
if (!files.length) throw new Error(`В "${root.name}" нет файлов${skipped.length ? ` (только папки: ${skipped.join(', ')})` : ''}`);

const dest = path.resolve(__dirname, manifest.sourceRoot, folderName);
// Альбом скачивается целиком заново: prepare-final-media пересобирает все
// фото объекта из этой папки, и оставшийся от прошлого раза файл тихо
// вернулся бы на сайт.
rmSync(dest, { recursive: true, force: true });
mkdirSync(dest, { recursive: true });

for (const item of files) {
	const res = await fetch(item.file);
	if (!res.ok) throw new Error(`Не скачался ${item.name}: ${res.status}`);
	await pipeline(Readable.fromWeb(res.body), createWriteStream(path.join(dest, item.name)));
	console.log(`[yadisk] ${item.name} (${Math.round(item.size / 1024)} КБ)`);
}
if (skipped.length) console.log(`[yadisk] подпапки не скачивались: ${skipped.join(', ')}`);
console.log(`\n${files.length} файлов -> ${path.relative(process.cwd(), dest)}`);
