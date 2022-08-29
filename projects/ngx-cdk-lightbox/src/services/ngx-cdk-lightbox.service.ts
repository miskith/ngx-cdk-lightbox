import { Injectable, Injector } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';

import {
	GalleryConfigInterface,
	closeIconSvg,
	arrowRightSvg,
	arrowLeftSvg,
	GalleryDisplayObjectType,
} from '../interfaces/gallery.interface';
import { NgxCdkLightboxComponent } from '../components/ngx-cdk-lightbox.component';
import { LightboxOverlayRef, LIGHTBOX_MODAL_DATA } from '../ref/lightboxOverlay.ref';

@Injectable({
	providedIn: 'root',
})
export class NgxCdkLightboxService {
	private displayObjects: GalleryDisplayObjectType[] = [];
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

	constructor(private readonly overlay: Overlay, private readonly injector: Injector) {}

	public open(
		displayObjects: GalleryDisplayObjectType[],
		config: GalleryConfigInterface = {},
	): void {
		this.displayObjects = displayObjects;
		config = { ...this.defaultConfig, ...config };

		if (this.displayObjects.length < 1) {
			return;
		}

		const overlayRef = this.createOverlayRef();
		const modalRef = new LightboxOverlayRef(overlayRef);
		const injector = this.getModalInjector(modalRef, config);
		const backdropClickSubscription = overlayRef.backdropClick().subscribe(() => {
			modalRef.close();
			backdropClickSubscription.unsubscribe();
		});
		const lightboxPortal = new ComponentPortal(NgxCdkLightboxComponent, null, injector);
		overlayRef.attach(lightboxPortal);
	}

	private createOverlayRef(): OverlayRef {
		const positionStrategy = this.overlay
			.position()
			.global()
			.centerHorizontally()
			.centerVertically();

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

	private getModalInjector(
		modalRef: LightboxOverlayRef,
		config: GalleryConfigInterface,
	): PortalInjector {
		const injectionTokens = new WeakMap();

		injectionTokens.set(LightboxOverlayRef, modalRef);
		injectionTokens.set(LIGHTBOX_MODAL_DATA, { displayObjects: this.displayObjects, config });

		return new PortalInjector(this.injector, injectionTokens);
	}
}
