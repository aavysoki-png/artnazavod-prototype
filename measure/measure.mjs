/* Замер визуального языка sibur.ru — задача 30 доски tasks.md.
 *
 * Тот же дух, что у tools/composition-metrics в MCP DS TOOL (задача 12/23):
 * не мнение по скриншоту, а числа, снятые с живого DOM. Формат снятых полей
 * не совпадает с composition-metrics буквально — тот заточен под макеты
 * (.pix) и живые SPA-приложения через отчёт visual-check, а здесь источник
 * один: чужой продакшн-сайт, к которому нет доступа изнутри. Поэтому меряем
 * напрямую браузером: getComputedStyle по ключевым узлам + перечисление
 * реальных CSS custom properties сайта (у sibur.ru они есть открыто на
 * :root — почти готовый токен-словарь, грех не прочитать вместо реверса
 * на глаз).
 *
 * Три типа страниц (см. PAGES ниже), три брейкпоинта, скролл до конца перед
 * снятием — часть блоков рендерится лениво и не собирается без него.
 *
 * Запуск: node measure.mjs → пишет raw/<page>-<viewport>.json и screenshots/.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import puppeteer, { CHROME } from './browser.mjs';

const PAGES = [
	{ id: 'home', label: 'Главная', url: 'https://sibur.ru/ru/' },
	{
		id: 'listing',
		label: 'Листинг отраслевых решений',
		url: 'https://sibur.ru/ru/clients/industry-solutions/',
	},
	{
		id: 'story',
		label: 'История клиента (детальная, ближе всего по духу к «АртНаЗаводу»)',
		url: 'https://sibur.ru/ru/clients/our-stories/vivilen/',
	},
];

const VIEWPORTS = [
	{ id: 'desktop-1440', width: 1440, height: 900 },
	{ id: 'tablet-834', width: 834, height: 1100 },
	{ id: 'mobile-390', width: 390, height: 844 },
];

mkdirSync('raw', { recursive: true });
mkdirSync('screenshots', { recursive: true });

async function scrollThrough(page) {
	await page.evaluate(async () => {
		await new Promise((resolve) => {
			let total = 0;
			const step = 600;
			const timer = setInterval(() => {
				window.scrollBy(0, step);
				total += step;
				if (total >= document.body.scrollHeight + 2000) {
					clearInterval(timer);
					window.scrollTo(0, 0);
					resolve();
				}
			}, 120);
		});
	});
	await new Promise((r) => setTimeout(r, 500));
}

async function measurePage(page) {
	return page.evaluate(() => {
		const px = (v) => (typeof v === 'string' && v.endsWith('px') ? Math.round(parseFloat(v) * 10) / 10 : v);

		// --- 1. CSS custom properties объявленные на :root — открытый токен-словарь сайта ---
		const rootStyle = getComputedStyle(document.documentElement);
		const cssVars = {};
		for (const sheet of document.styleSheets) {
			try {
				for (const rule of sheet.cssRules || []) {
					if (rule.selectorText === ':root' && rule.style) {
						for (let i = 0; i < rule.style.length; i++) {
							const name = rule.style[i];
							if (name.startsWith('--')) cssVars[name] = rootStyle.getPropertyValue(name).trim();
						}
					}
				}
			} catch (e) {
				/* межпортовые таблицы стилей (CORS) читать нельзя — пропускаем */
			}
		}

		// --- 2. Зоны: шапка/футер/контент ---
		const rect = (el) => {
			if (!el) return null;
			const r = el.getBoundingClientRect();
			return { top: px(r.top + 'px'), height: px(r.height + 'px'), width: px(r.width + 'px') };
		};
		const header = document.querySelector('header.header') || document.querySelector('header');
		const footer = document.querySelector('footer.footer') || document.querySelector('footer');

		// --- 3. Сетка / ширина контентной колонки ---
		// Кандидат на контейнер — самый widest прямой ребёнок body с центрированием
		// (margin-left ≈ margin-right) и шириной меньше вьюпорта.
		let containerGuess = null;
		document.querySelectorAll('body > *, body > * > *').forEach((el) => {
			const cs = getComputedStyle(el);
			const r = el.getBoundingClientRect();
			if (r.width < 40 || r.width >= window.innerWidth - 4) return;
			const ml = parseFloat(cs.marginLeft) || 0;
			const mr = parseFloat(cs.marginRight) || 0;
			if (Math.abs(ml - mr) > 4) return;
			if (!containerGuess || r.width > containerGuess.width) {
				containerGuess = { width: Math.round(r.width), marginLeft: Math.round(ml) };
			}
		});

		// --- 4. Типографика: реальные размеры видимых заголовков и текста ---
		function headingSamples(sel) {
			return [...document.querySelectorAll(sel)]
				.filter((el) => el.offsetParent !== null && el.textContent.trim())
				.slice(0, 12)
				.map((el) => {
					const cs = getComputedStyle(el);
					return {
						text: el.textContent.trim().slice(0, 50),
						fontSize: px(cs.fontSize),
						lineHeight: cs.lineHeight === 'normal' ? 'normal' : px(cs.lineHeight),
						fontWeight: cs.fontWeight,
						letterSpacing: cs.letterSpacing,
						fontFamily: cs.fontFamily.split(',')[0].replace(/["']/g, ''),
					};
				});
		}
		const typography = {};
		for (const sel of ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']) typography[sel] = headingSamples(sel);
		const bodyP = document.querySelector('p');
		typography.body = bodyP
			? (() => {
					const cs = getComputedStyle(bodyP);
					return { fontSize: px(cs.fontSize), lineHeight: px(cs.lineHeight), fontFamily: cs.fontFamily.split(',')[0].replace(/["']/g, '') };
				})()
			: null;

		// --- 5. Палитра — реально применённые фоны/градиенты на видимых узлах ---
		const bgColors = new Map();
		const gradients = new Set();
		const textColors = new Map();
		document.querySelectorAll('*').forEach((el) => {
			if (el.offsetParent === null && el.tagName !== 'BODY') return;
			const cs = getComputedStyle(el);
			const bg = cs.backgroundColor;
			if (bg && bg !== 'rgba(0, 0, 0, 0)') bgColors.set(bg, (bgColors.get(bg) || 0) + 1);
			const bi = cs.backgroundImage;
			if (bi && bi.includes('gradient')) gradients.add(bi.slice(0, 140));
			const col = cs.color;
			if (col) textColors.set(col, (textColors.get(col) || 0) + 1);
		});
		const topN = (map, n) =>
			[...map.entries()]
				.sort((a, b) => b[1] - a[1])
				.slice(0, n)
				.map(([color, count]) => ({ color, count }));

		// --- 6. Радиусы: реально применённые border-radius на кнопках/карточках ---
		const radii = new Set();
		document.querySelectorAll('button, a[class*="btn" i], [class*="button" i], [class*="card" i], img').forEach((el) => {
			const r = getComputedStyle(el).borderRadius;
			if (r && r !== '0px') radii.add(r);
		});

		// --- 7. Вертикальный ритм: зазоры между top-level секциями видимой части страницы ---
		const sectionCandidates = [...document.querySelectorAll('section, [class*="section" i]')]
			.filter((el) => el.offsetParent !== null)
			.map((el) => el.getBoundingClientRect())
			.filter((r) => r.height > 80)
			.sort((a, b) => a.top - b.top);
		const gaps = [];
		for (let i = 1; i < sectionCandidates.length; i++) {
			const gap = Math.round(sectionCandidates[i].top - sectionCandidates[i - 1].bottom);
			if (gap >= -4) gaps.push(gap);
		}

		return {
			viewport: { width: window.innerWidth, height: window.innerHeight },
			pageHeight: document.body.scrollHeight,
			header: rect(header),
			footer: rect(footer),
			container: containerGuess,
			typography,
			backgroundColorsTop: topN(bgColors, 15),
			textColorsTop: topN(textColors, 10),
			gradients: [...gradients],
			radii: [...radii].slice(0, 12),
			sectionGapsSample: gaps.slice(0, 20),
			cssVars,
		};
	});
}

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });

for (const p of PAGES) {
	for (const vp of VIEWPORTS) {
		const page = await browser.newPage();
		await page.setViewport({ width: vp.width, height: vp.height });
		try {
			await page.goto(p.url, { waitUntil: 'networkidle0', timeout: 45000 });
			await new Promise((r) => setTimeout(r, 800));
			await scrollThrough(page);
			const data = await measurePage(page);
			const out = { page: p.id, label: p.label, url: p.url, viewportId: vp.id, measuredAt: new Date().toISOString(), ...data };
			writeFileSync(`raw/${p.id}-${vp.id}.json`, JSON.stringify(out, null, 1));
			await page.screenshot({ path: `screenshots/${p.id}-${vp.id}.png`, fullPage: false });
			console.log(`✓ ${p.id} @ ${vp.id} — header ${data.header?.height}px, container ${data.container?.width}px, h1 ${data.typography.h1[0]?.fontSize ?? '—'}px`);
		} catch (err) {
			console.error(`✗ ${p.id} @ ${vp.id}:`, err.message);
		} finally {
			await page.close();
		}
	}
}

await browser.close();
console.log('\nГотово. Сырые данные — raw/, скриншоты — screenshots/.');
