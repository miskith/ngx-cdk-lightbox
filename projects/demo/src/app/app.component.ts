import {
	ChangeDetectionStrategy,
	Component,
	inject,
	signal,
	TemplateRef,
	viewChild,
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
			source:
				'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
			description: 'Yosemite Valley with Mist Rolling Across Granite Cliffs',
			copyright: 'Photo by Bailey Zindel on Unsplash',
		},
		{
			type: 'image',
			source:
				'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?auto=format&fit=crop&w=1600&q=80',
			description: 'Dramatic Mountain Silhouette Under Golden Dusk Sky',
			copyright: 'Photo by Florian van Duyn on Unsplash',
		},
		{
			type: 'image',
			source:
				'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1600&q=80',
			description: 'Foggy Forest Landscape with Morning Light Beams',
			copyright: 'Photo by Kalen Emsley on Unsplash',
		},
	];

	public readonly mixedMedia: TGalleryDisplayObject[] = [
		{
			type: 'image',
			source:
				'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
			description: 'Tropical Beach with Palm Trees and Turquoise Sea',
			copyright: 'Photo by Sean Oulashin on Unsplash',
		},
		{
			type: 'video',
			mp4Source: {
				720: 'https://storage.davidmyska.com/ngx-cdk-lightbox/video-720.mp4',
				1080: 'https://storage.davidmyska.com/ngx-cdk-lightbox/video-1080.mp4',
			},
			description: 'Big Buck Bunny (Multi-resolution HD/FHD Video)',
			resolution: { width: 1920, height: 1080 },
			copyright: 'Blender Foundation | Creative Commons',
		},
		{
			type: 'image',
			source:
				'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1600&q=80',
			description: 'Pristine Alpine Lake Reflections',
			copyright: 'Photo by Luca Bravo on Unsplash',
		},
		{
			type: 'video',
			mp4Source: 'https://storage.davidmyska.com/ngx-cdk-lightbox/video-720.mp4',
			description: 'Single-source Streamlined Video',
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
