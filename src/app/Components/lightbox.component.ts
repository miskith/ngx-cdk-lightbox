import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, HostListener } from '@angular/core';

import { GalleryImageInterface } from './../Interfaces/gallery.interface';
import { LightboxService } from './../Services/lightbox.service';

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
		private modalRef: MatDialogRef<LightboxService>,
		@Inject(MAT_DIALOG_DATA) private data: {photos: GalleryImageInterface[]},
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

}
