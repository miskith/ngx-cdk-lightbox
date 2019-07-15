import { InjectionToken } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';

import { GalleryImageInterface, GalleryConfigInterface } from './../Interfaces/gallery.interface';

export interface GalleryDataInterface
{
	photos: GalleryImageInterface[];
	config: GalleryConfigInterface;
}

export const LIGHTBOX_MODAL_DATA = new InjectionToken<GalleryDataInterface>('LIGHTBOX_MODAL_DATA');

export class LightboxOverlayRef
{
	constructor(private overlayRef: OverlayRef)
	{
	}

	public close():void
	{
		this.overlayRef.dispose();

		return;
	}

}
