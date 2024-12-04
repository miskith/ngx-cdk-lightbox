import { InjectionToken } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';

import { GalleryDisplayObjectType, GalleryConfigInterface } from '../interfaces/gallery.interface';

export interface GalleryDataInterface {
	displayObjects: GalleryDisplayObjectType[];
	config: GalleryConfigInterface;
}
