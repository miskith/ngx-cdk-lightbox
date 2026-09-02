import {
	ChangeDetectionStrategy,
	Component,
	inject,
	signal,
	TemplateRef,
	ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighlightModule } from 'ngx-highlightjs';

import {
	IGalleryConfig,
	IGalleryImage,
	NgxCdkLightboxService,
	TGalleryDisplayObject,
} from '../../../ngx-cdk-lightbox/src/public-api';

type DemoTab =
	'photo-gallery' | 'mixed-gallery' | 'custom-loader' | 'playground' | 'getting-started';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CommonModule, HighlightModule],
})
export class AppComponent {
	@ViewChild('customLoaderTemplate', { static: true })
	readonly customLoaderTemplate!: TemplateRef<unknown>;

	public readonly activeTab = signal<DemoTab>('photo-gallery');

	// Playground configurator state
	public readonly pgEnableZoom = signal<boolean>(true);
	public readonly pgZoomSize = signal<number | 'originalSize'>(2.5);
	public readonly pgLoop = signal<boolean>(true);
	public readonly pgEnableCounter = signal<boolean>(true);
	public readonly pgCounterText = signal<string>('IMAGE_INDEX of IMAGE_COUNT');
	public readonly pgEnableAnimations = signal<boolean>(true);
	public readonly pgEnableArrows = signal<boolean>(true);
	public readonly pgEnableClose = signal<boolean>(true);
	public readonly pgEnableClick = signal<boolean>(true);
	public readonly pgStartingIndex = signal<number>(0);
	public readonly pgPreloading = signal<boolean>(true);

	private readonly lightboxService = inject(NgxCdkLightboxService);

	public readonly demoImages: IGalleryImage[] = [
		{
			type: 'image',
			source:
				'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
			description: 'Tropical Beach with Palm Trees and Turquoise Sea',
			copyright: 'Photo by Sean Oulashin on Unsplash',
		},
		{
			type: 'image',
			source:
				'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1600&q=80',
			description: 'Crystal Clear Ocean Waves and Golden Sandy Coast',
			copyright: 'Photo by Frank McKenna on Unsplash',
		},
		{
			type: 'image',
			source:
				'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1600&q=80',
			description: 'Serene Mountain Lake and Emerald Forest',
			copyright: 'Photo by Luca Bravo on Unsplash',
		},
		{
			type: 'image',
			source: 'assets/images/image1.jpg',
			description: 'Nature Trail Exploration',
			copyright: 'Demo Assets',
		},
		{
			type: 'image',
			source: 'assets/images/image2.jpg',
			description: 'Sunset Horizon View',
			copyright: 'Demo Assets',
		},
		{
			type: 'image',
			source: 'assets/images/image3.jpg',
			description: 'Coastal Architecture and Seashore',
			copyright: 'Demo Assets',
		},
		{
			type: 'image',
			source: 'assets/images/image4.jpg',
			description: 'Scenic Panorama Landscape',
			copyright: 'Demo Assets',
		},
		{
			type: 'image',
			source: 'assets/images/image5.jpg',
			description: 'Quiet Forest Path in Autumn',
			copyright: 'Demo Assets',
		},
	];

	public readonly mixedMedia: TGalleryDisplayObject[] = [
		{
			type: 'video',
			mp4Source: {
				240: 'assets/videos/240p.mp4',
				480: 'assets/videos/480p.mp4',
				720: 'assets/videos/720p.mp4',
			},
			description: 'Adaptive Resolution Video (240p / 480p / 720p)',
			copyright: 'Sample Video Suite',
			resolution: { width: 1280, height: 720 },
		},
		{
			type: 'image',
			source:
				'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
			description: 'Tropical Beach with Palm Trees and Turquoise Sea',
			copyright: 'Photo by Sean Oulashin on Unsplash',
		},
		{
			type: 'video',
			mp4Source: 'assets/videos/720p.mp4',
			description: 'Single MP4 Stream Video (720p HD)',
			copyright: 'Sample Video Suite',
			resolution: { width: 1280, height: 720 },
		},
		{
			type: 'image',
			source:
				'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1600&q=80',
			description: 'Serene Mountain Lake and Emerald Forest',
			copyright: 'Photo by Luca Bravo on Unsplash',
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
			loaderTemplate: this.customLoaderTemplate,
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
        source: 'assets/images/scenic.jpg',
        description: 'Mountain Peak',
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
			enableZoom: this.pgEnableZoom(),
			zoomSize: this.pgZoomSize(),
			loopGallery: this.pgLoop(),
			enableImageCounter: this.pgEnableCounter(),
			imageCounterText: this.pgCounterText(),
			enableAnimations: this.pgEnableAnimations(),
			enableArrows: this.pgEnableArrows(),
			enableCloseIcon: this.pgEnableClose(),
			enableImageClick: this.pgEnableClick(),
			startingIndex: this.pgStartingIndex(),
			enableImagePreloading: this.pgPreloading(),
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
		const val = (event.target as HTMLSelectElement).value;
		if (val === 'originalSize') {
			this.pgZoomSize.set('originalSize');
		} else {
			this.pgZoomSize.set(Number(val));
		}
	}

	public updateStartingIndex(event: Event): void {
		const val = Number((event.target as HTMLInputElement).value);
		this.pgStartingIndex.set(isNaN(val) ? 0 : Math.max(0, val));
	}

	public updateCounterText(event: Event): void {
		this.pgCounterText.set((event.target as HTMLInputElement).value);
	}
}
