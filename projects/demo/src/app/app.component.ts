import {
	ChangeDetectionStrategy,
	Component,
	type OnInit,
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
export class AppComponent implements OnInit {
	readonly customLoaderTemplate = viewChild<TemplateRef<unknown>>('customLoaderTemplate');

	readonly activeTab = signal<DemoTab>('photo-gallery');
	readonly isDarkMode = signal<boolean>(false);

	readonly playgroundEnableZoom = signal<boolean>(true);
	readonly playgroundZoomSize = signal<number | 'originalSize'>(2.5);
	readonly playgroundLoop = signal<boolean>(true);
	readonly playgroundEnableCounter = signal<boolean>(true);
	readonly playgroundCounterText = signal<string>('IMAGE_INDEX of IMAGE_COUNT');
	readonly playgroundEnableAnimations = signal<boolean>(true);
	readonly playgroundEnableArrows = signal<boolean>(true);
	readonly playgroundEnableClose = signal<boolean>(true);
	readonly playgroundEnableClick = signal<boolean>(true);
	readonly playgroundStartingIndex = signal<number>(0);
	readonly playgroundPreloading = signal<boolean>(true);

	private readonly lightboxService = inject(NgxCdkLightboxService);

	readonly demoImages: IGalleryImage[] = [
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

	readonly mixedMedia: TGalleryDisplayObject[] = [
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

	readonly configDefault: Partial<IGalleryConfig> = {
		loopGallery: true,
		enableImageCounter: true,
		enableAnimations: true,
	};

	readonly configZoom: Partial<IGalleryConfig> = {
		enableZoom: true,
		zoomSize: 2.5,
		loopGallery: true,
	};

	readonly configMinimal: Partial<IGalleryConfig> = {
		enableArrows: false,
		enableCloseIcon: false,
		enableImageClick: true,
		enableImagePreloading: false,
	};

	readonly configCustomLocalized: Partial<IGalleryConfig> = {
		enableZoom: true,
		zoomSize: 'originalSize',
		imageCounterText: 'PHOTO [IMAGE_INDEX] OF [IMAGE_COUNT]',
		ariaLabelNext: 'Next picture',
		ariaLabelPrev: 'Previous picture',
		startingIndex: 1,
	};

	get configCustomLoader(): Partial<IGalleryConfig> {
		return {
			startingIndex: 2,
			enableAnimations: false,
			loaderTemplate: this.customLoaderTemplate() ?? null,
		};
	}

	readonly cssThemingSnippet = `.cyberpunk-dark-lightbox {
  --ngx-cdk-background: #090d16;
  --ngx-cdk-text-color: #38bdf8;
  --ngx-cdk-border-radius: 20px;
  --ngx-cdk-box-shadow: 0 0 45px rgba(56, 189, 248, 0.45);
  --ngx-cdk-counter-color: #f59e0b;
  --ngx-cdk-button-background: #6366f1;
  --ngx-cdk-button-color: #ffffff;
  --ngx-cdk-button-size: 38px;
  --ngx-cdk-button-border-radius: 12px;
  --ngx-cdk-button-shadow: 0 0 15px rgba(99, 102, 241, 0.6);
  --ngx-cdk-zoom-size: 220px;
  --ngx-cdk-zoom-border: 3px solid #38bdf8;
  --ngx-cdk-zoom-shadow: 0 0 30px rgba(56, 189, 248, 0.8);
  --ngx-cdk-zoom-border-radius: 24px;
}`;

	readonly installNpm =
		'pnpm add ngx-cdk-lightbox\n# or: npm install ngx-cdk-lightbox --save\n# or: yarn add ngx-cdk-lightbox';

	readonly usageService = `import { Component, inject } from '@angular/core';
import { NgxCdkLightboxService } from 'ngx-cdk-lightbox';

@Component({
  selector: 'app-gallery',
  template: \`<button (click)="openGallery()">Open Lightbox</button>\`,
})
export class GalleryComponent {
  private readonly lightbox = inject(NgxCdkLightboxService);

  openGallery(): void {
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

	ngOnInit(): void {
		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem('theme');
			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			const isDark = saved === 'dark' || (!saved && prefersDark);
			this.isDarkMode.set(isDark);
			document.documentElement.classList.toggle('dark-theme', isDark);
		}
	}

	toggleTheme(): void {
		const next = !this.isDarkMode();
		this.isDarkMode.set(next);
		if (typeof window !== 'undefined') {
			document.documentElement.classList.toggle('dark-theme', next);
			localStorage.setItem('theme', next ? 'dark' : 'light');
		}
	}

	get playgroundConfig(): Partial<IGalleryConfig> {
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

	get playgroundJson(): string {
		return JSON.stringify(this.playgroundConfig, null, 2);
	}

	selectTab(tab: DemoTab): void {
		this.activeTab.set(tab);
	}

	openGallery(
		items: TGalleryDisplayObject[] = this.demoImages,
		config?: Partial<IGalleryConfig>,
		startIndex?: number,
	): void {
		const finalConfig =
			startIndex !== undefined ? { ...config, startingIndex: startIndex } : config;
		this.lightboxService.open(items, finalConfig);
	}

	openDarkThemeGallery(): void {
		this.lightboxService.open(this.demoImages, {
			panelClass: 'cyberpunk-dark-lightbox',
			enableZoom: true,
			loopGallery: true,
			startingIndex: 3,
		});
	}

	launchPlayground(): void {
		this.openGallery(this.demoImages, this.playgroundConfig);
	}

	updateZoomSize(event: Event): void {
		const selectElement = event.target as HTMLSelectElement;
		const selectedValue = selectElement.value;
		if (selectedValue === 'originalSize') {
			this.playgroundZoomSize.set('originalSize');
		} else {
			this.playgroundZoomSize.set(Number(selectedValue));
		}
	}

	updateStartingIndex(event: Event): void {
		const inputElement = event.target as HTMLInputElement;
		const parsedIndex = Number(inputElement.value);
		this.playgroundStartingIndex.set(isNaN(parsedIndex) ? 0 : Math.max(0, parsedIndex));
	}

	updateCounterText(event: Event): void {
		const inputElement = event.target as HTMLInputElement;
		this.playgroundCounterText.set(inputElement.value);
	}
}
