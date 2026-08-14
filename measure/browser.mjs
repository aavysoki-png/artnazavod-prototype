/* Поиск puppeteer-core для скриптов замера sibur.ru (задача 30 доски).

   В самой папке пилота браузера нет, заводить его как постоянную зависимость
   ради разового замера не стоит — берём то, что уже стоит рядом на машине.
   Тот же приём, что в design-system-react-main/docs/product-lockup-reference/
   browser.mjs: список кандидатов, явный путь через переменную окружения,
   внятная ошибка вместо чужого abs-path, который однажды перестанет
   существовать. */
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const ENTRY = 'lib/puppeteer/puppeteer-core.js';

const candidates = [
	process.env.PUPPETEER_CORE,
	join(homedir(), 'Documents/PROJECTS/klik-atom/node_modules/puppeteer-core'),
	join(homedir(), 'Documents/PROJECTS/klik-2.0-build/app/node_modules/puppeteer-core'),
	join(process.cwd(), 'node_modules/puppeteer-core'),
].filter(Boolean);

function resolveEntry(base) {
	if (!base) return null;
	const direct = base.endsWith('.js') ? base : join(base, ENTRY);
	return existsSync(direct) ? direct : null;
}

const found = candidates.map(resolveEntry).find(Boolean);

if (!found) {
	console.error(
		'puppeteer-core не найден. Проверены пути:\n' +
			candidates.map((c) => '  - ' + c).join('\n') +
			'\n\nУкажите свой: PUPPETEER_CORE=/путь/к/puppeteer-core node <скрипт>',
	);
	process.exit(2);
}

const CHROME_CANDIDATES = [
	process.env.CHROME_PATH,
	'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean);
export const CHROME = CHROME_CANDIDATES.find((p) => existsSync(p));

const puppeteer = (await import(pathToFileURL(found).href)).default;

export default puppeteer;
