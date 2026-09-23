// Транскодирует финальную фактуру заказчика (~3 ГБ сырых фото/видео с камер)
// в веб-пригодные ассеты в public/photos|media|hero. Источник — ручной
// манифест final-content-manifest.json (slug -> папки в "Финальная фактура").
//
// Имена файлов внутри папок заказчика — камерные (DSC_9817.jpg,
// dji_fly_....mp4, кириллица, пробелы, "#") и непригодны для URL, поэтому
// вывод всегда пронумерован: 01.jpg, 02.jpg, ... / 01.mp4, 02.mp4, ...
// Порядок — по имени файла (естественная сортировка), детерминированно от
// запуска к запуску.
//
// Обложка объекта (какое фото показывать главным в свёрнутой карточке
// списка) — необязательное поле `"cover"` у объекта в манифесте, значение —
// точное имя файла как в исходной папке заказчика (не веб-путь). Если
// задано, этот файл переставляется в начало списка фото ДО нумерации, то
// есть всегда становится `01.jpg` — `media.photos[0]`, который и
// `ObjectCard.tsx` берёт для превью в списке, и открывает первым слайдом
// в раскрытой карусели. Без `"cover"` порядок как раньше — по имени файла.

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

// PHOTOS_ONLY=1 — только фото, видео объекта не трогаются. Нужен там, где
// видео нет вовсе: в GitHub-зеркале (public/media и public/hero туда не
// едут), откуда фото обновляет агент без доступа к рабочей машине. Тогда и
// ffmpeg-static не нужен — поэтому импорт ленивый.
const PHOTOS_ONLY = process.env.PHOTOS_ONLY === '1';
const ffmpegPath = PHOTOS_ONLY ? null : (await import('ffmpeg-static')).default;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const prototypeRoot = path.resolve(__dirname, '..');
const manifest = JSON.parse(await (await import('node:fs/promises')).readFile(path.join(__dirname, 'final-content-manifest.json'), 'utf8'));

const sourceRoot = path.resolve(__dirname, manifest.sourceRoot);
const publicDir = path.join(prototypeRoot, 'public');
const photosOut = path.join(publicDir, 'photos');
const mediaOut = path.join(publicDir, 'media');
const heroOut = path.join(publicDir, 'hero');

const PHOTO_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const VIDEO_EXT = new Set(['.mp4', '.mov']);

const nfc = (s) => s.normalize('NFC');

/** Сопоставляет имя папки из манифеста с реальной записью на диске,
 * не полагаясь на побайтовое совпадение (NFC/NFD кириллицы на APFS). */
function resolveSourceFolder(name) {
	const entries = readdirSync(sourceRoot);
	const match = entries.find((e) => nfc(e) === nfc(name));
	if (!match) throw new Error(`Папка не найдена на диске: ${name}`);
	return path.join(sourceRoot, match);
}

function listMediaFiles(folder) {
	return readdirSync(folder)
		.filter((f) => !f.startsWith('.'))
		.filter((f) => statSync(path.join(folder, f)).isFile())
		.sort((a, b) => a.localeCompare(b, 'ru'));
}

function ensureEmptyDir(dir) {
	if (existsSync(dir)) rmSync(dir, { recursive: true, force: true });
	mkdirSync(dir, { recursive: true });
}

async function transcodePhoto(srcPath, destPath) {
	await sharp(srcPath)
		.rotate() // применяет EXIF-ориентацию, затем стрипает метаданные
		.resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
		.jpeg({ quality: 80, mozjpeg: true })
		.toFile(destPath);
}

function transcodeVideo(srcPath, destPath) {
	execFileSync(
		ffmpegPath,
		[
			'-y',
			'-i', srcPath,
			// Второй scale() гарантирует чётные ширину/высоту — libx264 падает на
			// нечётных размерах (после ресайза вертикального видео 807x1080 и т.п.)
			'-vf', "scale='min(1920,iw)':'min(1080,ih)':force_original_aspect_ratio=decrease,scale=trunc(iw/2)*2:trunc(ih/2)*2",
			'-c:v', 'libx264',
			'-preset', 'medium',
			'-crf', '26',
			'-c:a', 'aac',
			'-b:a', '128k',
			'-movflags', '+faststart',
			destPath,
		],
		{ stdio: 'inherit' },
	);
}

/** Сравнение имён файлов для поиска обложки — без учёта регистра и NFC/NFD
 * (та же причина, что у `resolveSourceFolder`: кириллица/спецсимволы в
 * камерных именах на APFS). */
const sameFile = (a, b) => nfc(a).toLowerCase() === nfc(b).toLowerCase();

async function processFolderGroup(obj, outPhotoDir, outVideoDir) {
	ensureEmptyDir(outPhotoDir);

	// Собираем все файлы объекта в один плоский список (папка, имя, ext) —
	// нужно для перестановки обложки, которая может лежать в любой из
	// нескольких исходных папок объекта.
	const entries = [];
	for (const folderName of obj.sourceFolders) {
		const folder = resolveSourceFolder(folderName);
		for (const file of listMediaFiles(folder)) {
			entries.push({ folderName, folder, file, ext: path.extname(file).toLowerCase() });
		}
	}

	// Необязательное поле `"exclude"` — имена файлов исходной папки, которые не
	// должны попасть в объект. Нужно там, где заказчик отдал одну общую папку на
	// несколько муралов: те же кадры позже пришли отдельными альбомами, и без
	// исключения одно и то же фото показывалось бы сразу в нескольких карточках.
	const excluded = new Set((obj.exclude ?? []).map((f) => nfc(f).toLowerCase()));
	const isExcluded = (file) => excluded.has(nfc(file).toLowerCase());
	for (const name of obj.exclude ?? []) {
		if (!entries.some((e) => sameFile(e.file, name))) {
			throw new Error(`Исключение "${name}" для ${obj.slug} не найдено среди файлов объекта (папки: ${obj.sourceFolders.join(', ')})`);
		}
	}

	let photoEntries = entries.filter((e) => PHOTO_EXT.has(e.ext)).filter((e) => !isExcluded(e.file));
	const videoEntries = entries.filter((e) => VIDEO_EXT.has(e.ext)).filter((e) => !isExcluded(e.file));
	const unknownEntries = entries.filter((e) => !PHOTO_EXT.has(e.ext) && !VIDEO_EXT.has(e.ext));
	for (const e of unknownEntries) console.warn(`[skip] неизвестное расширение ${e.ext}: ${e.folderName}/${e.file}`);

	// Обложка (заказчик указывает конкретное фото на карточку в списке
	// объектов, задача 2026-08-21) — переставляем выбранный файл в начало
	// списка ДО нумерации, так что он всегда становится `01.jpg`, то есть
	// `media.photos[0]`: и превью в свёрнутой карточке (`ObjectCard.tsx`
	// берёт `photos[0]`), и первый слайд раскрытой карусели. Явная ошибка,
	// если файл не нашёлся — молчаливый фолбэк на первое фото по алфавиту
	// увёл бы обложку незаметно для автора манифеста.
	if (obj.cover) {
		const coverIndex = photoEntries.findIndex((e) => sameFile(e.file, obj.cover));
		if (coverIndex === -1) {
			throw new Error(`Обложка "${obj.cover}" для ${obj.slug} не найдена среди фото объекта (папки: ${obj.sourceFolders.join(', ')})`);
		}
		const [cover] = photoEntries.splice(coverIndex, 1);
		photoEntries = [cover, ...photoEntries];
	}

	let photoIndex = 0;
	for (const { folderName, folder, file } of photoEntries) {
		photoIndex += 1;
		const dest = path.join(outPhotoDir, `${String(photoIndex).padStart(2, '0')}.jpg`);
		const coverTag = obj.cover && sameFile(file, obj.cover) ? ' [обложка]' : '';
		console.log(`[photo] ${obj.slug} <- ${folderName}/${file}${coverTag}`);
		await transcodePhoto(path.join(folder, file), dest);
	}

	let videoIndex = 0;
	if (PHOTOS_ONLY) {
		if (videoEntries.length) console.log(`[video] ${obj.slug}: ${videoEntries.length} видео пропущено (PHOTOS_ONLY)`);
		return { photoCount: photoIndex, videoCount: null };
	}
	for (const { folderName, folder, file } of videoEntries) {
		videoIndex += 1;
		if (!existsSync(outVideoDir)) mkdirSync(outVideoDir, { recursive: true });
		const dest = path.join(outVideoDir, `${String(videoIndex).padStart(2, '0')}.mp4`);
		// SKIP_EXISTING_VIDEOS=1 — для прогонов, где меняются только фото или
		// обложка: перекодировать те же ролики заново нечем оправдать, это
		// минуты ffmpeg на объект. Список видео при этом не должен меняться —
		// нумерация позиционная, и уже лежащий 02.mp4 останется старым файлом.
		if (process.env.SKIP_EXISTING_VIDEOS === '1' && existsSync(dest)) {
			console.log(`[video] ${obj.slug} <- ${folderName}/${file} (пропущен, уже собран)`);
			continue;
		}
		console.log(`[video] ${obj.slug} <- ${folderName}/${file}`);
		transcodeVideo(path.join(folder, file), dest);
	}

	return { photoCount: photoIndex, videoCount: videoIndex };
}

async function main() {
	// `--hero` — пересобрать только видеоряд первого экрана, не трогая объекты
	// (полный прогон перекодирует ~3 ГБ фактуры, ради правки списка роликов
	// это несоразмерно).
	const heroOnly = process.argv[2] === '--hero';
	const onlySlug = heroOnly ? null : process.argv[2]; // опционально: обработать один slug для отладки, не трогая остальные
	// Полный прогон и --hero чистят public/media|hero и кодируют видео — с
	// PHOTOS_ONLY это снесло бы видео, ничего не положив взамен.
	if (PHOTOS_ONLY && !onlySlug) throw new Error('PHOTOS_ONLY=1 работает только с одним объектом: node scripts/prepare-final-media.mjs <slug>');
	// Полный прогон начинается с чистого листа, чтобы в public не остались
	// файлы объектов, которых уже нет в манифесте. Частичный (`<slug>`) и
	// `--hero` чистить public/photos|media НЕ должны — иначе прогон ради
	// одного объекта или ради шапки сносит всю подготовленную фактуру.
	if (heroOnly) {
		// каталоги объектов не трогаем вовсе
	} else if (onlySlug) {
		mkdirSync(photosOut, { recursive: true });
		mkdirSync(mediaOut, { recursive: true });
	} else {
		ensureEmptyDir(photosOut);
		ensureEmptyDir(mediaOut);
	}

	const results = {};
	for (const obj of heroOnly ? [] : manifest.objects) {
		if (onlySlug && obj.slug !== onlySlug) continue;
		const outPhotoDir = path.join(photosOut, obj.slug);
		const outVideoDir = path.join(mediaOut, obj.slug);
		const counts = await processFolderGroup(obj, outPhotoDir, outVideoDir);
		results[obj.slug] = counts;
	}

	if (!onlySlug) {
		// Хиро-нарезка первого экрана. `heroExclude` — имена файлов исходной
		// папки, которые заказчик решил не показывать: убираются ДО нумерации,
		// то есть оставшиеся ролики всегда идут hero-1..hero-N без дырок.
		ensureEmptyDir(heroOut);
		const heroFolder = resolveSourceFolder(manifest.heroSourceFolder);
		const heroExcluded = new Set((manifest.heroExclude ?? []).map((f) => nfc(f).toLowerCase()));
		const heroFiles = listMediaFiles(heroFolder)
			.filter((f) => VIDEO_EXT.has(path.extname(f).toLowerCase()))
			.filter((f) => !heroExcluded.has(nfc(f).toLowerCase()));
		for (const name of manifest.heroExclude ?? []) {
			if (!listMediaFiles(heroFolder).some((f) => sameFile(f, name))) {
				throw new Error(`Исключённый ролик шапки "${name}" не найден в ${manifest.heroSourceFolder}`);
			}
		}
		let heroIndex = 0;
		for (const file of heroFiles) {
			heroIndex += 1;
			const dest = path.join(heroOut, `hero-${heroIndex}.mp4`);
			console.log(`[hero] <- ${manifest.heroSourceFolder}/${file}`);
			transcodeVideo(path.join(heroFolder, file), dest);
		}
		results.__hero__ = { videoCount: heroIndex };
	}

	console.log('\n=== Готово ===');
	console.log(JSON.stringify(results, null, 2));
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
