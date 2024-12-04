import { inject, Injectable } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { Dialog, DialogRef } from '@angular/cdk/dialog';

import {
	GalleryConfigInterface,
	closeIconSvg,
	arrowRightSvg,
	arrowLeftSvg,
	GalleryDisplayObjectType,
} from '../../interfaces/gallery.interface';
import { LightboxDialogComponent } from '../../components/lightbox-dialog/lightbox-dialog.component';

@Injectable({
	providedIn: 'root',
})
export class NgxCdkLightboxService {
	private defaultConfig: GalleryConfigInterface = {
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
		enableImagePreloading: true,
		startingIndex: 0,
		enableAnimations: true,
		ariaLabelNext: 'Next',
		ariaLabelPrev: 'Previous',
	};

	private readonly overlay: Overlay = inject<Overlay>(Overlay);
	private readonly dialog: Dialog = inject<Dialog>(Dialog);

	public open(
		displayObjects: GalleryDisplayObjectType[],
		config: Partial<GalleryConfigInterface> = {},
	): DialogRef<void, LightboxDialogComponent> | null {
		if (displayObjects.length < 1) {
			return null;
		}

		const positionStrategy = this.overlay
			.position()
			.global()
			.centerHorizontally()
			.centerVertically();

		let dialogRef: DialogRef<void, LightboxDialogComponent>;
		dialogRef = this.dialog.open(LightboxDialogComponent, {
			maxWidth: '95vw',
			maxHeight: '95vh',
			panelClass: 'ngx-cdk-lightbox',
			backdropClass: ['cdk-overlay-dark-backdrop', 'ngx-cdk-lightbox__backdrop'],
			hasBackdrop: true,
			scrollStrategy: this.overlay.scrollStrategies.block(),
			positionStrategy: positionStrategy,
			data: {
				displayObjects,
				config: { ...this.defaultConfig, ...config },
			},
			templateContext: () => ({ dialogRef }),
		});

		return dialogRef;
	}
}
