/**
 * Реальные фото с `photo.sibur.ru` (публичный фотобанк СИБУРа, поиск по тегу
 * «Промышленное искусство», id 8203). Сопоставление — на уровне ПЛОЩАДКИ, не
 * конкретного объекта: фотобанк группирует снимки по предприятию, а не по
 * названию мурала, поэтому нет надёжного способа автоматически определить,
 * какое фото — какой именно из нескольких муралов на одной площадке (кроме
 * единичных случаев, где на площадке всего один объект). Разные объекты
 * одной площадки в `ObjectCard` циклически берут разные фото из общего
 * пула — это честнее, чем показывать всем один и тот же кадр, но не
 * выдаётся за точное соответствие «это фото именно этого мурала».
 *
 * Файлы — `public/photos/<facility>/*.jpg`, скачаны напрямую (вариант
 * 1200×1200, тот же, что показывает сайт в лайтбоксе — не постер-разрешение
 * для печати).
 */
export const FACILITY_PHOTOS: Record<string, readonly string[]> = {
	'ЗСНХ (ЗапСибНефтехим)': ['/photos/zsnh/1.jpg', '/photos/zsnh/2.jpg', '/photos/zsnh/3.jpg', '/photos/zsnh/4.jpg', '/photos/zsnh/5.jpg', '/photos/zsnh/6.jpg'],
	'СХП (СИБУР-Химпром)': ['/photos/shp/1.jpg', '/photos/shp/2.jpg', '/photos/shp/3.jpg', '/photos/shp/4.jpg', '/photos/shp/5.jpg', '/photos/shp/6.jpg'],
	'СИБУР Кстово': ['/photos/kstovo/1.jpg'],
	Полиэф: ['/photos/poliev/1.jpg', '/photos/poliev/2.jpg', '/photos/poliev/3.jpg', '/photos/poliev/4.jpg', '/photos/poliev/5.jpg', '/photos/poliev/6.jpg'],
	'ТНХ (Томскнефтехим)': ['/photos/tnh/1.jpg', '/photos/tnh/2.jpg', '/photos/tnh/3.jpg', '/photos/tnh/4.jpg', '/photos/tnh/5.jpg', '/photos/tnh/6.jpg'],
	'КОС (Казаньоргсинтез)': ['/photos/kos/1.jpg', '/photos/kos/2.jpg', '/photos/kos/3.jpg', '/photos/kos/4.jpg', '/photos/kos/5.jpg', '/photos/kos/6.jpg'],
	'НКНХ (Нижнекамскнефтехим)': ['/photos/nknh/1.jpg', '/photos/nknh/2.jpg', '/photos/nknh/3.jpg', '/photos/nknh/4.jpg', '/photos/nknh/5.jpg', '/photos/nknh/6.jpg'],
	'НВГПЗ (Нижневартовский ГПЗ)': ['/photos/nvgpz/1.jpg', '/photos/nvgpz/2.jpg', '/photos/nvgpz/3.jpg', '/photos/nvgpz/4.jpg', '/photos/nvgpz/5.jpg', '/photos/nvgpz/6.jpg'],
	'ВГПЗ (Вынгапуровский ГПЗ)': ['/photos/vgpz/1.jpg', '/photos/vgpz/2.jpg'],
	РВЛ: ['/photos/kstovo/1.jpg'],
	'АГХК (Амурский газохимический комплекс)': ['/photos/aghk/1.jpg', '/photos/aghk/2.jpg', '/photos/aghk/3.jpg', '/photos/aghk/4.jpg', '/photos/aghk/5.jpg'],
	'ВСК (Воронежсинтезкаучук)': ['/photos/vsk/1.jpg', '/photos/vsk/2.jpg', '/photos/vsk/3.jpg', '/photos/vsk/4.jpg', '/photos/vsk/5.jpg', '/photos/vsk/6.jpg'],
};

/** Детерминированный выбор фото объекта из пула его площадки. */
export function photoFor(facility: string, indexWithinFacility: number): string | null {
	const pool = FACILITY_PHOTOS[facility];
	if (!pool || pool.length === 0) return null;
	return pool[indexWithinFacility % pool.length];
}
