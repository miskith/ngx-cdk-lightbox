export interface IGalleryI18n {
	next: string;
	previous: string;
	close: string;
	loading: string;
	gallery: string;
	counter: string;
}

export type TSupportedLightboxLanguage =
	| 'en'
	| 'de'
	| 'pl'
	| 'cs'
	| 'sk'
	| 'es'
	| 'it'
	| 'uk'
	| 'ja'
	| 'hi'
	| 'in'
	| 'fr'
	| 'pt'
	| 'nl'
	| 'sv'
	| 'no'
	| 'nb'
	| 'da'
	| 'fi'
	| 'hu'
	| 'el'
	| 'ro'
	| 'hr'
	| 'ko'
	| 'zh'
	| 'zh-CN'
	| 'tr'
	| 'vi'
	| 'ar'
	| 'english'
	| 'german'
	| 'polish'
	| 'czech'
	| 'slovak'
	| 'spanish'
	| 'italian'
	| 'ukrainian'
	| 'japanese'
	| 'hindi'
	| 'indian'
	| 'french'
	| 'portuguese'
	| 'dutch'
	| 'swedish'
	| 'norwegian'
	| 'danish'
	| 'finnish'
	| 'hungarian'
	| 'greek'
	| 'romanian'
	| 'croatian'
	| 'korean'
	| 'chinese'
	| 'turkish'
	| 'vietnamese'
	| 'arabic';

export const LIGHTBOX_I18N_EN: Readonly<IGalleryI18n> = {
	next: 'Next',
	previous: 'Previous',
	close: 'Close',
	loading: 'Loading gallery media...',
	gallery: 'Media Lightbox Gallery',
	counter: 'IMAGE_INDEX photo of IMAGE_COUNT',
};

export const LIGHTBOX_I18N_DE: Readonly<IGalleryI18n> = {
	next: 'Weiter',
	previous: 'Zurück',
	close: 'Schließen',
	loading: 'Galeriemedien werden geladen...',
	gallery: 'Medien-Lightbox-Galerie',
	counter: 'IMAGE_INDEX Foto von IMAGE_COUNT',
};

export const LIGHTBOX_I18N_PL: Readonly<IGalleryI18n> = {
	next: 'Dalej',
	previous: 'Wstecz',
	close: 'Zamknij',
	loading: 'Ładowanie multimediów galerii...',
	gallery: 'Galeria multimediów w oknie podręcznym',
	counter: 'IMAGE_INDEX zdjęcie z IMAGE_COUNT',
};

export const LIGHTBOX_I18N_CS: Readonly<IGalleryI18n> = {
	next: 'Další',
	previous: 'Předchozí',
	close: 'Zavřít',
	loading: 'Načítání médií galerie...',
	gallery: 'Galerie médií v překryvné vrstvě',
	counter: 'IMAGE_INDEX fotka z IMAGE_COUNT',
};

export const LIGHTBOX_I18N_SK: Readonly<IGalleryI18n> = {
	next: 'Ďalej',
	previous: 'Späť',
	close: 'Zavrieť',
	loading: 'Načítava sa obsah galérie...',
	gallery: 'Galéria médií v prekryvnej vrstve',
	counter: 'IMAGE_INDEX fotka z IMAGE_COUNT',
};

export const LIGHTBOX_I18N_ES: Readonly<IGalleryI18n> = {
	next: 'Siguiente',
	previous: 'Anterior',
	close: 'Cerrar',
	loading: 'Cargando contenido multimedia...',
	gallery: 'Galería multimedia emergente',
	counter: 'IMAGE_INDEX foto de IMAGE_COUNT',
};

export const LIGHTBOX_I18N_IT: Readonly<IGalleryI18n> = {
	next: 'Avanti',
	previous: 'Indietro',
	close: 'Chiudi',
	loading: 'Caricamento contenuti multimediali in corso...',
	gallery: 'Galleria multimediale popup',
	counter: 'IMAGE_INDEX foto di IMAGE_COUNT',
};

export const LIGHTBOX_I18N_UK: Readonly<IGalleryI18n> = {
	next: 'Далі',
	previous: 'Назад',
	close: 'Закрити',
	loading: 'Завантаження мультимедіа галереї...',
	gallery: 'Галерея мультимедіа',
	counter: 'IMAGE_INDEX фото з IMAGE_COUNT',
};

export const LIGHTBOX_I18N_JA: Readonly<IGalleryI18n> = {
	next: '次へ',
	previous: '前へ',
	close: '閉じる',
	loading: 'ギャラリーメディアを読み込み中...',
	gallery: 'メディアライトボックスギャラリー',
	counter: 'IMAGE_COUNT枚中IMAGE_INDEX枚目の写真',
};

export const LIGHTBOX_I18N_HI: Readonly<IGalleryI18n> = {
	next: 'अगला',
	previous: 'पिछला',
	close: 'बंद करें',
	loading: 'गैलरी मीडिया लोड हो रहा है...',
	gallery: 'मीडिया लाइटबॉक्स गैलरी',
	counter: 'IMAGE_COUNT में से IMAGE_INDEX फोटो',
};

export const LIGHTBOX_I18N_FR: Readonly<IGalleryI18n> = {
	next: 'Suivant',
	previous: 'Précédent',
	close: 'Fermer',
	loading: 'Chargement des médias de la galerie...',
	gallery: 'Galerie multimédia',
	counter: 'Photo IMAGE_INDEX sur IMAGE_COUNT',
};

export const LIGHTBOX_I18N_PT: Readonly<IGalleryI18n> = {
	next: 'Próximo',
	previous: 'Anterior',
	close: 'Fechar',
	loading: 'Carregando mídia da galeria...',
	gallery: 'Galeria multimídia',
	counter: 'Foto IMAGE_INDEX de IMAGE_COUNT',
};

export const LIGHTBOX_I18N_NL: Readonly<IGalleryI18n> = {
	next: 'Volgende',
	previous: 'Vorige',
	close: 'Sluiten',
	loading: 'Galerijmedia laden...',
	gallery: 'Medialightbox-galerij',
	counter: 'IMAGE_INDEX foto van IMAGE_COUNT',
};

export const LIGHTBOX_I18N_SV: Readonly<IGalleryI18n> = {
	next: 'Nästa',
	previous: 'Föregående',
	close: 'Stäng',
	loading: 'Laddar gallerimedia...',
	gallery: 'Mediegalleri',
	counter: 'Bild IMAGE_INDEX av IMAGE_COUNT',
};

export const LIGHTBOX_I18N_NO: Readonly<IGalleryI18n> = {
	next: 'Neste',
	previous: 'Forrige',
	close: 'Lukk',
	loading: 'Laster gallerimedier...',
	gallery: 'Mediegalleri',
	counter: 'Bilde IMAGE_INDEX av IMAGE_COUNT',
};

export const LIGHTBOX_I18N_DA: Readonly<IGalleryI18n> = {
	next: 'Næste',
	previous: 'Forrige',
	close: 'Luk',
	loading: 'Indlæser gallerimedier...',
	gallery: 'Mediegalleri',
	counter: 'Billede IMAGE_INDEX af IMAGE_COUNT',
};

export const LIGHTBOX_I18N_FI: Readonly<IGalleryI18n> = {
	next: 'Seuraava',
	previous: 'Edellinen',
	close: 'Sulje',
	loading: 'Ladataan galleriakuvaa...',
	gallery: 'Mediagalleria',
	counter: 'Kuva IMAGE_INDEX / IMAGE_COUNT',
};

export const LIGHTBOX_I18N_HU: Readonly<IGalleryI18n> = {
	next: 'Következő',
	previous: 'Előző',
	close: 'Bezárás',
	loading: 'Galéria médiatartalmának betöltése...',
	gallery: 'Média galéria',
	counter: 'IMAGE_INDEX. kép / IMAGE_COUNT',
};

export const LIGHTBOX_I18N_EL: Readonly<IGalleryI18n> = {
	next: 'Επόμενο',
	previous: 'Προηγούμενο',
	close: 'Κλείσιμο',
	loading: 'Φόρτωση πολυμέσων συλλογής...',
	gallery: 'Συλλογή πολυμέσων',
	counter: 'Φωτογραφία IMAGE_INDEX από IMAGE_COUNT',
};

export const LIGHTBOX_I18N_RO: Readonly<IGalleryI18n> = {
	next: 'Următorul',
	previous: 'Anteriorul',
	close: 'Închide',
	loading: 'Se încarcă fișierele media...',
	gallery: 'Galerie media',
	counter: 'Poza IMAGE_INDEX din IMAGE_COUNT',
};

export const LIGHTBOX_I18N_HR: Readonly<IGalleryI18n> = {
	next: 'Sljedeće',
	previous: 'Prethodno',
	close: 'Zatvori',
	loading: 'Učitavanje medija galerije...',
	gallery: 'Galerija medija',
	counter: 'Slika IMAGE_INDEX od IMAGE_COUNT',
};

export const LIGHTBOX_I18N_KO: Readonly<IGalleryI18n> = {
	next: '다음',
	previous: '이전',
	close: '닫기',
	loading: '갤러리 미디어를 불러오는 중...',
	gallery: '미디어 라이트박스 갤러리',
	counter: 'IMAGE_COUNT개 중 IMAGE_INDEX번째 사진',
};

export const LIGHTBOX_I18N_ZH: Readonly<IGalleryI18n> = {
	next: '下一张',
	previous: '上一张',
	close: '关闭',
	loading: '正在加载媒体...',
	gallery: '媒体灯箱画廊',
	counter: '第 IMAGE_INDEX 张 / 共 IMAGE_COUNT 张',
};

export const LIGHTBOX_I18N_TR: Readonly<IGalleryI18n> = {
	next: 'Sonraki',
	previous: 'Önceki',
	close: 'Kapat',
	loading: 'Galeri medyası yükleniyor...',
	gallery: 'Medya Galerisi',
	counter: 'IMAGE_INDEX / IMAGE_COUNT fotoğraf',
};

export const LIGHTBOX_I18N_VI: Readonly<IGalleryI18n> = {
	next: 'Tiếp theo',
	previous: 'Trước đó',
	close: 'Đóng',
	loading: 'Đang tải phương tiện...',
	gallery: 'Bộ sưu tập phương tiện',
	counter: 'Ảnh IMAGE_INDEX trên IMAGE_COUNT',
};

export const LIGHTBOX_I18N_AR: Readonly<IGalleryI18n> = {
	next: 'التالي',
	previous: 'السابق',
	close: 'إغلاق',
	loading: 'جارٍ تحميل وسائط المعرض...',
	gallery: 'معرض وسائط منبثق',
	counter: 'صورة IMAGE_INDEX من IMAGE_COUNT',
};

export const LIGHTBOX_I18N_ENGLISH = LIGHTBOX_I18N_EN;
export const LIGHTBOX_I18N_GERMAN = LIGHTBOX_I18N_DE;
export const LIGHTBOX_I18N_POLISH = LIGHTBOX_I18N_PL;
export const LIGHTBOX_I18N_CZECH = LIGHTBOX_I18N_CS;
export const LIGHTBOX_I18N_SLOVAK = LIGHTBOX_I18N_SK;
export const LIGHTBOX_I18N_SPANISH = LIGHTBOX_I18N_ES;
export const LIGHTBOX_I18N_ITALIAN = LIGHTBOX_I18N_IT;
export const LIGHTBOX_I18N_UKRAINIAN = LIGHTBOX_I18N_UK;
export const LIGHTBOX_I18N_JAPANESE = LIGHTBOX_I18N_JA;
export const LIGHTBOX_I18N_HINDI = LIGHTBOX_I18N_HI;
export const LIGHTBOX_I18N_INDIAN = LIGHTBOX_I18N_HI;
export const LIGHTBOX_I18N_FRENCH = LIGHTBOX_I18N_FR;
export const LIGHTBOX_I18N_PORTUGUESE = LIGHTBOX_I18N_PT;
export const LIGHTBOX_I18N_DUTCH = LIGHTBOX_I18N_NL;
export const LIGHTBOX_I18N_SWEDISH = LIGHTBOX_I18N_SV;
export const LIGHTBOX_I18N_NORWEGIAN = LIGHTBOX_I18N_NO;
export const LIGHTBOX_I18N_DANISH = LIGHTBOX_I18N_DA;
export const LIGHTBOX_I18N_FINNISH = LIGHTBOX_I18N_FI;
export const LIGHTBOX_I18N_HUNGARIAN = LIGHTBOX_I18N_HU;
export const LIGHTBOX_I18N_GREEK = LIGHTBOX_I18N_EL;
export const LIGHTBOX_I18N_ROMANIAN = LIGHTBOX_I18N_RO;
export const LIGHTBOX_I18N_CROATIAN = LIGHTBOX_I18N_HR;
export const LIGHTBOX_I18N_KOREAN = LIGHTBOX_I18N_KO;
export const LIGHTBOX_I18N_CHINESE = LIGHTBOX_I18N_ZH;
export const LIGHTBOX_I18N_TURKISH = LIGHTBOX_I18N_TR;
export const LIGHTBOX_I18N_VIETNAMESE = LIGHTBOX_I18N_VI;
export const LIGHTBOX_I18N_ARABIC = LIGHTBOX_I18N_AR;

export const LIGHTBOX_I18N_PRESETS: Record<TSupportedLightboxLanguage, Readonly<IGalleryI18n>> = {
	en: LIGHTBOX_I18N_EN,
	de: LIGHTBOX_I18N_DE,
	pl: LIGHTBOX_I18N_PL,
	cs: LIGHTBOX_I18N_CS,
	sk: LIGHTBOX_I18N_SK,
	es: LIGHTBOX_I18N_ES,
	it: LIGHTBOX_I18N_IT,
	uk: LIGHTBOX_I18N_UK,
	ja: LIGHTBOX_I18N_JA,
	hi: LIGHTBOX_I18N_HI,
	in: LIGHTBOX_I18N_HI,
	fr: LIGHTBOX_I18N_FR,
	pt: LIGHTBOX_I18N_PT,
	nl: LIGHTBOX_I18N_NL,
	sv: LIGHTBOX_I18N_SV,
	no: LIGHTBOX_I18N_NO,
	nb: LIGHTBOX_I18N_NO,
	da: LIGHTBOX_I18N_DA,
	fi: LIGHTBOX_I18N_FI,
	hu: LIGHTBOX_I18N_HU,
	el: LIGHTBOX_I18N_EL,
	ro: LIGHTBOX_I18N_RO,
	hr: LIGHTBOX_I18N_HR,
	ko: LIGHTBOX_I18N_KO,
	zh: LIGHTBOX_I18N_ZH,
	'zh-CN': LIGHTBOX_I18N_ZH,
	tr: LIGHTBOX_I18N_TR,
	vi: LIGHTBOX_I18N_VI,
	ar: LIGHTBOX_I18N_AR,
	english: LIGHTBOX_I18N_EN,
	german: LIGHTBOX_I18N_DE,
	polish: LIGHTBOX_I18N_PL,
	czech: LIGHTBOX_I18N_CS,
	slovak: LIGHTBOX_I18N_SK,
	spanish: LIGHTBOX_I18N_ES,
	italian: LIGHTBOX_I18N_IT,
	ukrainian: LIGHTBOX_I18N_UK,
	japanese: LIGHTBOX_I18N_JA,
	hindi: LIGHTBOX_I18N_HI,
	indian: LIGHTBOX_I18N_HI,
	french: LIGHTBOX_I18N_FR,
	portuguese: LIGHTBOX_I18N_PT,
	dutch: LIGHTBOX_I18N_NL,
	swedish: LIGHTBOX_I18N_SV,
	norwegian: LIGHTBOX_I18N_NO,
	danish: LIGHTBOX_I18N_DA,
	finnish: LIGHTBOX_I18N_FI,
	hungarian: LIGHTBOX_I18N_HU,
	greek: LIGHTBOX_I18N_EL,
	romanian: LIGHTBOX_I18N_RO,
	croatian: LIGHTBOX_I18N_HR,
	korean: LIGHTBOX_I18N_KO,
	chinese: LIGHTBOX_I18N_ZH,
	turkish: LIGHTBOX_I18N_TR,
	vietnamese: LIGHTBOX_I18N_VI,
	arabic: LIGHTBOX_I18N_AR,
};

export function resolveLightboxI18n(
	i18n?: TSupportedLightboxLanguage | Partial<IGalleryI18n>,
): IGalleryI18n {
	if (!i18n) {
		return { ...LIGHTBOX_I18N_EN };
	}
	if (typeof i18n === 'string') {
		return { ...(LIGHTBOX_I18N_PRESETS[i18n] ?? LIGHTBOX_I18N_EN) };
	}
	return {
		...LIGHTBOX_I18N_EN,
		...i18n,
	};
}
