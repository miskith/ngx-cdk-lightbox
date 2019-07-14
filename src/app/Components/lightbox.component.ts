import { Component, Inject, HostListener } from '@angular/core';

import { LightboxOverlayRef, LIGHTBOX_MODAL_DATA } from './../Ref/lightboxOverlay.ref';
import { GalleryImageInterface } from './../Interfaces/gallery.interface';

@Component({
	templateUrl: '../Templates/lightbox.component.html',
	styleUrls: [
		'../Styles/lightbox.component.scss',
	],
})
export class LightboxComponent
{
	private currentIndex = 0;

	constructor(
		private modalRef: LightboxOverlayRef,
		@Inject(LIGHTBOX_MODAL_DATA) public data: {photos: GalleryImageInterface[]},
	)
	{
	}

	get photo():GalleryImageInterface
	{
		return this.data.photos[this.currentIndex];
	}

	@HostListener('document:keyup.arrowright', ['$event'])
	nextPhoto(event: KeyboardEvent) {
		event.preventDefault();

		this.currentIndex = Math.min(this.currentIndex+1, this.data.photos.length-1);
	}

	@HostListener('document:keyup.arrowleft', ['$event'])
	prevPhoto(event: KeyboardEvent) {
		event.preventDefault();

		this.currentIndex = Math.max(this.currentIndex-1, 0);
	}

	@HostListener('document:keyup.escape', ['$event'])
	closeModal(event: KeyboardEvent) {
		this.modalRef.close();
	}

}
