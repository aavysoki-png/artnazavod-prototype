import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// Тот же паттерн, что в ~/Documents/PROJECTS/klik-atom/vite.config.ts —
// @sibur/* подключены file:-ссылками на монорепо дизайн-системы вне корня
// проекта; Vite резолвит симлинк в реальный путь и по умолчанию блокирует
// доступ к файлам вне project root (403 на шрифты), поэтому server.fs.allow.
// preserveSymlinks не подходит — сломает дедупликацию React (внутри
// design-system-react-main есть своя вложенная копия react/react-dom для
// его собственной разработки), поэтому react/react-dom алиасятся жёстко на
// копии этого проекта.
export default defineConfig({
	// Раздел будет встроен не в корень sibur.ru, а в поддиректорию за
	// прокси (решение с встречи 14.08) — base:'./' делает все ссылки на
	// JS/CSS/шрифты, которые проходят через сборку Vite, относительными к
	// расположению index.html, а не абсолютными от корня домена. Требует,
	// чтобы прокси отдавал URL с завершающим слэшем (стандартная настройка
	// nginx location) — это не в нашей власти, делают другие сотрудники
	// SIBUR, см. CLAUDE.md.
	base: './',
	plugins: [react()],
	resolve: {
		alias: {
			react: path.resolve(__dirname, 'node_modules/react'),
			'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
		},
	},
	server: {
		fs: {
			// '..' (родитель прототипа) недостаточно: реальные пакеты — по
			// симлинку в `ux-rules-mcp/Components and tokens/...`, это СОСЕДНЯЯ
			// папка на уровень выше (`~/Documents/PROJECTS/`), не предок текущей.
			allow: ['../..'],
		},
	},
});
