import { Injectable, Injector } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';

import { GalleryImageInterface, GalleryConfigInterface } from './../Interfaces/gallery.interface';
import { LightboxComponent } from './../Components/lightbox.component';
import { LightboxOverlayRef, LIGHTBOX_MODAL_DATA } from './../Ref/lightboxOverlay.ref';

@Injectable()
export class LightboxService
{
	private photos: GalleryImageInterface[] = [];
	private defaultConfig: GalleryConfigInterface = {
		enableZoom: false,
		zoomSize: 'originalSize',
		enableImageClick: true,
		loopGallery: true,
		enableImageCounter: true,
		imageCounterText: 'IMAGE_INDEX photo of IMAGE_COUNT',
	};

	constructor(
		private overlay: Overlay,
		private injector: Injector,
	)
	{
	}

	public open(photos: GalleryImageInterface[], config: GalleryConfigInterface = {}):void
	{
		this.photos = photos;
		config = {...this.defaultConfig, ...config};

		if (this.photos.length<1)
			return;

		const overlayRef = this.createOverlayRef();
		const modalRef = new LightboxOverlayRef(overlayRef);
		const injector = this.getModalInjector(modalRef, config);
		// ToDo - save subscription
		overlayRef.backdropClick().subscribe(() => {
			modalRef.close();
		});
		const lightboxPortal = new ComponentPortal(LightboxComponent, null, injector);
		overlayRef.attach(lightboxPortal);

		// ToDo - save subscription
		/*modalRef.afterClosed().subscribe(() => {
		});*/

		return;
	}

	private createOverlayRef():OverlayRef
	{
		const positionStrategy = this.overlay.position().global().centerHorizontally().centerVertically();

		const overlayRef = this.overlay.create({
			maxWidth: '95vw',
			maxHeight: '95vh',
			panelClass: 'ngx-cdk-lightbox',
			backdropClass: ['cdk-overlay-dark-backdrop', 'ngx-cdk-lightbox__backdrop'],
			hasBackdrop: true,
			scrollStrategy: this.overlay.scrollStrategies.block(),
			positionStrategy,
		});

		return overlayRef;
	}

	private getModalInjector(modalRef: LightboxOverlayRef, config: GalleryConfigInterface):PortalInjector
	{
		const injectionTokens = new WeakMap();

		injectionTokens.set(LightboxOverlayRef, modalRef);
		injectionTokens.set(LIGHTBOX_MODAL_DATA, {photos: this.photos, config: config});

		return new PortalInjector(this.injector, injectionTokens);
	}

}
