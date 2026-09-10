# visual-check — УПАЛ (1 из 2 маршрутов с дефектами)

- базовый URL: http://localhost:4401
- время: 2026-09-10T08:47:58.491Z
- охват: 2 маршрут(ов) × 2 вьюпорт(а) · источник списка: --paths (1)
- token-coverage: **84.2%** (2933/3485 значений из токенов)
  - по маршрутам: /=42.9%, /art-na-zavod=85.0%
- неопознанные узлы: **43.0%** (296/688 не сопоставлены с компонентом ДС · не гейт)
  - по маршрутам: /=100.0%, /art-na-zavod=41.7%
- маршруты: `/`, `/art-na-zavod`
- не покрыто: клик-навигация (модалки, side-sheet по кнопке), параметрические маршруты без примера — передайте образец в `--paths`
- только предупреждения (гейт не валят): `/`

## Дефекты

### /art-na-zavod — desktop-1440

- **a11y_contrast** — {"element":"<p class=\"sbr_typography sbr_typography__body2\" data-testid=\"Typography\" style=\"color: var(--color-text-light-inactive, rgba(255, 255, 255, 0.6));\">арт-объектов</p>","rule":"color-co
  Где: `.sbr_box__display-block.sbr_grid-item[data-testid="GridItem"]:nth-child(1) > .gallery-stat-card--teal.gallery-stat-card > .sbr_typography__body2`
  Смотреть: `art-na-zavod/desktop-1440-screen-03.png`
- **a11y_contrast** — {"element":"<p class=\"sbr_typography sbr_typography__body2\" data-testid=\"Typography\" style=\"color: var(--color-text-light-inactive, rgba(255, 255, 255, 0.6));\">регионов уже охвачено</p>","rule":
  Где: `.gallery-stat-card--warm > .sbr_typography__body2`
  Смотреть: `art-na-zavod/desktop-1440-screen-03.png`
- **a11y_contrast** — {"element":"<p class=\"sbr_typography sbr_typography__body2\" data-testid=\"Typography\" style=\"color: var(--color-text-light-inactive, rgba(255, 255, 255, 0.6));\">самый большой мурал</p>","rule":"c
  Где: `.sbr_box__display-block.sbr_grid-item[data-testid="GridItem"]:nth-child(5) > .gallery-stat-card--teal.gallery-stat-card > .sbr_typography__body2`
  Смотреть: `art-na-zavod/desktop-1440-screen-03.png`
- **a11y_name** — {"element":"<div class=\"leaflet-marker-icon gallery-map__pin leaflet-zoom-animated leaflet-interactive\" tabindex=\"0\" role=\"button\" style=\"margin-left: -13px; margin-top: -38px; width: 26px; hei
  Где: `.gallery-map__pin.leaflet-marker-icon.leaflet-interactive:nth-child(1)`
  Смотреть: `art-na-zavod/desktop-1440-screen-04.png`
- **a11y_name** — {"element":"<div class=\"leaflet-marker-icon gallery-map__pin leaflet-zoom-animated leaflet-interactive\" tabindex=\"0\" role=\"button\" style=\"margin-left: -13px; margin-top: -38px; width: 26px; hei
  Где: `.gallery-map__pin.leaflet-marker-icon.leaflet-interactive:nth-child(2)`
  Смотреть: `art-na-zavod/desktop-1440-screen-04.png`
- **a11y_name** — {"element":"<div class=\"leaflet-marker-icon gallery-map__pin leaflet-zoom-animated leaflet-interactive\" tabindex=\"0\" role=\"button\" style=\"margin-left: -13px; margin-top: -38px; width: 26px; hei
  Где: `.gallery-map__pin.leaflet-marker-icon.leaflet-interactive:nth-child(3)`
  Смотреть: `art-na-zavod/desktop-1440-screen-04.png`
- **a11y_name** — {"element":"<div class=\"leaflet-marker-icon gallery-map__pin leaflet-zoom-animated leaflet-interactive\" tabindex=\"0\" role=\"button\" style=\"margin-left: -13px; margin-top: -38px; width: 26px; hei
  Где: `.gallery-map__pin.leaflet-marker-icon.leaflet-interactive:nth-child(4)`
  Смотреть: `art-na-zavod/desktop-1440-screen-04.png`
- **a11y_name** — {"element":"<div class=\"leaflet-marker-icon gallery-map__pin leaflet-zoom-animated leaflet-interactive\" tabindex=\"0\" role=\"button\" style=\"margin-left: -13px; margin-top: -38px; width: 26px; hei
  Где: `.gallery-map__pin.leaflet-marker-icon.leaflet-interactive:nth-child(5)`
  Смотреть: `art-na-zavod/desktop-1440-screen-04.png`
- **a11y_name** — {"element":"<div class=\"leaflet-marker-icon gallery-map__pin leaflet-zoom-animated leaflet-interactive\" tabindex=\"0\" role=\"button\" style=\"margin-left: -13px; margin-top: -38px; width: 26px; hei
  Где: `.gallery-map__pin.leaflet-marker-icon.leaflet-interactive:nth-child(6)`
  Смотреть: `art-na-zavod/desktop-1440-screen-04.png`
- **a11y_name** — {"element":"<div class=\"leaflet-marker-icon gallery-map__pin leaflet-zoom-animated leaflet-interactive\" tabindex=\"0\" role=\"button\" style=\"margin-left: -13px; margin-top: -38px; width: 26px; hei
  Где: `.gallery-map__pin.leaflet-marker-icon.leaflet-interactive:nth-child(7)`
  Смотреть: `art-na-zavod/desktop-1440-screen-04.png`
- **a11y_name** — {"element":"<div class=\"leaflet-marker-icon gallery-map__pin leaflet-zoom-animated leaflet-interactive\" tabindex=\"0\" role=\"button\" style=\"margin-left: -13px; margin-top: -38px; width: 26px; hei
  Где: `.gallery-map__pin.leaflet-marker-icon.leaflet-interactive:nth-child(8)`
  Смотреть: `art-na-zavod/desktop-1440-screen-04.png`
- **a11y_name** — {"element":"<div class=\"leaflet-marker-icon gallery-map__pin leaflet-zoom-animated leaflet-interactive\" tabindex=\"0\" role=\"button\" style=\"margin-left: -13px; margin-top: -38px; width: 26px; hei
  Где: `.gallery-map__pin.leaflet-marker-icon.leaflet-interactive:nth-child(9)`
  Смотреть: `art-na-zavod/desktop-1440-screen-04.png`

### /art-na-zavod — mobile-390

- **a11y_contrast** — {"element":"<p class=\"sbr_typography sbr_typography__body2\" data-testid=\"Typography\" style=\"color: var(--color-text-light-inactive, rgba(255, 255, 255, 0.6));\">арт-объектов</p>","rule":"color-co
  Где: `.sbr_box__display-block.sbr_grid-item[data-testid="GridItem"]:nth-child(1) > .gallery-stat-card--teal.gallery-stat-card > .sbr_typography__body2`
  Смотреть: `art-na-zavod/mobile-390-screen-05.png`
- **a11y_contrast** — {"element":"<p class=\"sbr_typography sbr_typography__body2\" data-testid=\"Typography\" style=\"color: var(--color-text-light-inactive, rgba(255, 255, 255, 0.6));\">регионов уже охвачено</p>","rule":
  Где: `.gallery-stat-card--warm > .sbr_typography__body2`
  Смотреть: `art-na-zavod/mobile-390-screen-05.png`
- **a11y_contrast** — {"element":"<p class=\"sbr_typography sbr_typography__body2\" data-testid=\"Typography\" style=\"color: var(--color-text-light-inactive, rgba(255, 255, 255, 0.6));\">самый большой мурал</p>","rule":"c
  Где: `.sbr_box__display-block.sbr_grid-item[data-testid="GridItem"]:nth-child(5) > .gallery-stat-card--teal.gallery-stat-card > .sbr_typography__body2`
  Смотреть: `art-na-zavod/mobile-390-screen-06.png`
- **a11y_name** — {"element":"<div class=\"leaflet-marker-icon gallery-map__pin leaflet-zoom-animated leaflet-interactive\" tabindex=\"0\" role=\"button\" style=\"margin-left: -13px; margin-top: -38px; width: 26px; hei
  Где: `.gallery-map__pin.leaflet-marker-icon.leaflet-interactive:nth-child(1)`
  Смотреть: `art-na-zavod/mobile-390-screen-07.png`
- **a11y_name** — {"element":"<div class=\"leaflet-marker-icon gallery-map__pin leaflet-zoom-animated leaflet-interactive\" tabindex=\"0\" role=\"button\" style=\"margin-left: -13px; margin-top: -38px; width: 26px; hei
  Где: `.gallery-map__pin.leaflet-marker-icon.leaflet-interactive:nth-child(2)`
  Смотреть: `art-na-zavod/mobile-390-screen-07.png`
- **a11y_name** — {"element":"<div class=\"leaflet-marker-icon gallery-map__pin leaflet-zoom-animated leaflet-interactive\" tabindex=\"0\" role=\"button\" style=\"margin-left: -13px; margin-top: -38px; width: 26px; hei
  Где: `.gallery-map__pin.leaflet-marker-icon.leaflet-interactive:nth-child(3)`
  Смотреть: `art-na-zavod/mobile-390-screen-07.png`

## По маршрутам

### /

<details><summary><code>desktop-1440</code> · document · высота 900px · секций 0 · интерактивных 2</summary>

| чек | статус | что показал |
| --- | --- | --- |
| `css_vars_unresolved` | ✅ pass | все обязательные var(--…) резолвятся там, где применяются (проверено 0 имён в 0 таблицах стилей) |
| `section_rhythm_collapsed` | ⏭️ skip | в области контента меньше двух секций — ритм проверять нечего |
| `page_not_scrollable` | ⏭️ skip | документ: контентных секций меньше двух — скролл проверять нечего |
| `inner_scroll_container` | ✅ pass | страница скроллится документом, внутренних скролл-контейнеров на высоту экрана нет |
| `horizontal_overflow` | ✅ pass | горизонтального скролла нет |
| `interactive_overlap` | ✅ pass | наложений нет (проверено 2 интерактивных элементов, 1 пар) |
| `row_gap_collapsed` | ✅ pass | у горизонтальных строк ссылок есть зазоры |
| `narrow_column_empty_half` | ✅ pass | секции занимают ширину контейнера |
| `text_block_overlap` | ✅ pass | текстовые блоки не пересекаются (проверено 3) |
| `icon_ligature_text` | ✅ pass | иконочный шрифт загружен, лигатуры отрисованы глифами |
| `reinvented_component` | ⏭️ skip | пропущен: @sibur/design-system-react не установлен у потребителя (старый форк?) — сравнивать отпечатки не с чем |
| `token_coverage` | ✅ pass | токен-покрытие 42.9% (15/35 значений) |
| `unrecognized_nodes` | ✅ pass | неопознанных узлов 100.0% (8/8 не сопоставлены с компонентом ДС) |
| `surface_seam` | ⏭️ skip | пропущен: семантические токены поверхности (--color-background-base/low/medium/high) не определены на странице — классифицировать шов не по чему |
| `a11y_contrast` | ✅ pass | нарушений нет (контраст текста ниже порога) |
| `a11y_name` | ✅ pass | нарушений нет (интерактивный элемент без доступного имени) |
| `a11y_form_label` | ✅ pass | нарушений нет (поле формы без связанного label) |
| `a11y_landmark` | ⚠️ fail | 3 нарушений — нет ориентиров страницы (landmark / заголовок h1) |
| `failed_requests` | ✅ pass | все запросы отдались |
| `console_errors` | ✅ pass | консоль чистая |

<details><summary><code>a11y_landmark</code> — детали (JSON)</summary>

```json
[
  {
    "element": "<h1>Directory listing for /</h1>",
    "rule": "region",
    "impact": "moderate",
    "where": {
      "selector": "h1",
      "screenshotY": 21,
      "screenshot": "desktop-1440-screen-01.png"
    },
    "hint": "Fix any of the following: Some page content is not contained by landmarks",
    "baselineKey": "region|h1",
    "ignored": false
  },
  {
    "element": "<ul>\n<li><a href=\"art-na-zavod/\">art-na-zavod@</a></li>\n<li><a href=\"server.log\">server.log</a></li>\n</ul>",
    "rule": "region",
    "impact": "moderate",
    "where": {
      "selector": "ul",
      "screenshotY": 98,
      "screenshot": "desktop-1440-screen-01.png"
    },
    "hint": "Fix any of the following: Some page content is not contained by landmarks",
    "baselineKey": "region|ul",
    "ignored": false
  },
  {
    "element": "<html>",
    "rule": "landmark-one-main",
    "impact": "moderate",
    "where": {
      "selector": "html",
      "screenshotY": 0,
      "screenshot": "desktop-1440-screen-01.png"
    },
    "hint": "Fix all of the following: Document does not have a main landmark",
    "baselineKey": "landmark-one-main|html",
    "ignored": false
  }
]
```

</details>
Скриншоты: `root/desktop-1440-screen-01.png`, `root/desktop-1440-fullpage.png`

</details>

<details><summary><code>mobile-390</code> · document · высота 844px · секций 0 · интерактивных 2</summary>

| чек | статус | что показал |
| --- | --- | --- |
| `css_vars_unresolved` | ✅ pass | все обязательные var(--…) резолвятся там, где применяются (проверено 0 имён в 0 таблицах стилей) |
| `section_rhythm_collapsed` | ⏭️ skip | в области контента меньше двух секций — ритм проверять нечего |
| `page_not_scrollable` | ⏭️ skip | документ: контентных секций меньше двух — скролл проверять нечего |
| `inner_scroll_container` | ✅ pass | страница скроллится документом, внутренних скролл-контейнеров на высоту экрана нет |
| `horizontal_overflow` | ✅ pass | горизонтального скролла нет |
| `interactive_overlap` | ✅ pass | наложений нет (проверено 2 интерактивных элементов, 1 пар) |
| `row_gap_collapsed` | ✅ pass | у горизонтальных строк ссылок есть зазоры |
| `narrow_column_empty_half` | ⏭️ skip | пропущено: чек только для десктопных вьюпортов |
| `text_block_overlap` | ✅ pass | текстовые блоки не пересекаются (проверено 3) |
| `icon_ligature_text` | ✅ pass | иконочный шрифт загружен, лигатуры отрисованы глифами |
| `reinvented_component` | ⏭️ skip | пропущен: @sibur/design-system-react не установлен у потребителя (старый форк?) — сравнивать отпечатки не с чем |
| `token_coverage` | ✅ pass | токен-покрытие 42.9% (15/35 значений) |
| `unrecognized_nodes` | ✅ pass | неопознанных узлов 100.0% (8/8 не сопоставлены с компонентом ДС) |
| `surface_seam` | ⏭️ skip | пропущен: семантические токены поверхности (--color-background-base/low/medium/high) не определены на странице — классифицировать шов не по чему |
| `a11y_contrast` | ✅ pass | нарушений нет (контраст текста ниже порога) |
| `a11y_name` | ✅ pass | нарушений нет (интерактивный элемент без доступного имени) |
| `a11y_form_label` | ✅ pass | нарушений нет (поле формы без связанного label) |
| `a11y_landmark` | ⚠️ fail | 3 нарушений — нет ориентиров страницы (landmark / заголовок h1) |
| `failed_requests` | ✅ pass | все запросы отдались |
| `console_errors` | ✅ pass | консоль чистая |

<details><summary><code>a11y_landmark</code> — детали (JSON)</summary>

```json
[
  {
    "element": "<h1>Directory listing for /</h1>",
    "rule": "region",
    "impact": "moderate",
    "where": {
      "selector": "h1",
      "screenshotY": 21,
      "screenshot": "mobile-390-screen-01.png"
    },
    "hint": "Fix any of the following: Some page content is not contained by landmarks",
    "baselineKey": "region|h1",
    "ignored": false
  },
  {
    "element": "<ul>\n<li><a href=\"art-na-zavod/\">art-na-zavod@</a></li>\n<li><a href=\"server.log\">server.log</a></li>\n</ul>",
    "rule": "region",
    "impact": "moderate",
    "where": {
      "selector": "ul",
      "screenshotY": 98,
      "screenshot": "mobile-390-screen-01.png"
    },
    "hint": "Fix any of the following: Some page content is not contained by landmarks",
    "baselineKey": "region|ul",
    "ignored": false
  },
  {
    "element": "<html>",
    "rule": "landmark-one-main",
    "impact": "moderate",
    "where": {
      "selector": "html",
      "screenshotY": 0,
      "screenshot": "mobile-390-screen-01.png"
    },
    "hint": "Fix all of the following: Document does not have a main landmark",
    "baselineKey": "landmark-one-main|html",
    "ignored": false
  }
]
```

</details>
Скриншоты: `root/mobile-390-screen-01.png`, `root/mobile-390-fullpage.png`

</details>

### /art-na-zavod

<details><summary><code>desktop-1440</code> · document · высота 7307px · секций 5 · интерактивных 64</summary>

| чек | статус | что показал |
| --- | --- | --- |
| `css_vars_unresolved` | ✅ pass | все обязательные var(--…) резолвятся там, где применяются (проверено 61 имён в 12 таблицах стилей) |
| `section_rhythm_collapsed` | ✅ pass | вертикальный ритм есть у всех 5 секций |
| `page_not_scrollable` | ✅ pass | документ скроллится (7307px при видимой высоте 900px) |
| `inner_scroll_container` | ✅ pass | страница скроллится документом, внутренних скролл-контейнеров на высоту экрана нет |
| `horizontal_overflow` | ✅ pass | горизонтального скролла нет |
| `interactive_overlap` | ✅ pass | наложений нет (проверено 64 интерактивных элементов, 2016 пар) |
| `row_gap_collapsed` | ✅ pass | у горизонтальных строк ссылок есть зазоры |
| `narrow_column_empty_half` | ✅ pass | секции занимают ширину контейнера |
| `text_block_overlap` | ✅ pass | текстовые блоки не пересекаются (проверено 109) |
| `icon_ligature_text` | ✅ pass | иконочный шрифт загружен, лигатуры отрисованы глифами |
| `reinvented_component` | ⏭️ skip | пропущен: @sibur/design-system-react не установлен у потребителя (старый форк?) — сравнивать отпечатки не с чем |
| `token_coverage` | ✅ pass | токен-покрытие 84.9% (1467/1728 значений) |
| `unrecognized_nodes` | ✅ pass | неопознанных узлов 42.7% (146/342 не сопоставлены с компонентом ДС) |
| `surface_seam` | ✅ pass | вложенных блоков на цвете базовой поверхности внутри raised-поверхности не найдено |
| `a11y_contrast` | ❌ fail | 3 нарушений — контраст текста ниже порога |
| `a11y_name` | ❌ fail | 9 нарушений — интерактивный элемент без доступного имени |
| `a11y_form_label` | ✅ pass | нарушений нет (поле формы без связанного label) |
| `a11y_landmark` | ⚠️ fail | 18 нарушений — нет ориентиров страницы (landmark / заголовок h1) |
| `failed_requests` | ✅ pass | все запросы отдались |
| `console_errors` | ✅ pass | консоль чистая |

<details><summary><code>a11y_contrast</code> — детали (JSON)</summary>

```json
[
  {
    "element": "<p class=\"sbr_typography sbr_typography__body2\" data-testid=\"Typography\" style=\"color: var(--color-text-light-inactive, rgba(255, 255, 255, 0.6));\">арт-объектов</p>",
    "rule": "color-contrast",
    "impact": "serious",
    "where": {
      "selector": ".sbr_box__display-block.sbr_grid-item[data-testid=\"GridItem\"]:nth-child(1) > .gallery-stat-card--teal.gallery-stat-card > .sbr_typography__body2",
      "screenshotY": 1350,
      "screenshot": "desktop-1440-screen-03.png"
    },
    "hint": "Fix any of the following: Element has insufficient color contrast of 2.39 (foreground color: #99d1d5, background color: #008c95, font size: 12.8pt (17px), font weight: normal). Expected contrast ratio of 4.5:1",
    "baselineKey": "color-contrast|.sbr_box__display-block.sbr_grid-item[data-testid=\"GridItem\"]:nth-child(1) > .gallery-stat-card--teal.gallery-stat-card > .sbr_typography__body2",
    "ignored": false
  },
  {
    "element": "<p class=\"sbr_typography sbr_typography__body2\" data-testid=\"Typography\" style=\"color: var(--color-text-light-inactive, rgba(255, 255, 255, 0.6));\">регионов уже охвачено</p>",
    "rule": "color-contrast",
    "impact": "serious",
    "where": {
      "selector": ".gallery-stat-card--warm > .sbr_typography__body2",
      "screenshotY": 1350,
      "screenshot": "desktop-1440-screen-03.png"
    },
    "hint": "Fix any of the following: Element has insufficient color contrast of 2.31 (foreground color: #f3b8b0, background color: #e04e39, font size: 12.8pt (17px), font weight: normal). Expected contrast ratio of 4.5:1",
    "baselineKey": "color-contrast|.gallery-stat-card--warm > .sbr_typography__body2",
    "ignored": false
  },
  {
    "element": "<p class=\"sbr_typography sbr_typography__body2\" data-testid=\"Typography\" style=\"color: var(--color-text-light-inactive, rgba(255, 255, 255, 0.6));\">самый большой мурал</p>",
    "rule": "color-contrast",
    "impact": "serious",
    "where": {
      "selector": ".sbr_box__display-block.sbr_grid-item[data-testid=\"GridItem\"]:nth-child(5) > .gallery-stat-card--teal.gallery-stat-card > .sbr_typography__body2",
      "screenshotY": 1350,
      "screenshot": "desktop-1440-screen-03.png"
    },
    "hint": "Fix any of the following: Element has insufficient color contrast of 2.39 (foreground color: #99d1d5, background color: #008c95, font size: 12.8pt (17px), font weight: normal). Expected contrast ratio of 4.5:1",
    "baselineKey": "color-contrast|.sbr_box__display-block.sbr_grid-item[data-testid=\"GridItem\"]:nth-child(5) > .gallery-stat-card--teal.gallery-stat-card > .sbr_typography__body2",
    "ignored": false
  }
]
```

</details>
<details><summary><code>a11y_name</code> — детали (JSON)</summary>

```json
[
  {
    "element": "<div class=\"leaflet-marker-icon gallery-map__pin leaflet-zoom-animated leaflet-interactive\" tabindex=\"0\" role=\"button\" style=\"margin-left: -13px; margin-top: -38px; width: 26px; height: 38px; transfor",
    "rule": "aria-command-name",
    "impact": "serious",
    "where": {
      "selector": ".gallery-map__pin.leaflet-marker-icon.leaflet-interactive:nth-child(1)",
      "screenshotY": 2512,
      "screenshot": "desktop-1440-screen-04.png"
    },
    "hint": "Fix any of the following: Element does not have text that is visible to screen readers aria-label attribute does not exist or is empty aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty Element has no title attribute",
    "baselineKey": "aria-command-name|.gallery-map__pin.leaflet-marker-icon.leaflet-interactive:nth-child(1)",
    "ignored": false
  },
  {
    "element": "<div class=\"leaflet-marker-icon gallery-map__pin leaflet-zoom-animated leaflet-interactive\" tabindex=\"0\" role=\"button\" style=\"margin-left: -13px; margin-top: -38px; width: 26px; height: 38px; transfor",
    "rule": "aria-command-name",
    "impact": "serious",
    "where": {
      "selector": ".gallery-map__pin.leaflet-marker-icon.leaflet-interactive:nth-child(2)",
      "screenshotY": 2394,
      "screenshot": "desktop-1440-screen-04.png"
    },
    "hint": "Fix any of the following: Element does not have text that is visible to screen readers aria-label attribute does not exist or is empty aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty Element has no title attribute",
    "baselineKey": "aria-command-name|.gallery-map__pin.leaflet-marker-icon.leaflet-interactive:nth-child(2)",
    "ignored": false
  },
  {
    "element": "<div class=\"leaflet-marker-icon gallery-map__pin leaflet-zoom-animated leaflet-interactive\" tabindex=\"0\" role=\"button\" style=\"margin-left: -13px; margin-top: -38px; width: 26px; height: 38px; transfor",
    "rule": "aria-command-name",
    "impact": "serious",
    "where": {
      "selector": ".gallery-map__pin.leaflet-marker-icon.leaflet-interactive:nth-child(3)",
      "screenshotY": 2505,
      "screenshot": "desktop-1440-screen-04.png"
    },
    "hint": "Fix any of the following: Element does not have text that is visible to screen readers aria-label attribute does not exist or is empty aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty Element has no title attribute",
    "baselineKey": "aria-command-name|.gallery-map__pin.leaflet-marker-icon.leaflet-interactive:nth-child(3)",
    "ignored": false
  },
  {
    "element": "<div class=\"leaflet-marker-icon gallery-map__pin leaflet-zoom-animated leaflet-interactive\" tabindex=\"0\" role=\"button\" style=\"margin-left: -13px; margin-top: -38px; width: 26px; height: 38px; transfor",
    "rule": "aria-command-name",
    "impact": "serious",
    "where": {
      "selector": ".gallery-map__pin.leaflet-marker-icon.leaflet-interactive:nth-child(4)",
      "screenshotY": 2351,
      "screenshot": "desktop-1440-screen-04.png"
    },
    "hint": "Fix any of the following: Element does not have text that is visible to screen readers aria-label attribute does not exist or is empty aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty Element has no title attribute",
    "baselineKey": "aria-command-name|.gallery-map__pin.leaflet-marker-icon.leaflet-interactive:nth-child(4)",
    "ignored": false
  },
  {
    "element": "<div class=\"leaflet-marker-icon gallery-map__pin leaflet-zoom-animated leaflet-interactive\" tabindex=\"0\" role=\"button\" style=\"margin-left: -13px; margin-top: -38px; width: 26px; height: 38px; transfor",
    "rule": "aria-command-name",
    "impact": "serious",
    "where": {
      "selector": ".gallery-map__pin.leaflet-marker-icon.leaflet-interactive:nth-child(5)",
      "screenshotY": 2278,
      "screenshot": "desktop-1440-screen-04.png"
    },
    "hint": "Fix any of the following: Element does not have text that is visible to screen readers aria-label attribute does not exist or is empty aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty Element has no title attribute",
    "baselineKey": "aria-command-name|.gallery-map__pin.leaflet-marker-icon.leaflet-interactive:nth-child(5)",
    "ignored": false
  },
  {
    "element": "<div class=\"leaflet-marker-icon gallery-map__pin leaflet-zoom-animated leaflet-interactive\" tabindex=\"0\" role=\"button\" style=\"margin-left: -13px; margin-top: -38px; width: 26px; height: 38px; transfor",
    "rule": "aria-command-name",
    "impact": "serious",
    "where": {
      "selector": ".gallery-map__pin.leaflet-marker-icon.leaflet-interactive:nth-child(6)",
      "screenshotY": 2219,
      "screenshot": "desktop-1440-screen-04.png"
    },
    "hint": "Fix any of the following: Element does not have text that is visible to screen readers aria-label attribute does not exist or is empty aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty Element has no title attribute",
    "baselineKey": "aria-command-name|.gallery-map__pin.leaflet-marker-icon.leaflet-interactive:nth-child(6)",
    "ignored": false
  },
  {
    "element": "<div class=\"leaflet-marker-icon gallery-map__pin leaflet-zoom-animated leaflet-interactive\" tabindex=\"0\" role=\"button\" style=\"margin-left: -13px; margin-top: -38px; width: 26px; height: 38px; transfor",
    "rule": "aria-command-name",
    "impact": "serious",
    "where": {
      "selector": ".gallery-map__pin.leaflet-marker-icon.leaflet-interactive:nth-child(7)",
      "screenshotY": 2402,
      "screenshot": "desktop-1440-screen-04.png"
    },
    "hint": "Fix any of the following: Element does not have text that is visible to screen readers aria-label attribute does not exist or is empty aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty Element has no title attribute",
    "baselineKey": "aria-command-name|.gallery-map__pin.leaflet-marker-icon.leaflet-interactive:nth-child(7)",
    "ignored": false
  },
  {
    "element": "<div class=\"leaflet-marker-icon gallery-map__pin leaflet-zoom-animated leaflet-interactive\" tabindex=\"0\" role=\"button\" style=\"margin-left: -13px; margin-top: -38px; width: 26px; height: 38px; transfor",
    "rule": "aria-command-name",
    "impact": "serious",
    "where": {
      "selector": ".gallery-map__pin.leaflet-marker-icon.leaflet-interactive:nth-child(8)",
      "screenshotY": 2356,
      "screenshot": "desktop-1440-screen-04.png"
    },
    "hint": "Fix any of the following: Element does not have text that is visible to screen readers aria-label attribute does not exist or is empty aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty Element has no title attribute",
    "baselineKey": "aria-command-name|.gallery-map__pin.leaflet-marker-icon.leaflet-interactive:nth-child(8)",
    "ignored": false
  },
  {
    "element": "<div class=\"leaflet-marker-icon gallery-map__pin leaflet-zoom-animated leaflet-interactive\" tabindex=\"0\" role=\"button\" style=\"margin-left: -13px; margin-top: -38px; width: 26px; height: 38px; transfor",
    "rule": "aria-command-name",
    "impact": "serious",
    "where": {
      "selector": ".gallery-map__pin.leaflet-marker-icon.leaflet-interactive:nth-child(9)",
      "screenshotY": 2429,
      "screenshot": "desktop-1440-screen-04.png"
    },
    "hint": "Fix any of the following: Element does not have text that is visible to screen readers aria-label attribute does not exist or is empty aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty Element has no title attribute",
    "baselineKey": "aria-command-name|.gallery-map__pin.leaflet-marker-icon.leaflet-interactive:nth-child(9)",
    "ignored": false
  }
]
```

</details>
<details><summary><code>a11y_landmark</code> — детали (JSON)</summary>

```json
[
  {
    "element": "<section class=\"gallery-section\">",
    "rule": "region",
    "impact": "moderate",
    "where": {
      "selector": "section:nth-child(2)",
      "screenshotY": 520,
      "screenshot": "desktop-1440-screen-02.png"
    },
    "hint": "Fix any of the following: Some page content is not contained by landmarks",
    "baselineKey": "region|section:nth-child(2)",
    "ignored": false
  },
  {
    "element": "<section class=\"gallery-section\">",
    "rule": "region",
    "impact": "moderate",
    "where": {
      "selector": "section:nth-child(3)",
      "screenshotY": 1220,
      "screenshot": "desktop-1440-screen-03.png"
    },
    "hint": "Fix any of the following: Some page content is not contained by landmarks",
    "baselineKey": "region|section:nth-child(3)",
    "ignored": false
  },
  {
    "element": "<h2 class=\"sbr_typography sbr_typography__h2 gallery-display-tracking\" data-testid=\"Typography\" role=\"heading\">По годам</h2>",
    "rule": "region",
    "impact": "moderate",
    "where": {
      "selector": ".sbr_stack__spacing-x4 > h2",
      "screenshotY": 1586,
      "screenshot": "desktop-1440-screen-03.png"
    },
    "hint": "Fix any of the following: Some page content is not contained by landmarks",
    "baselineKey": "region|.sbr_stack__spacing-x4 > h2",
    "ignored": false
  },
  {
    "element": "<span class=\"sbr_typography sbr_typography__h3 gallery-accent\" data-testid=\"Typography\" role=\"heading\" aria-level=\"3\">2019</span>",
    "rule": "region",
    "impact": "moderate",
    "where": {
      "selector": ".gallery-history__year:nth-child(2) > .sbr_typography__h3.gallery-accent[aria-level=\"3\"]",
      "screenshotY": 1668,
      "screenshot": "desktop-1440-screen-03.png"
    },
    "hint": "Fix any of the following: Some page content is not contained by landmarks",
    "baselineKey": "region|.gallery-history__year:nth-child(2) > .sbr_typography__h3.gallery-accent[aria-level=\"3\"]",
    "ignored": false
  },
  {
    "element": "<div data-testid=\"Stack\" class=\"sbr_box sbr_box__display-flex sbr_stack sbr_stack__direction-vertical sbr_stack__spacing-x1 sbr_stack__align-stretch sbr_stack__justify-start sbr_stack__wrap-nowrap\">",
    "rule": "region",
    "impact": "moderate",
    "where": {
      "selector": ".gallery-history__year:nth-child(2) > .sbr_stack__direction-vertical.sbr_stack__spacing-x1.sbr_stack__align-stretch",
      "screenshotY": 1758,
      "screenshot": "desktop-1440-screen-03.png"
    },
    "hint": "Fix any of the following: Some page content is not contained by landmarks",
    "baselineKey": "region|.gallery-history__year:nth-child(2) > .sbr_stack__direction-vertical.sbr_stack__spacing-x1.sbr_stack__align-stretch",
    "ignored": false
  },
  {
    "element": "<span class=\"sbr_typography sbr_typography__h3 gallery-accent\" data-testid=\"Typography\" role=\"heading\" aria-level=\"3\">2022</span>",
    "rule": "region",
    "impact": "moderate",
    "where": {
      "selector": ".gallery-history__year:nth-child(3) > .sbr_typography__h3.gallery-accent[aria-level=\"3\"]",
      "screenshotY": 1668,
      "screenshot": "desktop-1440-screen-03.png"
    },
    "hint": "Fix any of the following: Some page content is not contained by landmarks",
    "baselineKey": "region|.gallery-history__year:nth-child(3) > .sbr_typography__h3.gallery-accent[aria-level=\"3\"]",
    "ignored": false
  },
  {
    "element": "<div data-testid=\"Stack\" class=\"sbr_box sbr_box__display-flex sbr_stack sbr_stack__direction-vertical sbr_stack__spacing-x1 sbr_stack__align-stretch sbr_stack__justify-start sbr_stack__wrap-nowrap\">",
    "rule": "region",
    "impact": "moderate",
    "where": {
      "selector": ".gallery-history__year:nth-child(3) > .sbr_stack__direction-vertical.sbr_stack__spacing-x1.sbr_stack__align-stretch",
      "screenshotY": 1758,
      "screenshot": "desktop-1440-screen-03.png"
    },
    "hint": "Fix any of the following: Some page content is not contained by landmarks",
    "baselineKey": "region|.gallery-history__year:nth-child(3) > .sbr_stack__direction-vertical.sbr_stack__spacing-x1.sbr_stack__align-stretch",
    "ignored": false
  },
  {
    "element": "<span class=\"sbr_typography sbr_typography__h3 gallery-accent\" data-testid=\"Typography\" role=\"heading\" aria-level=\"3\">2023</span>",
    "rule": "region",
    "impact": "moderate",
    "where": {
      "selector": ".gallery-history__year:nth-child(4) > .sbr_typography__h3.gallery-accent[aria-level=\"3\"]",
      "screenshotY": 1668,
      "screenshot": "desktop-1440-screen-03.png"
    },
    "hint": "Fix any of the following: Some page content is not contained by landmarks",
    "baselineKey": "region|.gallery-history__year:nth-child(4) > .sbr_typography__h3.gallery-accent[aria-level=\"3\"]",
    "ignored": false
  },
  {
    "element": "<div data-testid=\"Stack\" class=\"sbr_box sbr_box__display-flex sbr_stack sbr_stack__direction-vertical sbr_stack__spacing-x1 sbr_stack__align-stretch sbr_stack__justify-start sbr_stack__wrap-nowrap\">",
    "rule": "region",
    "impact": "moderate",
    "where": {
      "selector": ".gallery-history__year:nth-child(4) > .sbr_stack__direction-vertical.sbr_stack__spacing-x1.sbr_stack__align-stretch",
      "screenshotY": 1758,
      "screenshot": "desktop-1440-screen-03.png"
    },
    "hint": "Fix any of the following: Some page content is not contained by landmarks",
    "baselineKey": "region|.gallery-history__year:nth-child(4) > .sbr_stack__direction-vertical.sbr_stack__spacing-x1.sbr_stack__align-stretch",
    "ignored": false
  },
  {
    "element": "<span class=\"sbr_typography sbr_typography__h3 gallery-accent\" data-testid=\"Typography\" role=\"heading\" aria-level=\"3\">2024</span>",
    "rule": "region",
    "impact": "moderate",
    "where": {
      "selector": ".gallery-history__year:nth-child(5) > .sbr_typography__h3.gallery-accent[aria-level=\"3\"]",
      "screenshotY": 1668,
      "screenshot": "desktop-1440-screen-03.png"
    },
    "hint": "Fix any of the following: Some page content is not contained by landmarks",
    "baselineKey": "region|.gallery-history__year:nth-child(5) > .sbr_typography__h3.gallery-accent[aria-level=\"3\"]",
    "ignored": false
  },
  {
    "element": "<div data-testid=\"Stack\" class=\"sbr_box sbr_box__display-flex sbr_stack sbr_stack__direction-vertical sbr_stack__spacing-x1 sbr_stack__align-stretch sbr_stack__justify-start sbr_stack__wrap-nowrap\">",
    "rule": "region",
    "impact": "moderate",
    "where": {
      "selector": ".gallery-history__year:nth-child(5) > .sbr_stack__direction-vertical.sbr_stack__spacing-x1.sbr_stack__align-stretch",
      "screenshotY": 1758,
      "screenshot": "desktop-1440-screen-03.png"
    },
    "hint": "Fix any of the following: Some page content is not contained by landmarks",
    "baselineKey": "region|.gallery-history__year:nth-child(5) > .sbr_stack__direction-vertical.sbr_stack__spacing-x1.sbr_stack__align-stretch",
    "ignored": false
  },
  {
    "element": "<span class=\"sbr_typography sbr_typography__h3 gallery-accent\" data-testid=\"Typography\" role=\"heading\" aria-level=\"3\">2025</span>",
    "rule": "region",
    "impact": "moderate",
    "where": {
      "selector": ".gallery-history__year:nth-child(6) > .sbr_typography__h3.gallery-accent[aria-level=\"3\"]",
      "screenshotY": 1668,
      "screenshot": "desktop-1440-screen-03.png"
    },
    "hint": "Fix any of the following: Some page content is not contained by landmarks",
    "baselineKey": "region|.gallery-history__year:nth-child(6) > .sbr_typography__h3.gallery-accent[aria-level=\"3\"]",
    "ignored": false
  },
  {
    "element": "<div data-testid=\"Stack\" class=\"sbr_box sbr_box__display-flex sbr_stack sbr_stack__direction-vertical sbr_stack__spacing-x1 sbr_stack__align-stretch sbr_stack__justify-start sbr_stack__wrap-nowrap\">",
    "rule": "region",
    "impact": "moderate",
    "where": {
      "selector": ".gallery-history__year:nth-child(6) > .sbr_stack__direction-vertical.sbr_stack__spacing-x1.sbr_stack__align-stretch",
      "screenshotY": 1758,
      "screenshot": "desktop-1440-screen-03.png"
    },
    "hint": "Fix any of the following: Some page content is not contained by landmarks",
    "baselineKey": "region|.gallery-history__year:nth-child(6) > .sbr_stack__direction-vertical.sbr_stack__spacing-x1.sbr_stack__align-stretch",
    "ignored": false
  },
  {
    "element": "<span class=\"sbr_typography sbr_typography__h3 gallery-accent\" data-testid=\"Typography\" role=\"heading\" aria-level=\"3\">2026</span>",
    "rule": "region",
    "impact": "moderate",
    "where": {
      "selector": ".gallery-history__year:nth-child(7) > .sbr_typography__h3.gallery-accent[aria-level=\"3\"]",
      "screenshotY": 1668,
      "screenshot": "desktop-1440-screen-03.png"
    },
    "hint": "Fix any of the following: Some page content is not contained by landmarks",
    "baselineKey": "region|.gallery-history__year:nth-child(7) > .sbr_typography__h3.gallery-accent[aria-level=\"3\"]",
    "ignored": false
  },
  {
    "element": "<div data-testid=\"Stack\" class=\"sbr_box sbr_box__display-flex sbr_stack sbr_stack__direction-vertical sbr_stack__spacing-x1 sbr_stack__align-stretch sbr_stack__justify-start sbr_stack__wrap-nowrap\">",
    "rule": "region",
    "impact": "moderate",
    "where": {
      "selector": ".gallery-history__year:nth-child(7) > .sbr_stack__direction-vertical.sbr_stack__spacing-x1.sbr_stack__align-stretch",
      "screenshotY": 1758,
      "screenshot": "desktop-1440-screen-03.png"
    },
    "hint": "Fix any of the following: Some page content is not contained by landmarks",
    "baselineKey": "region|.gallery-history__year:nth-child(7) > .sbr_stack__direction-vertical.sbr_stack__spacing-x1.sbr_stack__align-stretch",
    "ignored": false
  },
  {
    "element": "<h2 class=\"sbr_typography sbr_typography__h2 gallery-display-tracking\" data-testid=\"Typography\" role=\"heading\">11 городов на карте России</h2>",
    "rule": "region",
    "impact": "moderate",
    "where": {
      "selector": ".gallery-container > h2",
      "screenshotY": 2048,
      "screenshot": "desktop-1440-screen-04.png"
    },
    "hint": "Fix any of the following: Some page content is not contained by landmarks",
    "baselineKey": "region|.gallery-container > h2",
    "ignored": false
  },
  {
    "element": "<div class=\"leaflet-bottom leaflet-right\"><div class=\"leaflet-control-attribution leaflet-control\">Leaflet <span aria-hidden=\"true\">|</span> Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics, ",
    "rule": "region",
    "impact": "moderate",
    "where": {
      "selector": ".leaflet-bottom.leaflet-right",
      "screenshotY": 2662,
      "screenshot": "desktop-1440-screen-04.png"
    },
    "hint": "Fix any of the following: Some page content is not contained by landmarks",
    "baselineKey": "region|.leaflet-bottom.leaflet-right",
    "ignored": false
  },
  {
    "element": "<html lang=\"ru\">",
    "rule": "landmark-one-main",
    "impact": "moderate",
    "where": {
      "selector": "html",
      "screenshotY": 0,
      "screenshot": "desktop-1440-screen-01.png"
    },
    "hint": "Fix all of the following: Document does not have a main landmark",
    "baselineKey": "landmark-one-main|html",
    "ignored": false
  }
]
```

</details>
Скриншоты: `art-na-zavod/desktop-1440-screen-01.png`, `art-na-zavod/desktop-1440-screen-02.png`, `art-na-zavod/desktop-1440-screen-03.png`, `art-na-zavod/desktop-1440-screen-04.png`, `art-na-zavod/desktop-1440-screen-05.png`, `art-na-zavod/desktop-1440-screen-06.png`, `art-na-zavod/desktop-1440-screen-07.png`, `art-na-zavod/desktop-1440-screen-08.png`, `art-na-zavod/desktop-1440-screen-09.png`, `art-na-zavod/desktop-1440-screen-10.png`, `art-na-zavod/desktop-1440-fullpage.png`

</details>

<details><summary><code>mobile-390</code> · document · высота 15965px · секций 5 · интерактивных 59</summary>

| чек | статус | что показал |
| --- | --- | --- |
| `css_vars_unresolved` | ✅ pass | все обязательные var(--…) резолвятся там, где применяются (проверено 61 имён в 12 таблицах стилей) |
| `section_rhythm_collapsed` | ✅ pass | вертикальный ритм есть у всех 5 секций |
| `page_not_scrollable` | ✅ pass | документ скроллится (15965px при видимой высоте 844px) |
| `inner_scroll_container` | ✅ pass | страница скроллится документом, внутренних скролл-контейнеров на высоту экрана нет |
| `horizontal_overflow` | ✅ pass | горизонтального скролла нет |
| `interactive_overlap` | ✅ pass | наложений нет (проверено 59 интерактивных элементов, 1711 пар) |
| `row_gap_collapsed` | ✅ pass | у горизонтальных строк ссылок есть зазоры |
| `narrow_column_empty_half` | ⏭️ skip | пропущено: чек только для десктопных вьюпортов |
| `text_block_overlap` | ✅ pass | текстовые блоки не пересекаются (проверено 109) |
| `icon_ligature_text` | ✅ pass | иконочный шрифт загружен, лигатуры отрисованы глифами |
| `reinvented_component` | ⏭️ skip | пропущен: @sibur/design-system-react не установлен у потребителя (старый форк?) — сравнивать отпечатки не с чем |
| `token_coverage` | ✅ pass | токен-покрытие 85.1% (1436/1687 значений) |
| `unrecognized_nodes` | ✅ pass | неопознанных узлов 40.6% (134/330 не сопоставлены с компонентом ДС) |
| `surface_seam` | ✅ pass | вложенных блоков на цвете базовой поверхности внутри raised-поверхности не найдено |
| `a11y_contrast` | ❌ fail | 3 нарушений — контраст текста ниже порога |
| `a11y_name` | ❌ fail | 3 нарушений — интерактивный элемент без доступного имени |
| `a11y_form_label` | ✅ pass | нарушений нет (поле формы без связанного label) |
| `a11y_landmark` | ⚠️ fail | 18 нарушений — нет ориентиров страницы (landmark / заголовок h1) |
| `failed_requests` | ✅ pass | все запросы отдались |
| `console_errors` | ✅ pass | консоль чистая |

<details><summary><code>a11y_contrast</code> — детали (JSON)</summary>

```json
[
  {
    "element": "<p class=\"sbr_typography sbr_typography__body2\" data-testid=\"Typography\" style=\"color: var(--color-text-light-inactive, rgba(255, 255, 255, 0.6));\">арт-объектов</p>",
    "rule": "color-contrast",
    "impact": "serious",
    "where": {
      "selector": ".sbr_box__display-block.sbr_grid-item[data-testid=\"GridItem\"]:nth-child(1) > .gallery-stat-card--teal.gallery-stat-card > .sbr_typography__body2",
      "screenshotY": 2678,
      "screenshot": "mobile-390-screen-05.png"
    },
    "hint": "Fix any of the following: Element has insufficient color contrast of 2.39 (foreground color: #99d1d5, background color: #008c95, font size: 12.8pt (17px), font weight: normal). Expected contrast ratio of 4.5:1",
    "baselineKey": "color-contrast|.sbr_box__display-block.sbr_grid-item[data-testid=\"GridItem\"]:nth-child(1) > .gallery-stat-card--teal.gallery-stat-card > .sbr_typography__body2",
    "ignored": false
  },
  {
    "element": "<p class=\"sbr_typography sbr_typography__body2\" data-testid=\"Typography\" style=\"color: var(--color-text-light-inactive, rgba(255, 255, 255, 0.6));\">регионов уже охвачено</p>",
    "rule": "color-contrast",
    "impact": "serious",
    "where": {
      "selector": ".gallery-stat-card--warm > .sbr_typography__body2",
      "screenshotY": 2838,
      "screenshot": "mobile-390-screen-05.png"
    },
    "hint": "Fix any of the following: Element has insufficient color contrast of 2.31 (foreground color: #f3b8b0, background color: #e04e39, font size: 12.8pt (17px), font weight: normal). Expected contrast ratio of 4.5:1",
    "baselineKey": "color-contrast|.gallery-stat-card--warm > .sbr_typography__body2",
    "ignored": false
  },
  {
    "element": "<p class=\"sbr_typography sbr_typography__body2\" data-testid=\"Typography\" style=\"color: var(--color-text-light-inactive, rgba(255, 255, 255, 0.6));\">самый большой мурал</p>",
    "rule": "color-contrast",
    "impact": "serious",
    "where": {
      "selector": ".sbr_box__display-block.sbr_grid-item[data-testid=\"GridItem\"]:nth-child(5) > .gallery-stat-card--teal.gallery-stat-card > .sbr_typography__body2",
      "screenshotY": 3340,
      "screenshot": "mobile-390-screen-06.png"
    },
    "hint": "Fix any of the following: Element has insufficient color contrast of 2.39 (foreground color: #99d1d5, background color: #008c95, font size: 12.8pt (17px), font weight: normal). Expected contrast ratio of 4.5:1",
    "baselineKey": "color-contrast|.sbr_box__display-block.sbr_grid-item[data-testid=\"GridItem\"]:nth-child(5) > .gallery-stat-card--teal.gallery-stat-card > .sbr_typography__body2",
    "ignored": false
  }
]
```

</details>
<details><summary><code>a11y_name</code> — детали (JSON)</summary>

```json
[
  {
    "element": "<div class=\"leaflet-marker-icon gallery-map__pin leaflet-zoom-animated leaflet-interactive\" tabindex=\"0\" role=\"button\" style=\"margin-left: -13px; margin-top: -38px; width: 26px; height: 38px; transfor",
    "rule": "aria-command-name",
    "impact": "serious",
    "where": {
      "selector": ".gallery-map__pin.leaflet-marker-icon.leaflet-interactive:nth-child(1)",
      "screenshotY": 4332,
      "screenshot": "mobile-390-screen-07.png"
    },
    "hint": "Fix any of the following: Element does not have text that is visible to screen readers aria-label attribute does not exist or is empty aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty Element has no title attribute",
    "baselineKey": "aria-command-name|.gallery-map__pin.leaflet-marker-icon.leaflet-interactive:nth-child(1)",
    "ignored": false
  },
  {
    "element": "<div class=\"leaflet-marker-icon gallery-map__pin leaflet-zoom-animated leaflet-interactive\" tabindex=\"0\" role=\"button\" style=\"margin-left: -13px; margin-top: -38px; width: 26px; height: 38px; transfor",
    "rule": "aria-command-name",
    "impact": "serious",
    "where": {
      "selector": ".gallery-map__pin.leaflet-marker-icon.leaflet-interactive:nth-child(2)",
      "screenshotY": 4307,
      "screenshot": "mobile-390-screen-07.png"
    },
    "hint": "Fix any of the following: Element does not have text that is visible to screen readers aria-label attribute does not exist or is empty aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty Element has no title attribute",
    "baselineKey": "aria-command-name|.gallery-map__pin.leaflet-marker-icon.leaflet-interactive:nth-child(2)",
    "ignored": false
  },
  {
    "element": "<div class=\"leaflet-marker-icon gallery-map__pin leaflet-zoom-animated leaflet-interactive\" tabindex=\"0\" role=\"button\" style=\"margin-left: -13px; margin-top: -38px; width: 26px; height: 38px; transfor",
    "rule": "aria-command-name",
    "impact": "serious",
    "where": {
      "selector": ".gallery-map__pin.leaflet-marker-icon.leaflet-interactive:nth-child(3)",
      "screenshotY": 4331,
      "screenshot": "mobile-390-screen-07.png"
    },
    "hint": "Fix any of the following: Element does not have text that is visible to screen readers aria-label attribute does not exist or is empty aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty Element has no title attribute",
    "baselineKey": "aria-command-name|.gallery-map__pin.leaflet-marker-icon.leaflet-interactive:nth-child(3)",
    "ignored": false
  }
]
```

</details>
<details><summary><code>a11y_landmark</code> — детали (JSON)</summary>

```json
[
  {
    "element": "<section class=\"gallery-section\">",
    "rule": "region",
    "impact": "moderate",
    "where": {
      "selector": "section:nth-child(2)",
      "screenshotY": 520,
      "screenshot": "mobile-390-screen-02.png"
    },
    "hint": "Fix any of the following: Some page content is not contained by landmarks",
    "baselineKey": "region|section:nth-child(2)",
    "ignored": false
  },
  {
    "element": "<section class=\"gallery-section\">",
    "rule": "region",
    "impact": "moderate",
    "where": {
      "selector": "section:nth-child(3)",
      "screenshotY": 2548,
      "screenshot": "mobile-390-screen-05.png"
    },
    "hint": "Fix any of the following: Some page content is not contained by landmarks",
    "baselineKey": "region|section:nth-child(3)",
    "ignored": false
  },
  {
    "element": "<h2 class=\"sbr_typography sbr_typography__h2 gallery-display-tracking\" data-testid=\"Typography\" role=\"heading\">По годам</h2>",
    "rule": "region",
    "impact": "moderate",
    "where": {
      "selector": ".sbr_stack__spacing-x4 > h2",
      "screenshotY": 3466,
      "screenshot": "mobile-390-screen-06.png"
    },
    "hint": "Fix any of the following: Some page content is not contained by landmarks",
    "baselineKey": "region|.sbr_stack__spacing-x4 > h2",
    "ignored": false
  },
  {
    "element": "<span class=\"sbr_typography sbr_typography__h3 gallery-accent\" data-testid=\"Typography\" role=\"heading\" aria-level=\"3\">2019</span>",
    "rule": "region",
    "impact": "moderate",
    "where": {
      "selector": ".gallery-history__year:nth-child(2) > .sbr_typography__h3.gallery-accent[aria-level=\"3\"]",
      "screenshotY": 3548,
      "screenshot": "mobile-390-screen-06.png"
    },
    "hint": "Fix any of the following: Some page content is not contained by landmarks",
    "baselineKey": "region|.gallery-history__year:nth-child(2) > .sbr_typography__h3.gallery-accent[aria-level=\"3\"]",
    "ignored": false
  },
  {
    "element": "<div data-testid=\"Stack\" class=\"sbr_box sbr_box__display-flex sbr_stack sbr_stack__direction-vertical sbr_stack__spacing-x1 sbr_stack__align-stretch sbr_stack__justify-start sbr_stack__wrap-nowrap\">",
    "rule": "region",
    "impact": "moderate",
    "where": {
      "selector": ".gallery-history__year:nth-child(2) > .sbr_stack__direction-vertical.sbr_stack__spacing-x1.sbr_stack__align-stretch",
      "screenshotY": 3638,
      "screenshot": "mobile-390-screen-06.png"
    },
    "hint": "Fix any of the following: Some page content is not contained by landmarks",
    "baselineKey": "region|.gallery-history__year:nth-child(2) > .sbr_stack__direction-vertical.sbr_stack__spacing-x1.sbr_stack__align-stretch",
    "ignored": false
  },
  {
    "element": "<span class=\"sbr_typography sbr_typography__h3 gallery-accent\" data-testid=\"Typography\" role=\"heading\" aria-level=\"3\">2022</span>",
    "rule": "region",
    "impact": "moderate",
    "where": {
      "selector": ".gallery-history__year:nth-child(3) > .sbr_typography__h3.gallery-accent[aria-level=\"3\"]",
      "screenshotY": 3548,
      "screenshot": "mobile-390-screen-06.png"
    },
    "hint": "Fix any of the following: Some page content is not contained by landmarks",
    "baselineKey": "region|.gallery-history__year:nth-child(3) > .sbr_typography__h3.gallery-accent[aria-level=\"3\"]",
    "ignored": false
  },
  {
    "element": "<div data-testid=\"Stack\" class=\"sbr_box sbr_box__display-flex sbr_stack sbr_stack__direction-vertical sbr_stack__spacing-x1 sbr_stack__align-stretch sbr_stack__justify-start sbr_stack__wrap-nowrap\">",
    "rule": "region",
    "impact": "moderate",
    "where": {
      "selector": ".gallery-history__year:nth-child(3) > .sbr_stack__direction-vertical.sbr_stack__spacing-x1.sbr_stack__align-stretch",
      "screenshotY": 3638,
      "screenshot": "mobile-390-screen-06.png"
    },
    "hint": "Fix any of the following: Some page content is not contained by landmarks",
    "baselineKey": "region|.gallery-history__year:nth-child(3) > .sbr_stack__direction-vertical.sbr_stack__spacing-x1.sbr_stack__align-stretch",
    "ignored": false
  },
  {
    "element": "<span class=\"sbr_typography sbr_typography__h3 gallery-accent\" data-testid=\"Typography\" role=\"heading\" aria-level=\"3\">2023</span>",
    "rule": "region",
    "impact": "moderate",
    "where": {
      "selector": ".gallery-history__year:nth-child(4) > .sbr_typography__h3.gallery-accent[aria-level=\"3\"]",
      "screenshotY": 3548,
      "screenshot": "mobile-390-screen-06.png"
    },
    "hint": "Fix any of the following: Some page content is not contained by landmarks",
    "baselineKey": "region|.gallery-history__year:nth-child(4) > .sbr_typography__h3.gallery-accent[aria-level=\"3\"]",
    "ignored": false
  },
  {
    "element": "<div data-testid=\"Stack\" class=\"sbr_box sbr_box__display-flex sbr_stack sbr_stack__direction-vertical sbr_stack__spacing-x1 sbr_stack__align-stretch sbr_stack__justify-start sbr_stack__wrap-nowrap\">",
    "rule": "region",
    "impact": "moderate",
    "where": {
      "selector": ".gallery-history__year:nth-child(4) > .sbr_stack__direction-vertical.sbr_stack__spacing-x1.sbr_stack__align-stretch",
      "screenshotY": 3638,
      "screenshot": "mobile-390-screen-06.png"
    },
    "hint": "Fix any of the following: Some page content is not contained by landmarks",
    "baselineKey": "region|.gallery-history__year:nth-child(4) > .sbr_stack__direction-vertical.sbr_stack__spacing-x1.sbr_stack__align-stretch",
    "ignored": false
  },
  {
    "element": "<span class=\"sbr_typography sbr_typography__h3 gallery-accent\" data-testid=\"Typography\" role=\"heading\" aria-level=\"3\">2024</span>",
    "rule": "region",
    "impact": "moderate",
    "where": {
      "selector": ".gallery-history__year:nth-child(5) > .sbr_typography__h3.gallery-accent[aria-level=\"3\"]",
      "screenshotY": 3548,
      "screenshot": "mobile-390-screen-06.png"
    },
    "hint": "Fix any of the following: Some page content is not contained by landmarks",
    "baselineKey": "region|.gallery-history__year:nth-child(5) > .sbr_typography__h3.gallery-accent[aria-level=\"3\"]",
    "ignored": false
  },
  {
    "element": "<div data-testid=\"Stack\" class=\"sbr_box sbr_box__display-flex sbr_stack sbr_stack__direction-vertical sbr_stack__spacing-x1 sbr_stack__align-stretch sbr_stack__justify-start sbr_stack__wrap-nowrap\">",
    "rule": "region",
    "impact": "moderate",
    "where": {
      "selector": ".gallery-history__year:nth-child(5) > .sbr_stack__direction-vertical.sbr_stack__spacing-x1.sbr_stack__align-stretch",
      "screenshotY": 3638,
      "screenshot": "mobile-390-screen-06.png"
    },
    "hint": "Fix any of the following: Some page content is not contained by landmarks",
    "baselineKey": "region|.gallery-history__year:nth-child(5) > .sbr_stack__direction-vertical.sbr_stack__spacing-x1.sbr_stack__align-stretch",
    "ignored": false
  },
  {
    "element": "<span class=\"sbr_typography sbr_typography__h3 gallery-accent\" data-testid=\"Typography\" role=\"heading\" aria-level=\"3\">2025</span>",
    "rule": "region",
    "impact": "moderate",
    "where": {
      "selector": ".gallery-history__year:nth-child(6) > .sbr_typography__h3.gallery-accent[aria-level=\"3\"]",
      "screenshotY": 3548,
      "screenshot": "mobile-390-screen-06.png"
    },
    "hint": "Fix any of the following: Some page content is not contained by landmarks",
    "baselineKey": "region|.gallery-history__year:nth-child(6) > .sbr_typography__h3.gallery-accent[aria-level=\"3\"]",
    "ignored": false
  },
  {
    "element": "<div data-testid=\"Stack\" class=\"sbr_box sbr_box__display-flex sbr_stack sbr_stack__direction-vertical sbr_stack__spacing-x1 sbr_stack__align-stretch sbr_stack__justify-start sbr_stack__wrap-nowrap\">",
    "rule": "region",
    "impact": "moderate",
    "where": {
      "selector": ".gallery-history__year:nth-child(6) > .sbr_stack__direction-vertical.sbr_stack__spacing-x1.sbr_stack__align-stretch",
      "screenshotY": 3638,
      "screenshot": "mobile-390-screen-06.png"
    },
    "hint": "Fix any of the following: Some page content is not contained by landmarks",
    "baselineKey": "region|.gallery-history__year:nth-child(6) > .sbr_stack__direction-vertical.sbr_stack__spacing-x1.sbr_stack__align-stretch",
    "ignored": false
  },
  {
    "element": "<span class=\"sbr_typography sbr_typography__h3 gallery-accent\" data-testid=\"Typography\" role=\"heading\" aria-level=\"3\">2026</span>",
    "rule": "region",
    "impact": "moderate",
    "where": {
      "selector": ".gallery-history__year:nth-child(7) > .sbr_typography__h3.gallery-accent[aria-level=\"3\"]",
      "screenshotY": 3548,
      "screenshot": "mobile-390-screen-06.png"
    },
    "hint": "Fix any of the following: Some page content is not contained by landmarks",
    "baselineKey": "region|.gallery-history__year:nth-child(7) > .sbr_typography__h3.gallery-accent[aria-level=\"3\"]",
    "ignored": false
  },
  {
    "element": "<div data-testid=\"Stack\" class=\"sbr_box sbr_box__display-flex sbr_stack sbr_stack__direction-vertical sbr_stack__spacing-x1 sbr_stack__align-stretch sbr_stack__justify-start sbr_stack__wrap-nowrap\">",
    "rule": "region",
    "impact": "moderate",
    "where": {
      "selector": ".gallery-history__year:nth-child(7) > .sbr_stack__direction-vertical.sbr_stack__spacing-x1.sbr_stack__align-stretch",
      "screenshotY": 3638,
      "screenshot": "mobile-390-screen-06.png"
    },
    "hint": "Fix any of the following: Some page content is not contained by landmarks",
    "baselineKey": "region|.gallery-history__year:nth-child(7) > .sbr_stack__direction-vertical.sbr_stack__spacing-x1.sbr_stack__align-stretch",
    "ignored": false
  },
  {
    "element": "<h2 class=\"sbr_typography sbr_typography__h2 gallery-display-tracking\" data-testid=\"Typography\" role=\"heading\">11 городов на карте России</h2>",
    "rule": "region",
    "impact": "moderate",
    "where": {
      "selector": ".gallery-container > h2",
      "screenshotY": 3928,
      "screenshot": "mobile-390-screen-06.png"
    },
    "hint": "Fix any of the following: Some page content is not contained by landmarks",
    "baselineKey": "region|.gallery-container > h2",
    "ignored": false
  },
  {
    "element": "<div class=\"leaflet-bottom leaflet-right\"><div class=\"leaflet-control-attribution leaflet-control\">Leaflet <span aria-hidden=\"true\">|</span> Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics, ",
    "rule": "region",
    "impact": "moderate",
    "where": {
      "selector": ".leaflet-bottom.leaflet-right",
      "screenshotY": 4584,
      "screenshot": "mobile-390-screen-07.png"
    },
    "hint": "Fix any of the following: Some page content is not contained by landmarks",
    "baselineKey": "region|.leaflet-bottom.leaflet-right",
    "ignored": false
  },
  {
    "element": "<html lang=\"ru\">",
    "rule": "landmark-one-main",
    "impact": "moderate",
    "where": {
      "selector": "html",
      "screenshotY": 0,
      "screenshot": "mobile-390-screen-01.png"
    },
    "hint": "Fix all of the following: Document does not have a main landmark",
    "baselineKey": "landmark-one-main|html",
    "ignored": false
  }
]
```

</details>
Скриншоты: `art-na-zavod/mobile-390-screen-01.png`, `art-na-zavod/mobile-390-screen-02.png`, `art-na-zavod/mobile-390-screen-03.png`, `art-na-zavod/mobile-390-screen-04.png`, `art-na-zavod/mobile-390-screen-05.png`, `art-na-zavod/mobile-390-screen-06.png`, `art-na-zavod/mobile-390-screen-07.png`, `art-na-zavod/mobile-390-screen-08.png`, `art-na-zavod/mobile-390-screen-09.png`, `art-na-zavod/mobile-390-screen-10.png`, `art-na-zavod/mobile-390-screen-11.png`, `art-na-zavod/mobile-390-screen-12.png`, `art-na-zavod/mobile-390-screen-13.png`, `art-na-zavod/mobile-390-screen-14.png`, `art-na-zavod/mobile-390-screen-15.png`, `art-na-zavod/mobile-390-screen-16.png`, `art-na-zavod/mobile-390-screen-17.png`, `art-na-zavod/mobile-390-screen-18.png`, `art-na-zavod/mobile-390-screen-19.png`, `art-na-zavod/mobile-390-screen-20.png`, `art-na-zavod/mobile-390-screen-21.png`, `art-na-zavod/mobile-390-screen-22.png`, `art-na-zavod/mobile-390-screen-23.png`, `art-na-zavod/mobile-390-fullpage.png`

</details>
