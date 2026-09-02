import {
	ChangeDetectionStrategy,
	Component,
	type TemplateRef,
	inject,
	signal,
	viewChild,
} from '@angular/core';
import { JsonPipe } from '@angular/common';
import { HighlightModule } from 'ngx-highlightjs';

import {
	type IGalleryConfig,
	type IGalleryImage,
	NgxCdkLightboxService,
	type TGalleryDisplayObject,
} from '../../../ngx-cdk-lightbox/src/public-api';

type DemoTab =
	'photo-gallery' | 'mixed-gallery' | 'custom-loader' | 'playground' | 'getting-started';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [JsonPipe, HighlightModule],
})
export class AppComponent {
	readonly customLoaderTemplate = viewChild<TemplateRef<unknown>>('customLoaderTemplate');

	public readonly activeTab = signal<DemoTab>('photo-gallery');

	public readonly playgroundEnableZoom = signal<boolean>(true);
	public readonly playgroundZoomSize = signal<number | 'originalSize'>(2.5);
	public readonly playgroundLoop = signal<boolean>(true);
	public readonly playgroundEnableCounter = signal<boolean>(true);
	public readonly playgroundCounterText = signal<string>('IMAGE_INDEX of IMAGE_COUNT');
	public readonly playgroundEnableAnimations = signal<boolean>(true);
	public readonly playgroundEnableArrows = signal<boolean>(true);
	public readonly playgroundEnableClose = signal<boolean>(true);
	public readonly playgroundEnableClick = signal<boolean>(true);
	public readonly playgroundStartingIndex = signal<number>(0);
	public readonly playgroundPreloading = signal<boolean>(true);

	private readonly lightboxService = inject(NgxCdkLightboxService);

	public readonly demoImages: IGalleryImage[] = [
		{
			type: 'image',
			source: 'assets/images/image1.jpg',
			description: 'Alpine Lake & Snowy Peaks (16:9 Widescreen Landscape)',
			copyright: 'AI Generated Landscape',
		},
		{
			type: 'image',
			source: 'assets/images/image2.jpg',
			description: 'Mossy Forest Waterfall (3:4 Vertical Portrait)',
			copyright: 'AI Generated Nature',
		},
		{
			type: 'image',
			source: 'assets/images/image3.jpg',
			description: 'Modern Minimalist Villa with Pool (1:1 Square Architecture)',
			copyright: 'AI Generated Architecture',
		},
		{
			type: 'image',
			source: 'assets/images/image4.jpg',
			description: 'Rainy Cyberpunk Metropolis (9:16 Ultra-Tall Portrait)',
			copyright: 'AI Generated Cyberpunk',
		},
		{
			type: 'image',
			source: 'assets/images/image5.jpg',
			description: 'Sahara Desert Sunset Dunes (4:3 Classic Landscape)',
			copyright: 'AI Generated Nature',
		},
	];

	public readonly mixedMedia: TGalleryDisplayObject[] = [
		{
			type: 'image',
			source: 'assets/images/image1.jpg',
			description: 'Alpine Lake & Snowy Peaks (16:9 Landscape)',
			copyright: 'AI Generated Landscape',
		},
		{
			type: 'video',
			mp4Source: {
				240: 'assets/videos/240p.mp4',
				480: 'assets/videos/480p.mp4',
				720: 'assets/videos/720p.mp4',
			},
			description: 'Big Buck Bunny (Multi-resolution 240p / 480p / 720p)',
			resolution: { width: 1280, height: 720 },
			copyright: 'Blender Foundation | Creative Commons',
		},
		{
			type: 'image',
			source: 'assets/images/image4.jpg',
			description: 'Cyberpunk Neon Street (9:16 Tall Portrait)',
			copyright: 'AI Generated Cyberpunk',
		},
		{
			type: 'video',
			mp4Source: 'assets/videos/720p.mp4',
			description: 'Single-source 720p Video',
			resolution: { width: 1280, height: 720 },
			copyright: 'Blender Foundation',
		},
	];

	public readonly configDefault: Partial<IGalleryConfig> = {
		loopGallery: true,
		enableImageCounter: true,
		enableAnimations: true,
	};

	public readonly configZoom: Partial<IGalleryConfig> = {
		enableZoom: true,
		zoomSize: 2.5,
		loopGallery: true,
	};

	public readonly configMinimal: Partial<IGalleryConfig> = {
		enableArrows: false,
		enableCloseIcon: false,
		enableImageClick: true,
		enableImagePreloading: false,
	};

	public readonly configCustomLocalized: Partial<IGalleryConfig> = {
		enableZoom: true,
		zoomSize: 'originalSize',
		imageCounterText: 'PHOTO [IMAGE_INDEX] OF [IMAGE_COUNT]',
		ariaLabelNext: 'Next picture',
		ariaLabelPrev: 'Previous picture',
		startingIndex: 1,
	};

	public get configCustomLoader(): Partial<IGalleryConfig> {
		return {
			startingIndex: 2,
			enableAnimations: false,
			loaderTemplate: this.customLoaderTemplate() ?? null,
		};
	}

	public readonly installNpm =
		'pnpm add ngx-cdk-lightbox\n# or: npm install ngx-cdk-lightbox --save\n# or: yarn add ngx-cdk-lightbox';

	public readonly usageService = `import { Component, inject } from '@angular/core';
import { NgxCdkLightboxService } from 'ngx-cdk-lightbox';

@Component({
  selector: 'app-gallery',
  template: \`<button (click)="openGallery()">Open Lightbox</button>\`,
})
export class GalleryComponent {
  private readonly lightbox = inject(NgxCdkLightboxService);

  public openGallery(): void {
    this.lightbox.open([
      {
        type: 'image',
        source: 'assets/images/image1.jpg',
        description: 'Alpine Lake & Mountain Peaks',
        copyright: '© 2026 Photographer',
      },
    ], {
      enableZoom: true,
      loopGallery: true,
    });
  }
}`;

	public get playgroundConfig(): Partial<IGalleryConfig> {
		return {
			enableZoom: this.playgroundEnableZoom(),
			zoomSize: this.playgroundZoomSize(),
			loopGallery: this.playgroundLoop(),
			enableImageCounter: this.playgroundEnableCounter(),
			imageCounterText: this.playgroundCounterText(),
			enableAnimations: this.playgroundEnableAnimations(),
			enableArrows: this.playgroundEnableArrows(),
			enableCloseIcon: this.playgroundEnableClose(),
			enableImageClick: this.playgroundEnableClick(),
			startingIndex: this.playgroundStartingIndex(),
			enableImagePreloading: this.playgroundPreloading(),
		};
	}

	public get playgroundJson(): string {
		return JSON.stringify(this.playgroundConfig, null, 2);
	}

	public selectTab(tab: DemoTab): void {
		this.activeTab.set(tab);
	}

	public openGallery(
		items: TGalleryDisplayObject[] = this.demoImages,
		config?: Partial<IGalleryConfig>,
		startIndex?: number,
	): void {
		const finalConfig =
			startIndex !== undefined ? { ...config, startingIndex: startIndex } : config;
		this.lightboxService.open(items, finalConfig);
	}

	public launchPlayground(): void {
		this.openGallery(this.demoImages, this.playgroundConfig);
	}

	public updateZoomSize(event: Event): void {
		const selectElement = event.target as HTMLSelectElement;
		const selectedValue = selectElement.value;
		if (selectedValue === 'originalSize') {
			this.playgroundZoomSize.set('originalSize');
		} else {
			this.playgroundZoomSize.set(Number(selectedValue));
		}
	}

	public updateStartingIndex(event: Event): void {
		const inputElement = event.target as HTMLInputElement;
		const parsedIndex = Number(inputElement.value);
		this.playgroundStartingIndex.set(isNaN(parsedIndex) ? 0 : Math.max(0, parsedIndex));
	}

	public updateCounterText(event: Event): void {
		const inputElement = event.target as HTMLInputElement;
		this.playgroundCounterText.set(inputElement.value);
	}
}
