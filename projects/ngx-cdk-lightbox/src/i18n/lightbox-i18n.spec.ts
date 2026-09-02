import { describe, expect, it } from 'vitest';

import {
	LIGHTBOX_I18N_AR,
	LIGHTBOX_I18N_ARABIC,
	LIGHTBOX_I18N_CHINESE,
	LIGHTBOX_I18N_CROATIAN,
	LIGHTBOX_I18N_CS,
	LIGHTBOX_I18N_CZECH,
	LIGHTBOX_I18N_DA,
	LIGHTBOX_I18N_DANISH,
	LIGHTBOX_I18N_DE,
	LIGHTBOX_I18N_DUTCH,
	LIGHTBOX_I18N_EL,
	LIGHTBOX_I18N_EN,
	LIGHTBOX_I18N_ENGLISH,
	LIGHTBOX_I18N_ES,
	LIGHTBOX_I18N_FI,
	LIGHTBOX_I18N_FINNISH,
	LIGHTBOX_I18N_FR,
	LIGHTBOX_I18N_FRENCH,
	LIGHTBOX_I18N_GERMAN,
	LIGHTBOX_I18N_GREEK,
	LIGHTBOX_I18N_HI,
	LIGHTBOX_I18N_HINDI,
	LIGHTBOX_I18N_HR,
	LIGHTBOX_I18N_HU,
	LIGHTBOX_I18N_HUNGARIAN,
	LIGHTBOX_I18N_INDIAN,
	LIGHTBOX_I18N_IT,
	LIGHTBOX_I18N_ITALIAN,
	LIGHTBOX_I18N_JA,
	LIGHTBOX_I18N_JAPANESE,
	LIGHTBOX_I18N_KO,
	LIGHTBOX_I18N_KOREAN,
	LIGHTBOX_I18N_NL,
	LIGHTBOX_I18N_NO,
	LIGHTBOX_I18N_NORWEGIAN,
	LIGHTBOX_I18N_PL,
	LIGHTBOX_I18N_POLISH,
	LIGHTBOX_I18N_PORTUGUESE,
	LIGHTBOX_I18N_PT,
	LIGHTBOX_I18N_RO,
	LIGHTBOX_I18N_ROMANIAN,
	LIGHTBOX_I18N_SK,
	LIGHTBOX_I18N_SLOVAK,
	LIGHTBOX_I18N_SPANISH,
	LIGHTBOX_I18N_SV,
	LIGHTBOX_I18N_SWEDISH,
	LIGHTBOX_I18N_TR,
	LIGHTBOX_I18N_TURKISH,
	LIGHTBOX_I18N_UK,
	LIGHTBOX_I18N_UKRAINIAN,
	LIGHTBOX_I18N_VI,
	LIGHTBOX_I18N_VIETNAMESE,
	LIGHTBOX_I18N_ZH,
	resolveLightboxI18n,
} from './lightbox-i18n';

describe('Lightbox i18n translations', () => {
	it('should provide complete English translations', () => {
		expect(LIGHTBOX_I18N_EN.next).toBe('Next');
		expect(LIGHTBOX_I18N_EN.previous).toBe('Previous');
		expect(LIGHTBOX_I18N_EN.close).toBe('Close');
		expect(LIGHTBOX_I18N_EN.loading).toBe('Loading gallery media...');
		expect(LIGHTBOX_I18N_EN.gallery).toBe('Media Lightbox Gallery');
		expect(LIGHTBOX_I18N_EN.counter).toBe('IMAGE_INDEX photo of IMAGE_COUNT');
		expect(LIGHTBOX_I18N_ENGLISH).toEqual(LIGHTBOX_I18N_EN);
	});

	it('should provide complete German translations', () => {
		expect(LIGHTBOX_I18N_DE.next).toBe('Weiter');
		expect(LIGHTBOX_I18N_DE.previous).toBe('Zurück');
		expect(LIGHTBOX_I18N_DE.close).toBe('Schließen');
		expect(LIGHTBOX_I18N_GERMAN).toEqual(LIGHTBOX_I18N_DE);
	});

	it('should provide complete Polish translations', () => {
		expect(LIGHTBOX_I18N_PL.next).toBe('Dalej');
		expect(LIGHTBOX_I18N_PL.previous).toBe('Wstecz');
		expect(LIGHTBOX_I18N_PL.close).toBe('Zamknij');
		expect(LIGHTBOX_I18N_POLISH).toEqual(LIGHTBOX_I18N_PL);
	});

	it('should provide complete Czech translations', () => {
		expect(LIGHTBOX_I18N_CS.next).toBe('Další');
		expect(LIGHTBOX_I18N_CS.previous).toBe('Předchozí');
		expect(LIGHTBOX_I18N_CS.close).toBe('Zavřít');
		expect(LIGHTBOX_I18N_CZECH).toEqual(LIGHTBOX_I18N_CS);
	});

	it('should provide complete Slovak translations', () => {
		expect(LIGHTBOX_I18N_SK.next).toBe('Ďalej');
		expect(LIGHTBOX_I18N_SK.previous).toBe('Späť');
		expect(LIGHTBOX_I18N_SK.close).toBe('Zavrieť');
		expect(LIGHTBOX_I18N_SLOVAK).toEqual(LIGHTBOX_I18N_SK);
	});

	it('should provide complete Spanish translations', () => {
		expect(LIGHTBOX_I18N_ES.next).toBe('Siguiente');
		expect(LIGHTBOX_I18N_ES.previous).toBe('Anterior');
		expect(LIGHTBOX_I18N_ES.close).toBe('Cerrar');
		expect(LIGHTBOX_I18N_SPANISH).toEqual(LIGHTBOX_I18N_ES);
	});

	it('should provide complete Italian translations', () => {
		expect(LIGHTBOX_I18N_IT.next).toBe('Avanti');
		expect(LIGHTBOX_I18N_IT.previous).toBe('Indietro');
		expect(LIGHTBOX_I18N_IT.close).toBe('Chiudi');
		expect(LIGHTBOX_I18N_ITALIAN).toEqual(LIGHTBOX_I18N_IT);
	});

	it('should provide complete Ukrainian translations', () => {
		expect(LIGHTBOX_I18N_UK.next).toBe('Далі');
		expect(LIGHTBOX_I18N_UK.previous).toBe('Назад');
		expect(LIGHTBOX_I18N_UK.close).toBe('Закрити');
		expect(LIGHTBOX_I18N_UKRAINIAN).toEqual(LIGHTBOX_I18N_UK);
	});

	it('should provide complete Japanese translations', () => {
		expect(LIGHTBOX_I18N_JA.next).toBe('次へ');
		expect(LIGHTBOX_I18N_JA.previous).toBe('前へ');
		expect(LIGHTBOX_I18N_JA.close).toBe('閉じる');
		expect(LIGHTBOX_I18N_JAPANESE).toEqual(LIGHTBOX_I18N_JA);
	});

	it('should provide complete Hindi/Indian translations', () => {
		expect(LIGHTBOX_I18N_HI.next).toBe('अगला');
		expect(LIGHTBOX_I18N_HI.previous).toBe('पिछला');
		expect(LIGHTBOX_I18N_HI.close).toBe('बंद करें');
		expect(LIGHTBOX_I18N_HINDI).toEqual(LIGHTBOX_I18N_HI);
		expect(LIGHTBOX_I18N_INDIAN).toEqual(LIGHTBOX_I18N_HI);
	});

	it('should provide complete French translations', () => {
		expect(LIGHTBOX_I18N_FR.next).toBe('Suivant');
		expect(LIGHTBOX_I18N_FR.previous).toBe('Précédent');
		expect(LIGHTBOX_I18N_FR.close).toBe('Fermer');
		expect(LIGHTBOX_I18N_FRENCH).toEqual(LIGHTBOX_I18N_FR);
	});

	it('should provide complete Portuguese translations', () => {
		expect(LIGHTBOX_I18N_PT.next).toBe('Próximo');
		expect(LIGHTBOX_I18N_PT.previous).toBe('Anterior');
		expect(LIGHTBOX_I18N_PT.close).toBe('Fechar');
		expect(LIGHTBOX_I18N_PORTUGUESE).toEqual(LIGHTBOX_I18N_PT);
	});

	it('should provide complete Dutch translations', () => {
		expect(LIGHTBOX_I18N_NL.next).toBe('Volgende');
		expect(LIGHTBOX_I18N_NL.previous).toBe('Vorige');
		expect(LIGHTBOX_I18N_NL.close).toBe('Sluiten');
		expect(LIGHTBOX_I18N_DUTCH).toEqual(LIGHTBOX_I18N_NL);
	});

	it('should provide complete Swedish translations', () => {
		expect(LIGHTBOX_I18N_SV.next).toBe('Nästa');
		expect(LIGHTBOX_I18N_SV.previous).toBe('Föregående');
		expect(LIGHTBOX_I18N_SV.close).toBe('Stäng');
		expect(LIGHTBOX_I18N_SWEDISH).toEqual(LIGHTBOX_I18N_SV);
	});

	it('should provide complete Norwegian translations', () => {
		expect(LIGHTBOX_I18N_NO.next).toBe('Neste');
		expect(LIGHTBOX_I18N_NO.previous).toBe('Forrige');
		expect(LIGHTBOX_I18N_NO.close).toBe('Lukk');
		expect(LIGHTBOX_I18N_NORWEGIAN).toEqual(LIGHTBOX_I18N_NO);
	});

	it('should provide complete Danish translations', () => {
		expect(LIGHTBOX_I18N_DA.next).toBe('Næste');
		expect(LIGHTBOX_I18N_DA.previous).toBe('Forrige');
		expect(LIGHTBOX_I18N_DA.close).toBe('Luk');
		expect(LIGHTBOX_I18N_DANISH).toEqual(LIGHTBOX_I18N_DA);
	});

	it('should provide complete Finnish translations', () => {
		expect(LIGHTBOX_I18N_FI.next).toBe('Seuraava');
		expect(LIGHTBOX_I18N_FI.previous).toBe('Edellinen');
		expect(LIGHTBOX_I18N_FI.close).toBe('Sulje');
		expect(LIGHTBOX_I18N_FINNISH).toEqual(LIGHTBOX_I18N_FI);
	});

	it('should provide complete Hungarian translations', () => {
		expect(LIGHTBOX_I18N_HU.next).toBe('Következő');
		expect(LIGHTBOX_I18N_HU.previous).toBe('Előző');
		expect(LIGHTBOX_I18N_HU.close).toBe('Bezárás');
		expect(LIGHTBOX_I18N_HUNGARIAN).toEqual(LIGHTBOX_I18N_HU);
	});

	it('should provide complete Greek translations', () => {
		expect(LIGHTBOX_I18N_EL.next).toBe('Επόμενο');
		expect(LIGHTBOX_I18N_EL.previous).toBe('Προηγούμενο');
		expect(LIGHTBOX_I18N_EL.close).toBe('Κλείσιμο');
		expect(LIGHTBOX_I18N_GREEK).toEqual(LIGHTBOX_I18N_EL);
	});

	it('should provide complete Romanian translations', () => {
		expect(LIGHTBOX_I18N_RO.next).toBe('Următorul');
		expect(LIGHTBOX_I18N_RO.previous).toBe('Anteriorul');
		expect(LIGHTBOX_I18N_RO.close).toBe('Închide');
		expect(LIGHTBOX_I18N_ROMANIAN).toEqual(LIGHTBOX_I18N_RO);
	});

	it('should provide complete Croatian translations', () => {
		expect(LIGHTBOX_I18N_HR.next).toBe('Sljedeće');
		expect(LIGHTBOX_I18N_HR.previous).toBe('Prethodno');
		expect(LIGHTBOX_I18N_HR.close).toBe('Zatvori');
		expect(LIGHTBOX_I18N_CROATIAN).toEqual(LIGHTBOX_I18N_HR);
	});

	it('should provide complete Korean translations', () => {
		expect(LIGHTBOX_I18N_KO.next).toBe('다음');
		expect(LIGHTBOX_I18N_KO.previous).toBe('이전');
		expect(LIGHTBOX_I18N_KO.close).toBe('닫기');
		expect(LIGHTBOX_I18N_KOREAN).toEqual(LIGHTBOX_I18N_KO);
	});

	it('should provide complete Chinese translations', () => {
		expect(LIGHTBOX_I18N_ZH.next).toBe('下一张');
		expect(LIGHTBOX_I18N_ZH.previous).toBe('上一张');
		expect(LIGHTBOX_I18N_ZH.close).toBe('关闭');
		expect(LIGHTBOX_I18N_CHINESE).toEqual(LIGHTBOX_I18N_ZH);
	});

	it('should provide complete Turkish translations', () => {
		expect(LIGHTBOX_I18N_TR.next).toBe('Sonraki');
		expect(LIGHTBOX_I18N_TR.previous).toBe('Önceki');
		expect(LIGHTBOX_I18N_TR.close).toBe('Kapat');
		expect(LIGHTBOX_I18N_TURKISH).toEqual(LIGHTBOX_I18N_TR);
	});

	it('should provide complete Vietnamese translations', () => {
		expect(LIGHTBOX_I18N_VI.next).toBe('Tiếp theo');
		expect(LIGHTBOX_I18N_VI.previous).toBe('Trước đó');
		expect(LIGHTBOX_I18N_VI.close).toBe('Đóng');
		expect(LIGHTBOX_I18N_VIETNAMESE).toEqual(LIGHTBOX_I18N_VI);
	});

	it('should provide complete Arabic translations', () => {
		expect(LIGHTBOX_I18N_AR.next).toBe('التالي');
		expect(LIGHTBOX_I18N_AR.previous).toBe('السابق');
		expect(LIGHTBOX_I18N_AR.close).toBe('إغلاق');
		expect(LIGHTBOX_I18N_ARABIC).toEqual(LIGHTBOX_I18N_AR);
	});

	it('should resolve translations by language code or custom overrides', () => {
		const resolvedGerman = resolveLightboxI18n('de');
		expect(resolvedGerman.close).toBe('Schließen');

		const resolvedFrench = resolveLightboxI18n('fr');
		expect(resolvedFrench.close).toBe('Fermer');

		const resolvedCustom = resolveLightboxI18n({ close: 'Fermer' });
		expect(resolvedCustom.close).toBe('Fermer');
		expect(resolvedCustom.next).toBe('Next');

		const fallback = resolveLightboxI18n('invalid' as any);
		expect(fallback.next).toBe('Next');
	});
});
