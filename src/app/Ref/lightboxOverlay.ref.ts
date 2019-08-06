import { InjectionToken } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';

import { GalleryDisplayObjectType, GalleryConfigInterface } from './../Interfaces/gallery.interface';

export interface GalleryDataInterface
{
	displayObjects: GalleryDisplayObjectType[];
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
