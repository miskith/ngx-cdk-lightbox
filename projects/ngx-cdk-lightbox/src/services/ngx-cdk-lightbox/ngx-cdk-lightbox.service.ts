import { Injectable, InjectionToken, type Provider, inject } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { Dialog, type DialogRef } from '@angular/cdk/dialog';

import {
	type IGalleryConfig,
	type TGalleryDisplayObject,
	arrowLeftSvg,
	arrowRightSvg,
	closeIconSvg,
} from '../../interfaces/gallery.interface';
import { type IGalleryI18n, type TSupportedLightboxLanguage } from '../../i18n/lightbox-i18n';
import { LightboxDialogComponent } from '../../components/lightbox-dialog/lightbox-dialog.component';

export const LIGHTBOX_DEFAULT_CONFIG = new InjectionToken<Partial<IGalleryConfig>>(
	'LIGHTBOX_DEFAULT_CONFIG',
);

export function provideLightboxConfig(config: Partial<IGalleryConfig>): Provider {
	return {
		provide: LIGHTBOX_DEFAULT_CONFIG,
		useValue: config,
	};
}

export function provideLightboxI18n(
	i18nOrLanguage: TSupportedLightboxLanguage | Partial<IGalleryI18n>,
): Provider {
	return provideLightboxConfig({
		i18n: i18nOrLanguage,
	});
}

const DEFAULT_GALLERY_CONFIG: IGalleryConfig = {
	enableZoom: false,
	zoomSize: 'originalSize',
	enableImageClick: true,
	loopGallery: true,
	enableImageCounter: true,
	enableCloseIcon: true,
	closeIcon: closeIconSvg,
	enableArrows: true,
	arrowRight: arrowRightSvg,
	arrowLeft: arrowLeftSvg,
	loaderTemplate: null,
	enableImagePreloading: true,
	startingIndex: 0,
	enableAnimations: true,
	i18n: 'en',
};

@Injectable({
	providedIn: 'root',
})
export class NgxCdkLightboxService {
	private readonly overlay: Overlay = inject<Overlay>(Overlay);
	private readonly dialog: Dialog = inject<Dialog>(Dialog);
	private readonly userConfig: Partial<IGalleryConfig> | null = inject(LIGHTBOX_DEFAULT_CONFIG, {
		optional: true,
	});

	open(
		displayObjects: TGalleryDisplayObject[],
		config: Partial<IGalleryConfig> = {},
	): DialogRef<void, LightboxDialogComponent> | null {
		if (displayObjects.length === 0) {
			return null;
		}

		const positionStrategy = this.overlay
			.position()
			.global()
			.centerHorizontally()
			.centerVertically();

		const userI18n = this.userConfig?.i18n;
		const callI18n = config.i18n;
		const mergedI18n: TSupportedLightboxLanguage | Partial<IGalleryI18n> =
			callI18n !== undefined ? callI18n : userI18n !== undefined ? userI18n : 'en';

		const mergedConfig: IGalleryConfig = {
			...DEFAULT_GALLERY_CONFIG,
			...this.userConfig,
			...config,
			i18n: mergedI18n,
		};

		const dialogRef: DialogRef<void, LightboxDialogComponent> = this.dialog.open(
			LightboxDialogComponent,
			{
				maxWidth: '95vw',
				maxHeight: '95vh',
				hasBackdrop: true,
				scrollStrategy: this.overlay.scrollStrategies.block(),
				positionStrategy,
				panelClass: mergedConfig.panelClass,
				data: {
					displayObjects,
					config: mergedConfig,
				},
				templateContext: () => ({ dialogRef }),
			},
		);

		return dialogRef;
	}
}
