import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Порядок важен: без globals не резолвится ни один размерный/цветовой
// токен — ThemeProvider инжектит в рантайме только цвета темы, размеры и
// иконочный шрифт приходят исключительно этими файлами (тот же порядок,
// что в claude-landing-pipeline/project/src/main.tsx и klik-atom/src/main.tsx).
import '@sibur/design-tokens/css/tokens/globals/index.css';
import '@sibur/design-tokens/css/iconfont/iconfont.css';
import '@sibur/design-tokens/css/font-face.css';

import App from './App';
import { loadPhotoIndex } from './data/photoIndex';
import './index.css';

// Сначала индекс фото (обновляется без пересборки, см. photoIndex.ts), потом
// рендер: иначе карточки мелькнули бы вшитыми фото и перерисовались.
// loadPhotoIndex не бросает и ждёт не дольше 3 с.
loadPhotoIndex().then(() => {
	createRoot(document.getElementById('root')!).render(
		<StrictMode>
			<App />
		</StrictMode>,
	);
});
