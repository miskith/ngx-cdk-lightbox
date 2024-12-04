# ngx-cdk-lightbox

Custom implementation of CDK to display image gallery in lightbox.

## Demo

https://www.davidmyska.com/ngx-cdk-lightbox/

## Installation

### 1. Install npm package

**npm**

```shell
npm install ngx-cdk-lightbox --save
```

**yarn**

```shell
yarn add ngx-cdk-lightbox
```

### 2. Import library to your module

```typescript
import { NgxCdkLightboxModule } from 'ngx-cdk-lightbox';
```

### 3. Import NgxCdkLightboxModule into your module

```typescript
@NgModule({
	imports: [...NgxCdkLightboxModule],
})
export class SomeModule {}
```

## Usage

```typescript
this.lightboxService.open(TGalleryDisplayObject[], IGalleryConfig);
```

```typescript
type TGalleryDisplayObject = IGalleryImage | IGalleryVideo;
```

```typescript
interface IGalleryImage {
	type: 'image';
	source: string;
	description?: string;
	copyright?: string;
}
```

```typescript
type TVideoResolutions = 240 | 360 | 480 | 720 | 1080 | 2160 | 4320;
```

```typescript
export interface IGalleryVideo {
	type: 'video';
	mp4Source: string | Partial<Record<TVideoResolutions, string>>;
	description?: string;
	copyright?: string;
	resolution?: {
		width: number;
		height: number;
	};
}
```

```typescript
interface IGalleryConfig {
	enableZoom?: boolean;
	zoomSize?: number | 'originalSize';
	enableImageClick?: boolean;
	loopGallery?: boolean;
	enableImageCounter?: boolean;
	imageCounterText?: string;
	enableCloseIcon?: boolean;
	closeIcon?: string;
	enableArrows?: boolean;
	arrowRight?: string;
	arrowLeft?: string;
	loaderTemplate?: TemplateRef<unknown>;
	enableImagePreloading?: boolean;
	startingIndex?: number;
	enableAnimations?: boolean;
}
```

#### IGalleryImage

| key         | value                           |
| ----------- | ------------------------------- |
| type        | 'image'                         |
| source      | path to image                   |
| description | optional - description of image |
| copyright   | optional - copyright info       |

#### IGalleryVideo

| key         | value                           |
| ----------- | ------------------------------- |
| type        | 'video'                         |
| mp4Source   | path to video source/sources    |
| description | optional - description of video |
| copyright   | optional - copyright info       |
| resolution  | width and height of video       |

#### IGalleryConfig

| key                   | type                   | default                                                                   | value                                                                           |
| --------------------- | ---------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| enableZoom            | boolean                | false                                                                     | display zoom on mouse hover over image                                          |
| zoomSize              | number, 'originalSize' | 'originalSize'                                                            | zoom size, number for zoom multiplication, originalSize for original image size |
| enableImageClick      | boolean                | true                                                                      | enable click on image to navigate to next or previous image                     |
| loopGallery           | boolean                | true                                                                      | loop gallery after last image or before first image                             |
| enableImageCounter    | boolean                | true                                                                      | display current image counter                                                   |
| imageCounterText      | string                 | 'IMAGE_INDEX photo of IMAGE_COUNT'                                        | format for image counter                                                        |
| enableCloseIcon       | boolean                | true                                                                      | display close icon                                                              |
| closeIcon             | string                 | https://material.io/tools/icons/?icon=close&style=baseline                | HTML string containing close icon                                               |
| enableArrows          | boolean                | true                                                                      | display next/prev icons                                                         |
| arrowRight            | string                 | https://material.io/tools/icons/?icon=keyboard_arrow_right&style=baseline | HTML string containing right arrow                                              |
| arrowLeft             | string                 | https://material.io/tools/icons/?icon=keyboard_arrow_left&style=baseline  | HTML string containing left arrow                                               |
| loaderTemplate        | TemplateRef            | null                                                                      | Set custom loader by providing template reference                               |
| enableImagePreloading | boolean                | enable/disable image preloading                                           |
| startingIndex         | number                 | 0                                                                         | index of starting image                                                         |
| enableAnimations      | boolean                | true                                                                      | enable/disable animations                                                       |
| ariaLabelNext         | string                 | 'Next'                                                                    | Aria label for next button                                                      |
| ariaLabelPrev         | string                 | 'Previous'                                                                | Aria label for previous button                                                  |

## Usage example

```typescript
@Component({
	...
})
export class SomeComponent
{
	constructor(private readonly lightboxService: NgxCdkLightboxService) {}

	public openLightbox(): void {
		this.lightboxService.open([
			{source: 'assets/images/image1.jpg', copyright: 'unknown'},
			{source: 'assets/images/image5.jpg', copyright: 'unknown'},
		], {
			enableAnimations: false,
		});
	}
}
```

## ToDo

- Support for iframe

## Donate

You are currently using code that is totally for free and that is fine. But if you want to put a soup on a developer's table anyway, feel free to do so :).

[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=LUUCVTX85J2NQ&item_name=For+the+soup%21+%28ngx-cdk-lightbox+development%29&currency_code=CZK&source=url)
