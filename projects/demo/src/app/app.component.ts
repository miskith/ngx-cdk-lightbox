import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { HighlightModule } from 'ngx-highlightjs';

import {
	GalleryConfigInterface,
	NgxCdkLightboxService,
} from '../../../ngx-cdk-lightbox/src/public-api';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CommonModule, MatButtonModule, MatTabsModule, MatCardModule, HighlightModule],
})
export class AppComponent {
	readonly config1: Partial<GalleryConfigInterface> = {};
	readonly config2: Partial<GalleryConfigInterface> = { enableZoom: true };
	readonly config3: Partial<GalleryConfigInterface> = { startingIndex: 2, enableAnimations: false };
	readonly config4: Partial<GalleryConfigInterface> = {
		enableArrows: false,
		enableCloseIcon: false,
		enableImageClick: false,
		enableImagePreloading: false,
	};
	readonly config5: Partial<GalleryConfigInterface> = {
		enableZoom: true,
		zoomSize: 3,
		imageCounterText: 'IMAGE_INDEX fotografie z IMAGE_COUNT',
	};
	readonly installCommand: string[] = [
		'npm install ngx-cdk-lightbox --save',
		'yarn add ngx-cdk-lightbox',
	];
	readonly sampleUsage: string[] = [
		"import { NgxCdkLightboxService } from 'ngx-cdk-lightbox';",
		'private readonly lightboxService: NgxCdkLightboxService = inject<NgxCdkLightboxService>(NgxCdkLightboxService);',
		"this.lightboxService.open([\n\t{\n\t\ttype: 'image',\n\t\tsource: 'https://image.shutterstock.com/z/stock-photo-two-beach-chairs-on-tropical-vacation-at-sea-1411290431.jpg',\n\t\tcopyright: 'https://www.shutterstock.com',\n\t},\n]);",
	];

	private readonly lightboxService: NgxCdkLightboxService =
		inject<NgxCdkLightboxService>(NgxCdkLightboxService);

	public openLightbox(config?: Partial<GalleryConfigInterface>): void {
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

	public openMixedLightbox(config?: Partial<GalleryConfigInterface>): void {
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
