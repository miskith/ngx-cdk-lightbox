import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { HighlightModule } from 'ngx-highlightjs';

import {
	GalleryConfigInterface,
	NgxCdkLightboxService,
	NgxCdkLightboxModule,
} from '../../../ngx-cdk-lightbox/src/public-api';

@Component({
	standalone: true,
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CommonModule,
		NgxCdkLightboxModule,
		MatButtonModule,
		MatTabsModule,
		MatCardModule,
		HighlightModule,
	],
})
export class AppComponent {
	public config1: GalleryConfigInterface = {};
	public config2: GalleryConfigInterface = { enableZoom: true };
	public config3: GalleryConfigInterface = { startingIndex: 2, enableAnimations: false };
	public config4: GalleryConfigInterface = {
		enableArrows: false,
		enableCloseIcon: false,
		enableImageClick: false,
		enableImagePreloading: false,
	};
	public config5: GalleryConfigInterface = {
		enableZoom: true,
		zoomSize: 3,
		imageCounterText: 'IMAGE_INDEX fotografie z IMAGE_COUNT',
	};

	constructor(private readonly lightboxService: NgxCdkLightboxService) {}

	public openLightbox(config?: GalleryConfigInterface): void {
		this.lightboxService.open(
			[
				{
					type: 'image',
					source:
						'https://image.shutterstock.com/z/stock-photo-two-beach-chairs-on-tropical-vacation-at-sea-1411290431.jpg',
					copyright: 'https://www.shutterstock.com',
				},
				{
					type: 'image',
					source:
						'https://image.shutterstock.com/z/stock-photo-soft-waves-with-foam-of-ocean-on-the-sandy-beach-background-1383401564.jpg',
					description: 'beach',
					copyright: 'https://www.shutterstock.com',
				},
				{
					type: 'image',
					source:
						'https://gallery.yopriceville.com/var/albums/Backgrounds/Background_Sea_Beach.jpg?m=1432232957',
					description: 'One huge image O.o',
					copyright: 'https://gallery.yopriceville.com/Backgrounds/Background_Sea_Beach',
				},
				{ type: 'image', source: 'assets/images/image1.jpg', copyright: 'unknown' },
				{
					type: 'image',
					source: 'assets/images/image2.jpg',
					description: 'test',
					copyright: 'unknown',
				},
				{
					type: 'image',
					source: 'assets/images/image3.jpg',
					description: 'test 2',
					copyright: 'unknown',
				},
				{
					type: 'image',
					source: 'assets/images/image4.jpg',
					description: 'test 3',
					copyright: 'unknown',
				},
				{ type: 'image', source: 'assets/images/image5.jpg', copyright: 'unknown' },
			],
			config,
		);
	}

	public openMixedLightbox(config?: GalleryConfigInterface): void {
		this.lightboxService.open(
			[
				{
					type: 'video',
					mp4Source: 'assets/videos/720p.mp4',
					description: 'test',
					copyright: 'unknown',
				},
				{
					type: 'video',
					mp4Source: {
						240: 'assets/videos/240p.mp4',
						480: 'assets/videos/480p.mp4',
						720: 'assets/videos/720p.mp4',
					},
					description: 'test',
					copyright: 'unknown',
					resolution: { width: 1920, height: 1080 },
				},
				{
					type: 'image',
					source:
						'https://image.shutterstock.com/z/stock-photo-two-beach-chairs-on-tropical-vacation-at-sea-1411290431.jpg',
					copyright: 'https://www.shutterstock.com',
				},
				{
					type: 'image',
					source:
						'https://image.shutterstock.com/z/stock-photo-soft-waves-with-foam-of-ocean-on-the-sandy-beach-background-1383401564.jpg',
					description: 'beach',
					copyright: 'https://www.shutterstock.com',
				},
				{
					type: 'image',
					source:
						'https://gallery.yopriceville.com/var/albums/Backgrounds/Background_Sea_Beach.jpg?m=1432232957',
					description: 'One huge image O.o',
					copyright: 'https://gallery.yopriceville.com/Backgrounds/Background_Sea_Beach',
				},
			],
			config,
		);
	}
}
