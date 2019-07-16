# ngx-cdk-lightbox

Custom implementation of CDK to display image gallery in lightbox.

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
import { LightboxModule, LightboxService } from 'ngx-cdk-lightbox';
```

### 3. Add imports & provider to your module

```typescript
@NgModule({
	imports: [
		...
		LightboxModule,
	],
	providers: [
		...
		LightboxService,
	],
})
export class SomeModule { }
```

## Usage

```typescript
this.lightboxService.open(GalleryImageInterface[], GalleryConfigInterface);
```

```typescript
interface GalleryImageInterface
{
	source: string;
	description?: string;
	copyright?: string;
}
```

```typescript
interface GalleryConfigInterface
{
	enableZoom?: boolean;
	zoomSize?: number|'originalSize';
	enableImageClick?: boolean;
	loopGallery?: boolean;
	enableImageCounter?: boolean;
	imageCounterText?: string;
	enableCloseIcon?: boolean;
	closeIcon?: string;
	enableArrows?: boolean;
	arrowRight?: string;
	arrowLeft?: string;
	enableImagePreloading?: boolean;
	startingIndex?: number;
	enableAnimations?: boolean;
}
```

#### GalleryImageInterface
|  key |  value |
| ------------ | ------------ |
|  source |  path to image |
|  description |  optional - description of image |
|  copyright |  optional - copyright info |


#### GalleryConfigInterface
|  key | type | default | value |
| ------------ | ------------ | ------------ | ------------ |
| enableZoom | boolean | false | display zoom on mouse hover over image |
| zoomSize | number, 'originalSize' | 'originalSize' | zoom size, number for zoom multiplication, originalSize for original image size |
| enableImageClick | boolean | true | enable click on image to navigate to next or previous photo |
| loopGallery | boolean | true | loop gallery after last photo or before first photo |
| enableImageCounter | boolean | true | display current image counter |
| imageCounterText | string | 'IMAGE_INDEX photo of IMAGE_COUNT' | format for image counter |
| enableCloseIcon | boolean | true | display close icon |
| closeIcon | string | https://material.io/tools/icons/?icon=close&style=baseline | HTML string containing close icon |
| enableArrows | boolean | true | display next/prev icons |
| arrowRight | string | https://material.io/tools/icons/?icon=keyboard_arrow_right&style=baseline | HTML string containing right arrow |
| arrowLeft | string | https://material.io/tools/icons/?icon=keyboard_arrow_left&style=baseline | HTML string containing left arrow |
| enableImagePreloading | boolean | enable/disable image preloading |
| startingIndex | number | 0 | index of starting image |
| enableAnimations | boolean | true | enable/disable animations |


## Usage example

```typescript
@Component({
	...
})
export class SomeComponent
{
	constructor(private lightboxService: LightboxService)
	{
	}

	public openLightbox():void
	{
		this.lightboxService.open([
			{source: 'assets/images/image1.jpg', copyright: 'unknown'},
			{source: 'assets/images/image5.jpg', copyright: 'unknown'},
		], {
			enableAnimations: false,
		});

		return;
	}
}
```


## ToDo

- Demo

## Donate

You are currently using code that is totally for free and that is fine. But if you want to put a soup on a developer's table anyway, feel free to do so :).

[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=LUUCVTX85J2NQ&item_name=For+the+soup%21+%28ngx-cdk-lightbox+development%29&currency_code=CZK&source=url)
