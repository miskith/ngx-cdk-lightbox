# ngx-cdk-lightbox

A lightweight, performant, and flexible lightbox gallery component and service built on top of Angular CDK. Supports responsive images, multiple video resolutions, zoom, and customizable templates.

## Demo

[Live Interactive Demo](https://storage.davidmyska.com/ngx-cdk-lightbox/)

## Features

- ⚡ **Modern Angular 22+ Architecture** — 100% Standalone, Signal-driven reactive state, and native `@if` / `@for` control flow.
- 🖼️ **Mixed Media Support** — Seamlessly cycle between high-res photos and HTML5 multi-resolution video streams (240p up to 4K).
- 🔍 **High-Performance Zoom Loupe** — Hover over high-resolution photos with 60/120 FPS cursor tracking executed outside Angular Zone.js.
- 📱 **Touch & Swipe Gestures** — Mobile touch swipe navigation with intelligent axis discrimination against page scrolling.
- ♿ **Full WCAG 2.1 AA Accessibility** — Dynamic `aria-label` customization, keyboard controls (Arrow keys, Escape), and `prefers-reduced-motion` support.
- 📐 **Dynamic Responsive Fitting** — Physical scale-up and progressive dimension morphing between varying media aspect ratios with automatic window resize handling.
- 🎨 **Custom CSS Loaders & Templates** — Easily plug in custom `TemplateRef` loader templates and customize CSS theme variables.

---

## Installation

```shell
# npm
npm install ngx-cdk-lightbox --save

# pnpm
pnpm add ngx-cdk-lightbox

# yarn
yarn add ngx-cdk-lightbox
```

---

## Quick Start (Standalone Angular)

Inject `NgxCdkLightboxService` directly into your standalone component or service:

```typescript
import { Component, inject } from '@angular/core';
import { NgxCdkLightboxService, type IGalleryImage } from 'ngx-cdk-lightbox';

@Component({
	selector: 'app-gallery',
	standalone: true,
	template: ` <button (click)="openGallery()">Open Lightbox Gallery</button> `,
})
export class GalleryComponent {
	private readonly lightbox = inject(NgxCdkLightboxService);

	public readonly images: IGalleryImage[] = [
		{
			type: 'image',
			source: 'assets/images/photo1.jpg',
			description: 'Alpine Lake & Snowy Peaks',
			copyright: '© 2026 Photographer',
			resolution: { width: 1920, height: 1080 },
		},
		{
			type: 'image',
			source: 'assets/images/photo2.jpg',
			description: 'Forest Waterfall',
			copyright: '© 2026 Nature Studio',
		},
	];

	public openGallery(): void {
		this.lightbox.open(this.images, {
			enableZoom: true,
			zoomSize: 2.5,
			loopGallery: true,
		});
	}
}
```

---

## Global Configuration (Optional)

Configure application-wide default lightbox options in your `app.config.ts`:

```typescript
import { type ApplicationConfig } from '@angular/core';
import { provideLightboxConfig } from 'ngx-cdk-lightbox';

export const appConfig: ApplicationConfig = {
	providers: [
		provideLightboxConfig({
			loopGallery: true,
			enableAnimations: true,
			enableImageCounter: true,
			imageCounterText: 'PHOTO IMAGE_INDEX OF IMAGE_COUNT',
		}),
	],
};
```

---

## API & Configuration Reference

### `IGalleryConfig` Options

| Option                  | Type                           | Default                              | Description                                                            |
| ----------------------- | ------------------------------ | ------------------------------------ | ---------------------------------------------------------------------- |
| `enableZoom`            | `boolean`                      | `false`                              | Enables interactive zoom loupe on hover over images.                   |
| `zoomSize`              | `number \| 'originalSize'`     | `'originalSize'`                     | Zoom magnification factor (e.g. `2.5`) or original natural resolution. |
| `enableImageClick`      | `boolean`                      | `true`                               | Click on left/right half of image to navigate previous/next.           |
| `loopGallery`           | `boolean`                      | `true`                               | Loop back to start/end when reaching gallery boundaries.               |
| `enableImageCounter`    | `boolean`                      | `true`                               | Displays current slide counter (e.g. `1 photo of 5`).                  |
| `imageCounterText`      | `string`                       | `'IMAGE_INDEX photo of IMAGE_COUNT'` | Format string for counter. Replaces `IMAGE_INDEX` and `IMAGE_COUNT`.   |
| `enableCloseIcon`       | `boolean`                      | `true`                               | Displays close icon button.                                            |
| `closeIcon`             | `string`                       | Material Close SVG                   | Custom SVG markup for close button.                                    |
| `enableArrows`          | `boolean`                      | `true`                               | Displays previous/next navigation arrow buttons.                       |
| `arrowLeft`             | `string`                       | Material Chevron SVG                 | Custom SVG markup for previous button.                                 |
| `arrowRight`            | `string`                       | Material Chevron SVG                 | Custom SVG markup for next button.                                     |
| `loaderTemplate`        | `TemplateRef<unknown> \| null` | `null`                               | Custom Angular `TemplateRef` for loading spinners.                     |
| `enableImagePreloading` | `boolean`                      | `true`                               | Pre-caches adjacent images in the background for instant transitions.  |
| `startingIndex`         | `number`                       | `0`                                  | Initial zero-based slide index to open at.                             |
| `enableAnimations`      | `boolean`                      | `true`                               | Enables progressive dimension morphing and cross-fades.                |
| `ariaLabelNext`         | `string`                       | `'Next'`                             | Accessible screen-reader label for next button.                        |
| `ariaLabelPrev`         | `string`                       | `'Previous'`                         | Accessible screen-reader label for previous button.                    |
| `ariaLabelClose`        | `string`                       | `'Close'`                            | Accessible screen-reader label for close button.                       |

---

### Media Types

#### `IGalleryImage`

```typescript
interface IGalleryImage {
	type: 'image';
	source: string;
	description?: string;
	copyright?: string;
	resolution?: { width: number; height: number };
}
```

#### `IGalleryVideo`

```typescript
interface IGalleryVideo {
	type: 'video';
	mp4Source: string | Partial<Record<TVideoResolutions, string>>;
	description?: string;
	copyright?: string;
	resolution?: { width: number; height: number };
}
```

---

## Theming & CSS Variables

Override default styling using CSS custom properties on `:root` or parent containers:

```scss
:root {
	--ngx-cdk-background: #ffffff;
	--ngx-cdk-loader-color: #4f46e5;
	--ngx-cdk-loader-size: 32px;
	--ngx-cdk-loader-thickness: 3px;
}
```

---

## License

MIT © [miskith](https://github.com/miskith)
