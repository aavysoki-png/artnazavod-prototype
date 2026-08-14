#!/usr/bin/env python3
"""Человекочитаемый реестр + явный список дыр — на сверку заказчику (задача 31)."""
import json

with open("extraction/registry.json", encoding="utf-8") as f:
	OBJECTS = json.load(f)

CITIES = sorted({o["city"] for o in OBJECTS})
YEARS = sorted({str(o["year"]) for o in OBJECTS if o["year"] is not None})
NO_YEAR = [o for o in OBJECTS if o["year"] is None]
NO_DESC = [o for o in OBJECTS if not o.get("description")]
NO_ARTIST = [o for o in OBJECTS if not o.get("artist")]
TYPOS = [o for o in OBJECTS if o.get("raw_title_typo")]
NOTES = [o for o in OBJECTS if o.get("group_note") or o.get("facility_note") or o.get("city_note") or o.get("year_note")]

lines = []
lines.append("# Реестр объектов «АртНаЗавод» — из презентации заказчика\n")
lines.append(
	"> Источник: `Промышленное_искусство_сводная_2026_08_SM_ПРЕДВАРИТЕЛЬНАЯ.pptx` "
	"(63 слайда, 111 медиафайлов). Собрано машинно + вручную сгруппировано по объектам "
	"(один слайд ≠ один объект — см. `CLAUDE.md`). Структурированные данные — "
	"`extraction/registry.json`, рабочие превью изображений — `extraction/previews/` "
	"(⚠️ для сайта не годятся, см. ниже).\n"
)
lines.append(f"**Объектов: {len(OBJECTS)}** · городов: {len(CITIES)} · годы реализации: {YEARS[0]}–{YEARS[-1]}\n")
lines.append(f"Города: {', '.join(CITIES)}\n")

lines.append("\n## ⚠️ Список дыр — вопросы заказчику, не додумывать самим\n")

lines.append(f"\n### Год не указан ({len(NO_YEAR)})\n")
for o in NO_YEAR:
	note = o.get("year_note", "")
	lines.append(f"- **{o['facility']}, {o['city']} — {o['title']}** (слайды {o['slides']}). {note}")

lines.append(f"\n### Описание отсутствует ({len(NO_DESC)})\n")
for o in NO_DESC:
	lines.append(f"- **{o['facility']}, {o['city']} — {o['title']}** (слайды {o['slides']}) — на слайде только заголовок и год.")

lines.append(f"\n### Художник/автор не указан ({len(NO_ARTIST)} из {len(OBJECTS)})\n")
lines.append(
	"Ни на одном слайде презентации нет отдельного поля «художник» — это касается "
	"практически всех объектов, не единичный пробел. У части объектов (Минин, Чкалов, "
	"РМЗ, Реки на ЭП600) в тексте описана механика создания или команда, но имени "
	"конкретного художника нет нигде. **Это системный пробел исходных данных, а не "
	"недосмотр при разборе.**"
)

lines.append(f"\n### Опечатки и незавершённые названия в оригинале ({len(TYPOS)})\n")
lines.append("Не исправлены молча — воспроизведены как есть с пояснением:\n")
for o in TYPOS:
	lines.append(f"- **{o['id']}**: {o['raw_title_typo']}")

lines.append("\n### Конфликт данных (требует решения заказчика, не наша интерпретация)\n")
batiskaf = next(o for o in OBJECTS if o["id"] == "aghk-batiskaf")
lines.append(f"- **{batiskaf['facility']}, {batiskaf['city']} — {batiskaf['title']}**: {batiskaf['year_note']}")

lines.append("\n### Прочие неопределённости, отмеченные при разборе\n")
for o in NOTES:
	if o["id"] == "aghk-batiskaf":
		continue
	note = o.get("group_note") or o.get("facility_note") or o.get("city_note") or o.get("year_note")
	lines.append(f"- **{o['id']}** ({o['facility']}, {o['city']} — {o['title']}): {note}")

lines.append(
	"\n### Фото для сайта — оригиналы нужны отдельно\n"
	"Изображения из презентации (`extraction/previews/`) извлечены как рабочие превью "
	"для прототипа. Для публикации на sibur.ru они не годятся: пережаты под слайды "
	"(разрешение и сжатие PowerPoint), часть — скриншоты, а не фотографии. Оригиналы — "
	"в фотобанке `photo.sibur.ru`. Отдельно заказчик предупредил: на части площадок "
	"сотрудники в кадре ещё в старой спецодежде (особенно Нижнекамск) — отбор фото "
	"для публикации нужен ручной, не автоматический."
)

lines.append("\n### Координаты объектов для карты\n")
lines.append(
	"В презентации координат нет вообще ни у одного объекта — заказчик обещал прислать "
	"их отдельно (см. задачу 34 доски). Без них секция карты в прототипе останется на "
	"заглушке с примерной геопривязкой по городу."
)

lines.append("\n---\n\n## Полный реестр\n")
for o in OBJECTS:
	lines.append(f"### {o['facility']}, {o['city']} — {o['title']}")
	if o.get("group_note"):
		lines.append(f"> {o['group_note']}")
	year_str = str(o["year"]) if o["year"] is not None else "**не указан**"
	lines.append(f"- **Год реализации:** {year_str}" + (f" _{o['year_note']}_" if o.get("year_note") else ""))
	if o.get("city_note"):
		lines.append(f"- _{o['city_note']}_")
	if o.get("facility_note"):
		lines.append(f"- _{o['facility_note']}_")
	lines.append(f"- **Художник:** {o.get('artist') or 'не указан'}")
	lines.append(f"- **Описание:** {o.get('description') or '_отсутствует на слайде_'}")
	lines.append(f"- **Слайды-источники:** {', '.join(str(s) for s in o['slides'])}")
	lines.append(f"- **Медиа (рабочие превью):** {len(o['media'])} файлов — `{'`, `'.join(o['media'])}`")
	if o.get("video_ref"):
		lines.append(f"- **Видео:** {o['video_ref']}")
	if o.get("raw_title_typo"):
		lines.append(f"- ⚠️ {o['raw_title_typo']}")
	lines.append("")

with open("extraction/REGISTRY.md", "w", encoding="utf-8") as f:
	f.write("\n".join(lines))

print("Записано extraction/REGISTRY.md")
print(f"Объектов: {len(OBJECTS)}")
print(f"Без года: {len(NO_YEAR)} | Без описания: {len(NO_DESC)} | Без художника: {len(NO_ARTIST)}/{len(OBJECTS)}")
print(f"Опечаток отмечено: {len(TYPOS)}")
