import { Injectable, inject } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { Dialog, type DialogRef } from '@angular/cdk/dialog';

import {
	type IGalleryConfig,
	type TGalleryDisplayObject,
	arrowLeftSvg,
	arrowRightSvg,
	closeIconSvg,
} from '../../interfaces/gallery.interface';
import { LightboxDialogComponent } from '../../components/lightbox-dialog/lightbox-dialog.component';

const DEFAULT_GALLERY_CONFIG: IGalleryConfig = {
	enableZoom: false,
	zoomSize: 'originalSize',
	enableImageClick: true,
	loopGallery: true,
	enableImageCounter: true,
	imageCounterText: 'IMAGE_INDEX photo of IMAGE_COUNT',
	enableCloseIcon: true,
	closeIcon: closeIconSvg,
	enableArrows: true,
	arrowRight: arrowRightSvg,
	arrowLeft: arrowLeftSvg,
	loaderTemplate: null,
	enableImagePreloading: true,
	startingIndex: 0,
	enableAnimations: true,
	ariaLabelNext: 'Next',
	ariaLabelPrev: 'Previous',
	ariaLabelClose: 'Close',
};

@Injectable({
	providedIn: 'root',
})
export class NgxCdkLightboxService {
	private readonly overlay: Overlay = inject<Overlay>(Overlay);
	private readonly dialog: Dialog = inject<Dialog>(Dialog);

	public open(
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

		const dialogRef: DialogRef<void, LightboxDialogComponent> = this.dialog.open(
			LightboxDialogComponent,
			{
				maxWidth: '95vw',
				maxHeight: '95vh',
				hasBackdrop: true,
				scrollStrategy: this.overlay.scrollStrategies.block(),
				positionStrategy,
				data: {
					displayObjects,
					config: { ...DEFAULT_GALLERY_CONFIG, ...config },
				},
				templateContext: () => ({ dialogRef }),
			},
		);

		return dialogRef;
	}
}
