import { InjectionToken } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';

import { GalleryImageInterface } from './../Interfaces/gallery.interface';

export const LIGHTBOX_MODAL_DATA = new InjectionToken<{photos: GalleryImageInterface[]}>('LIGHTBOX_MODAL_DATA');

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
