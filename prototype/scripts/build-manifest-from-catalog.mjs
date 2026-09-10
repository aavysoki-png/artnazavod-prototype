// Собирает scripts/final-content-manifest.json из каталога муралов
// (АртНаЗавод_Каталог_муралов_СИБУР.xlsx в корне поставки заказчика) и карты
// «папка на Диске → объект» ниже.
//
// Почему генератор, а не ручной файл: поставка 2026-09-10 полностью заменила
// и структуру папок, и тексты — папки теперь названы по объектам, а описания
// переехали из Word прямо в каталог (колонка «Описание концепции (текст из
// Word)»). Следующая поставка обновит те же колонки, и манифест надо будет
// пересобрать одной командой, а не переписывать 35 карточек руками.
//
// Единственная ручная часть — FOLDER_MAP: сопоставить папку со строками
// каталога автоматикой нельзя, названия папок и колонки «Название объекта»
// совпадают не везде, а часть объектов занимает несколько строк (РМЗ — три
// корпуса, «Формула качества» — два, «Тюльпаны» — две очереди разных лет).
//
// Запуск: node scripts/build-manifest-from-catalog.mjs

import { execFileSync } from 'node:child_process';
import { readdirSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const prototypeRoot = path.resolve(__dirname, '..');
const SOURCE_ROOT = '../../Финальная фактура 2026-09-10';
const sourceRoot = path.resolve(__dirname, SOURCE_ROOT);
const catalogPath = path.join(sourceRoot, 'АртНаЗавод_Каталог_муралов_СИБУР.xlsx');

/**
 * Папка поставки → slug объекта и номера строк каталога (колонка «№»).
 *
 * Slug'и сохранены от предыдущей редакции: они попадают в URL (#slug,
 * Deep Link из ТЗ), и ссылки, которыми уже поделились, должны продолжать
 * работать. Поэтому `rvl-zemlyanika` остаётся `rvl-zemlyanika`, хотя каталог
 * 2026-09-10 приписывает «Полимерную землянику» СИБУР-Кстово, а не Русвинилу
 * (площадка в данных заказчика изменилась — это не наша ошибка сопоставления).
 *
 * Пустой `rows` — объект, которого в каталоге нет вообще: тексты и факты для
 * него берутся из `FALLBACK_TEXTS` (предыдущая редакция фактуры).
 */
const FOLDER_MAP = [
	{ folder: 'ЗСНХ_Добрые соседи СИБУРа', slug: 'zsnh-sosedi-sibura', rows: [1] },
	{ folder: 'ЗСНХ_Менделеев', slug: 'zsnh-mendeleev', rows: [] },
	{ folder: 'ЗСНХ_Формула МАН', slug: 'zsnh-man', rows: [16] },
	{ folder: 'ЗСНХ_Синтез полиолефинов', slug: 'zsnh-cpt-poliolefiny', rows: [19] },
	{ folder: 'СХП_Звери', slug: 'shp-zveri', rows: [7] },
	{ folder: 'СХП_Три стихии', slug: 'shp-tri-stihii', rows: [4] },
	{ folder: 'СХП_Чистая работа', slug: 'shp-chistaya-rabota', rows: [] },
	{ folder: 'СК_Минин', slug: 'kstovo-minin', rows: [2] },
	{ folder: 'СК_Чкалов', slug: 'kstovo-chkalov', rows: [3] },
	{ folder: 'СК_Полимерная земляника', slug: 'rvl-zemlyanika', rows: [36] },
	{ folder: 'ПОЛИЭФ_Путь вивилен', slug: 'poliev-vivilen', rows: [33] },
	{ folder: 'ТНХ_Серия «Забота». Мурал на локальных очистных сооружениях ', slug: 'tnh-zabota-los', rows: [5] },
	{ folder: 'ТНХ_Серия «Забота». Мурал на резервуарах для хранения', slug: 'tnh-zabota-rezervuary', rows: [6] },
	{ folder: 'ТНХ_Полимерная шишка', slug: 'tnh-polimernaya-shishka', rows: [29] },
	{ folder: 'ТНХ_Всё начинается с тебя', slug: 'tnh-sotvorchestvo', rows: [30] },
	{ folder: 'КОС_Стихи Тукая', slug: 'kos-stihi-tukaya', rows: [13] },
	{ folder: 'КОС_Цикл «Тюльпаны»', slug: 'kos-tulpany', rows: [14, 17] },
	{ folder: 'КОС_Огненный сокол', slug: 'kos-ognenniy-sokol', rows: [15] },
	{ folder: 'НКНХ_Портал в нефтехимию', slug: 'nknh-portal-neftehimiyu', rows: [8] },
	{ folder: 'НКНХ_Сотворение каучука', slug: 'nknh-sotvorenie-kauchuka', rows: [9] },
	{ folder: 'НКНХ_Путь каучука', slug: 'nknh-put-kauchuka', rows: [10] },
	{ folder: 'НКНХ_Реки', slug: 'nknh-reki', rows: [12] },
	{ folder: 'НКНХ_Экоавтобус', slug: 'nknh-avtobus', rows: [11] },
	{ folder: 'НКНХ_Наследие Менделеева', slug: 'nknh-nasledie-mendeleeva', rows: [18] },
	{ folder: 'НКНХ_РМЗ', slug: 'nknh-rmz', rows: [20, 21, 22] },
	{ folder: 'НКНХ_Серия «Код производства»', slug: 'nknh-kod-proizvodstva', rows: [23] },
	{ folder: 'НКНХ_Гексен', slug: 'nknh-geksen', rows: [27] },
	{ folder: 'НКНХ_Формула качества', slug: 'nknh-formula-kachestva', rows: [24, 25] },
	{ folder: 'НКНХ_Формула движения', slug: 'nknh-formula-dvizheniya', rows: [28] },
	{ folder: 'НКНХ_Гармония', slug: 'nknh-garmoniya', rows: [32] },
	{ folder: 'НВГПЗ_Цикл «Обереги Югры»', slug: 'nvgpz-oberegi-yugry', rows: [34] },
	{ folder: 'ВГПЗ_Северное сияние', slug: 'vgpz-severnoe-siyanie', rows: [35] },
	{ folder: 'АГХК_Батискафы', slug: 'aghk-batiskaf', rows: [26] },
	{ folder: 'АГХК_Точка синергии', slug: 'aghk-tochka-sinergii', rows: [37] },
	{ folder: 'ВСК_Путь молекулы', slug: 'vsk-put-molekuly', rows: [38] },
];

/**
 * Объекты, для которых каталог 2026-09-10 не содержит строки вообще, а папка
 * с фото есть. Тексты — из предыдущей редакции фактуры (докс 2026-08-20),
 * ничего не выдумано; при следующей поставке проверить, не появились ли они
 * в каталоге, и убрать отсюда.
 */
const FALLBACK_TEXTS = {
	'zsnh-mendeleev': {
		facility: 'ООО «ЗапСибНефтехим»',
		city: 'Тобольск',
		year: '2022',
		title: 'Менделеев',
		description:
			'Портрет Дмитрия Менделеева на смотровой площадке ЗапСибНефтехима — знак преемственности: тобольский уроженец, автор периодического закона, смотрит на производство, выросшее из его науки.',
		facts: [
			{ label: 'Объект', value: 'Смотровая площадка предприятия' },
			{ label: 'Техника', value: 'фасадная роспись' },
		],
	},
	'shp-chistaya-rabota': {
		facility: 'АО «Сибур Химпром»',
		city: 'Пермь',
		year: '2024',
		title: 'Чистая работа',
		description:
			'Мурал на очистных сооружениях «Сибур Химпрома» о том, что чистая вода — часть производственного цикла, а не то, что остаётся после него.',
		facts: [
			{ label: 'Объект', value: 'Очистные сооружения' },
			{ label: 'Техника', value: 'фасадная роспись' },
		],
	},
};

/**
 * Город для карты. Каталог в двух местах даёт не город: у «Северного сияния»
 * там регион и район целиком, у амурских объектов — «Свободный» без уточнения,
 * а в стране есть второй Благовещенск, из-за которого уточнение и появилось
 * (см. cityCoords.ts). Ключи CITY_COORDS менять нельзя — это карта.
 */
const CITY_FIX = {
	'Ямало-Ненецкий автономный округ, Пуровский район': 'Вынгапуровский',
	Свободный: 'Свободный (на Амуре)',
};

// --- чтение xlsx без зависимостей: unzip + разбор XML регулярками ---------

function readSheet(file) {
	const xml = (name) => execFileSync('unzip', ['-p', file, name], { maxBuffer: 1 << 28 }).toString('utf8');
	const shared = [...xml('xl/sharedStrings.xml').matchAll(/<si>(.*?)<\/si>/gs)].map(([, si]) =>
		[...si.matchAll(/<t[^>]*>(.*?)<\/t>/gs)].map(([, t]) => t).join(''),
	);
	const decode = (s) =>
		s
			.replace(/&lt;/g, '<')
			.replace(/&gt;/g, '>')
			.replace(/&quot;/g, '"')
			.replace(/&apos;/g, "'")
			.replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
			.replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
			.replace(/&amp;/g, '&');
	const rows = [];
	for (const [, attrs, body] of xml('xl/worksheets/sheet1.xml').matchAll(/<row([^>]*)>(.*?)<\/row>/gs)) {
		void attrs;
		const cells = {};
		// Пустая ячейка приходит self-closing (`<c r="J35" s="45"/>`), и без
		// первой ветки этой альтернативы regex принимал её за открывающий тег, а
		// закрывающий брал у СЛЕДУЮЩЕЙ ячейки — соседний столбец исчезал. Ловилось
		// это только на строках, где пустует ровно предыдущая колонка: год у пяти
		// последних объектов каталога пропал именно так.
		for (const [, cattrs, cbody] of body.matchAll(/<c([^>]*?)(?:\/>|>(.*?)<\/c>)/gs)) {
			const col = /r="([A-Z]+)\d+"/.exec(cattrs)?.[1];
			if (!col || cbody === undefined) continue;
			const isShared = /t="s"/.test(cattrs);
			const v = /<v>(.*?)<\/v>/s.exec(cbody)?.[1];
			const inline = [...cbody.matchAll(/<t[^>]*>(.*?)<\/t>/gs)].map(([, t]) => t).join('');
			const raw = isShared && v !== undefined ? shared[Number(v)] : (inline || v || '');
			cells[col] = decode(raw).trim();
		}
		rows.push(cells);
	}
	return rows;
}

// --- форматирование ------------------------------------------------------

/** «776,95 м²» / «3 500 м²» — разряды неразрывным пробелом, дробь запятой,
 * как во всех остальных числах на странице (русская типографика). */
function formatArea(value) {
	const rounded = Math.round(value * 100) / 100;
	const [int, frac] = String(rounded).split('.');
	const withSpaces = int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
	return `${frac ? `${withSpaces},${frac}` : withSpaces} м²`;
}

const clean = (s) => (s ?? '').replace(/[\s,]+$/, '').trim();

function buildObject(entry, catalog, previousBySlug) {
	const rows = entry.rows.map((n) => {
		const row = catalog.find((r) => r.A === String(n));
		if (!row) throw new Error(`Строка каталога №${n} не найдена (объект ${entry.slug})`);
		return row;
	});

	const fallback = FALLBACK_TEXTS[entry.slug];
	if (rows.length === 0 && !fallback) throw new Error(`Нет ни строк каталога, ни резервных текстов: ${entry.slug}`);

	const first = rows[0];
	const base = rows.length
		? {
				facility: clean(first.B),
				city: CITY_FIX[clean(first.C)] ?? clean(first.C),
				year: [...new Set(rows.map((r) => clean(r.K)).filter(Boolean))].sort().join('/'),
				title: clean(first.E),
				description: clean(first.G),
			}
		: { ...fallback, description: fallback.description };

	const facts = [];
	if (rows.length) {
		if (clean(first.D)) facts.push({ label: 'Объект', value: clean(first.D) });
		if (clean(first.L)) facts.push({ label: 'Техника', value: clean(first.L) });
		// Площадь суммируется по строкам: объект, разбитый в каталоге на
		// несколько корпусов или очередей, на странице остаётся одной карточкой.
		const area = rows.reduce((sum, r) => sum + (Number(String(r.I).replace(',', '.')) || 0), 0);
		if (area > 0) facts.push({ label: 'Площадь', value: formatArea(area) });
	} else {
		facts.push(...fallback.facts);
	}

	const object = { slug: entry.slug, ...base, artist: null, sourceFolders: [entry.folder], facts };

	// Обложку каталог не задаёт (в доксе было поле «Фото обложки»). Прежний
	// выбор переносим, если тот же файл есть в новой папке, — иначе первым
	// кадром станет первый по имени, и обложки просто не будет.
	const previousCover = previousBySlug[entry.slug]?.cover;
	if (previousCover) {
		const folderPath = path.join(sourceRoot, entry.folder);
		const files = existsSync(folderPath) ? readdirSync(folderPath) : [];
		const nfc = (s) => s.normalize('NFC').toLowerCase();
		if (files.some((f) => nfc(f) === nfc(previousCover))) object.cover = previousCover;
	}

	return object;
}

// --- сборка --------------------------------------------------------------

const catalog = readSheet(catalogPath);
const previous = JSON.parse(execFileSync('cat', [path.join(__dirname, 'final-content-manifest.json')]).toString('utf8'));
const previousBySlug = Object.fromEntries(previous.objects.map((o) => [o.slug, o]));

const objects = FOLDER_MAP.map((entry) => buildObject(entry, catalog, previousBySlug));

// Строки каталога, для которых папки с фото нет ни одной, — честный список
// «есть в данных, нечего показать», а не тихая пропажа объекта со страницы.
const usedRows = new Set(FOLDER_MAP.flatMap((e) => e.rows.map(String)));
const excludedNoFolder = catalog
	.filter((r) => r.A && /^\d+$/.test(r.A) && clean(r.E) && !usedRows.has(r.A))
	.map((r) => ({ row: Number(r.A), title: clean(r.E), facility: clean(r.B), reason: 'нет папки с фото в поставке 2026-09-10' }));

const manifest = {
	sourceRoot: SOURCE_ROOT,
	source: 'Поставка заказчика 2026-09-10: disk.yandex.ru/d/12tsuaJPbYuOeQ (фото и видео) + АртНаЗавод_Каталог_муралов_СИБУР.xlsx (тексты, площади, годы). Пересобирается: node scripts/build-manifest-from-catalog.mjs',
	heroSourceFolder: '___НАРЕЗКА для шапки',
	heroExclude: [],
	objects,
	excludedNoFolder,
};

writeFileSync(path.join(__dirname, 'final-content-manifest.json'), `${JSON.stringify(manifest, null, '\t')}\n`, 'utf8');

const known = new Set(FOLDER_MAP.map((e) => e.folder.normalize('NFC')));
const onDisk = readdirSync(sourceRoot).filter((f) => !f.startsWith('.') && !f.endsWith('.xlsx'));
const unmapped = onDisk.filter((f) => f !== '___НАРЕЗКА для шапки' && !known.has(f.normalize('NFC')));

console.log(`объектов: ${objects.length}, папок в поставке: ${onDisk.length}`);
console.log(`без папки (только в каталоге): ${excludedNoFolder.map((e) => e.title).join(', ') || '—'}`);
console.log(`папок без объекта: ${unmapped.join(', ') || '—'}`);
console.log(`обложки перенесены: ${objects.filter((o) => o.cover).length} из ${objects.length}`);
