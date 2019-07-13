import { GalleryImageInterface } from './../Interfaces/gallery.interface';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { LightboxComponent } from './../Components/lightbox.component';

@Injectable()
export class LightboxService
{
	private photos: GalleryImageInterface[] = [];

	constructor(private modalObject: MatDialog)
	{
	}

	public open(photos: GalleryImageInterface[]):void
	{
		this.photos = photos;

		if (this.photos.length<1)
			return;

		const modalRef = this.modalObject.open(LightboxComponent, {
			maxWidth: '95vw',
			maxHeight: '95vh',
			panelClass: 'ngx-cdk-lightbox',
			data: {photos: this.photos},
		});

		// ToDo - save subscription
		modalRef.afterClosed().subscribe(() => {
		});

		return;
	}

}
