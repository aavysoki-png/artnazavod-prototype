// Проверка PR с фото из GitHub-зеркала (правки коллег по PHOTOS.md).
// Запускается в CI зеркала до превью и до выкладки; сообщения — для агента
// коллеги: что не так и как исправить, без знания устройства сайта.
//
//   node scripts/check-photos-pr.mjs origin/main   # PR: + сверка с базовой веткой
//   node scripts/check-photos-pr.mjs               # только состояние папки (выкладка из main)
//
// Только node:* — в зеркале не ставятся зависимости (@sibur/* недоступны).

import { execFileSync } from 'node:child_process';
import { openSync, readSync, closeSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const prototypeRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(prototypeRoot, '..');
const MANIFEST_REL = 'prototype/scripts/final-content-manifest.json';
const PHOTOS_REL = 'prototype/public/photos';

// Рамки — то, что выдаёт prepare-final-media.mjs (1600 px по длинной
// стороне, mozjpeg q80: на 28.09 самый тяжёлый кадр 363 КБ). Запас двойной.
const MAX_SIDE = 1600;
const MAX_BYTES = 800 * 1024;

const errors = [];
const fail = (msg) => errors.push(msg);

const manifest = JSON.parse(readFileSync(path.join(repoRoot, MANIFEST_REL), 'utf8'));
const slugs = new Set(manifest.objects.map((o) => o.slug));

// --- Сверка с базовой веткой (только в PR) ---
const base = process.argv[2];
if (base) {
	const git = (...args) => execFileSync('git', args, { cwd: repoRoot, encoding: 'utf8' });
	const changed = git('diff', '--name-only', `${base}...HEAD`).split('\n').filter(Boolean);
	const foreign = changed.filter((f) => f !== MANIFEST_REL && !f.startsWith(`${PHOTOS_REL}/`));
	if (foreign.length > 0) {
		fail(
			`PR меняет файлы вне фото и манифеста — по PHOTOS.md так нельзя, на сайт они не попадут:\n` +
				foreign.map((f) => `    ${f}`).join('\n') +
				`\n  Убери эти изменения из ветки (git checkout ${base} -- <файл>) и запушь снова.`,
		);
	}
	const baseManifest = JSON.parse(git('show', `${base}:${MANIFEST_REL}`));
	const strip = (m) => JSON.stringify(m.objects.map(({ cover: _cover, exclude: _exclude, ...rest }) => rest)) + JSON.stringify({ ...m, objects: null });
	if (strip(baseManifest) !== strip(manifest)) {
		fail(
			`В манифесте изменено что-то кроме полей "cover" и "exclude". Тексты, площади, порядок и состав объектов` +
				` меняет только владелец сайта. Верни манифест к ${base} и поменяй лишь "cover"/"exclude" нужного объекта.`,
		);
	}
}

// --- Состояние папки фото ---
function jpegSize(file) {
	// Размер из маркера SOF: без зависимостей, читаем первые 256 КБ.
	const buf = Buffer.alloc(256 * 1024);
	const fd = openSync(file, 'r');
	const n = readSync(fd, buf, 0, buf.length, 0);
	closeSync(fd);
	if (buf[0] !== 0xff || buf[1] !== 0xd8) return null;
	let i = 2;
	while (i + 9 < n) {
		if (buf[i] !== 0xff) return null;
		const marker = buf[i + 1];
		const len = buf.readUInt16BE(i + 2);
		if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
			return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
		}
		i += 2 + len;
	}
	return null;
}

const photosDir = path.join(repoRoot, PHOTOS_REL);
for (const entry of readdirSync(photosDir)) {
	if (entry.startsWith('.') || entry === 'index.json') continue;
	const dir = path.join(photosDir, entry);
	if (!statSync(dir).isDirectory()) {
		fail(`${PHOTOS_REL}/${entry}: посторонний файл в корне папки фото — удали его.`);
		continue;
	}
	if (!slugs.has(entry)) {
		fail(`${PHOTOS_REL}/${entry}: такого объекта нет в манифесте. Папка должна называться slug'ом объекта из манифеста; новые объекты не заводятся.`);
		continue;
	}
	const files = readdirSync(dir).filter((f) => !f.startsWith('.')).sort();
	const bad = files.filter((f) => !/^\d{2}\.jpg$/.test(f));
	if (bad.length > 0) {
		fail(`${PHOTOS_REL}/${entry}: файлы не по схеме 01.jpg, 02.jpg…: ${bad.join(', ')}. Фото готовит только prepare-final-media.mjs (PHOTOS.md, шаг 4), руками не переименовывай.`);
		continue;
	}
	files.forEach((f, i) => {
		const expected = `${String(i + 1).padStart(2, '0')}.jpg`;
		if (f !== expected && !errors.some((e) => e.startsWith(`${PHOTOS_REL}/${entry}: пропуск`))) {
			fail(`${PHOTOS_REL}/${entry}: пропуск в нумерации — ожидался ${expected}, а есть ${f}. Перезапусти prepare-final-media.mjs для этого объекта.`);
		}
		const file = path.join(dir, f);
		const bytes = statSync(file).size;
		const size = jpegSize(file);
		if (!size) {
			fail(`${PHOTOS_REL}/${entry}/${f}: это не JPEG (или файл повреждён).`);
		} else if (Math.max(size.width, size.height) > MAX_SIDE) {
			fail(`${PHOTOS_REL}/${entry}/${f}: ${size.width}×${size.height} — больше ${MAX_SIDE} px. Фото не прошло через prepare-final-media.mjs.`);
		}
		if (bytes > MAX_BYTES) {
			fail(`${PHOTOS_REL}/${entry}/${f}: ${Math.round(bytes / 1024)} КБ — больше ${MAX_BYTES / 1024} КБ. Фото не прошло через prepare-final-media.mjs.`);
		}
	});
}
for (const slug of slugs) {
	let count = 0;
	try {
		count = readdirSync(path.join(photosDir, slug)).filter((f) => f.endsWith('.jpg')).length;
	} catch {}
	if (count === 0) fail(`У объекта ${slug} не осталось ни одного фото — на сайте будет пустая карточка.`);
}

if (errors.length > 0) {
	console.error(`Проверка фото: ${errors.length} ошибок\n`);
	for (const e of errors) console.error(`- ${e}\n`);
	process.exit(1);
}
console.log(`Проверка фото: всё в порядке (${slugs.size} объектов${base ? `, сверено с ${base}` : ''})`);
