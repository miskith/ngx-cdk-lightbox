import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	type ElementRef,
	Injector,
	NgZone,
	type OnInit,
	computed,
	effect,
	inject,
	signal,
	viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import {
	type Observable,
	type Subscription,
	catchError,
	fromEvent,
	map,
	of,
	shareReplay,
	switchMap,
	tap,
	timer,
} from 'rxjs';

import {
	type IGalleryConfig,
	type IGalleryData,
	type IGalleryImage,
	type IGalleryVideo,
	type TGalleryDisplayObject,
} from '../../interfaces/gallery.interface';
import { SafeHtmlPipe } from '../../pipes/safe-html/safe-html.pipe';
import { LoaderComponent } from '../loader/loader.component';

interface IZoomStyles {
	x: number;
	y: number;
	width: number;
	naturalWidth: number;
	height: number;
	naturalHeight: number;
	zoomWindowWidth?: number;
	zoomWindowHeight?: number;
}

interface IVideoSourceItem {
	src: string;
	size?: string;
}

interface IDimensions {
	width: string;
	height: string;
}

@Component({
	selector: 'lib-lightbox-dialog',
	templateUrl: 'lightbox-dialog.component.html',
	styleUrl: 'lightbox-dialog.component.scss',
	imports: [SafeHtmlPipe, LoaderComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		role: 'dialog',
		'aria-modal': 'true',
		'aria-label': 'Media Lightbox Gallery',
		'(document:keyup.arrowright)': 'nextDisplayObject($event)',
		'(document:keyup.arrowleft)': 'prevDisplayObject($event)',
		'(document:keyup.escape)': 'closeModal()',
		'(window:resize)': 'onWindowResize()',
	},
})
export class LightboxDialogComponent implements OnInit {
	readonly videoElement = viewChild<ElementRef<HTMLVideoElement>>('videoElement');
	readonly zoomElement = viewChild<ElementRef<HTMLDivElement>>('zoomElement');
	readonly zoomImageElement = viewChild<ElementRef<HTMLImageElement>>('zoomImageElement');
	readonly imageElement = viewChild<ElementRef<HTMLImageElement>>('imageElement');

	readonly data: IGalleryData = inject<IGalleryData>(DIALOG_DATA);
	readonly config: IGalleryConfig = this.data.config;

	private readonly dialogRef: DialogRef = inject<DialogRef>(DialogRef);
	private readonly destroyRef: DestroyRef = inject<DestroyRef>(DestroyRef);
	private readonly ngZone: NgZone = inject<NgZone>(NgZone);
	private readonly injector: Injector = inject<Injector>(Injector);
	private readonly preloadedImagesCache = new Map<string, Observable<HTMLImageElement>>();

	private mouseMoveSubscription?: Subscription;
	private touchStartX = 0;
	private touchStartY = 0;
	private isFirstLoad = true;

	readonly currentIndex = signal<number>(0);
	readonly isLoading = signal<boolean>(false);
	readonly imageOpacity = signal<number>(0);
	readonly isHoveringImage = signal<boolean>(false);
	readonly wrapperDimensions = signal<IDimensions>({
		width: '0px',
		height: '0px',
	});
	readonly zoomStyles = signal<IZoomStyles>({
		x: 0,
		y: 0,
		width: 0,
		naturalWidth: 0,
		height: 0,
		naturalHeight: 0,
		zoomWindowWidth: 160,
		zoomWindowHeight: 160,
	});

	readonly currentDisplayObject = computed<TGalleryDisplayObject | null>(() => {
		const index = this.currentIndex();
		if (index < 0 || index >= this.data.displayObjects.length) {
			return null;
		}
		return this.data.displayObjects[index] ?? null;
	});

	readonly currentImage = computed<IGalleryImage | null>(() => {
		const item = this.currentDisplayObject();
		return item && this.isGalleryImage(item) ? item : null;
	});

	readonly currentVideo = computed<IGalleryVideo | null>(() => {
		const item = this.currentDisplayObject();
		return item && this.isGalleryVideo(item) ? item : null;
	});

	readonly canZoom = computed<boolean>(() => {
		if (!this.config.enableZoom || !this.currentImage()) {
			return false;
		}
		if (this.config.zoomSize !== 'originalSize') {
			return true;
		}
		const { width, naturalWidth, height, naturalHeight } = this.zoomStyles();
		return (width > 0 && width < naturalWidth) || (height > 0 && height < naturalHeight);
	});

	readonly displayZoom = computed<boolean>(
		() => this.canZoom() && this.isHoveringImage() && this.imageOpacity() > 0.5,
	);

	readonly imageCounter = computed<string>(() =>
		this.config.imageCounterText
			.replace(/IMAGE_INDEX/, String(this.currentIndex() + 1))
			.replace(/IMAGE_COUNT/, String(this.data.displayObjects.length)),
	);

	readonly videoSources = computed<IVideoSourceItem[]>(() => {
		const video = this.currentVideo();
		if (!video) {
			return [];
		}
		if (typeof video.mp4Source === 'string') {
			return [{ src: video.mp4Source }];
		}
		return Object.entries(video.mp4Source).map(([size, src]) => ({
			size,
			src,
		}));
	});

	readonly zoomTransformation = computed<string>(() => {
		const { x, y, width, naturalWidth, height, naturalHeight, zoomWindowWidth, zoomWindowHeight } =
			this.zoomStyles();
		const halfZoomX = (zoomWindowWidth || 160) / 2;
		const halfZoomY = (zoomWindowHeight || 160) / 2;

		if (this.config.zoomSize === 'originalSize') {
			const scaleX = width > 0 ? naturalWidth / width : 1;
			const scaleY = height > 0 ? naturalHeight / height : 1;
			const translateX = -1 * (x * scaleX - halfZoomX);
			const translateY = -1 * (y * scaleY - halfZoomY);
			return `translate(${translateX}px, ${translateY}px)`;
		}
		const scale = typeof this.config.zoomSize === 'number' ? this.config.zoomSize : 2;
		return `translate(${-1 * (x * scale - halfZoomX)}px, ${-1 * (y * scale - halfZoomY)}px)`;
	});

	readonly zoomWidth = computed<string>(() => {
		const { width, naturalWidth } = this.zoomStyles();
		if (this.config.zoomSize === 'originalSize') {
			return `${naturalWidth}px`;
		}
		const scale = typeof this.config.zoomSize === 'number' ? this.config.zoomSize : 2;
		return `${width * scale}px`;
	});

	readonly zoomHeight = computed<string>(() => {
		const { height, naturalHeight } = this.zoomStyles();
		if (this.config.zoomSize === 'originalSize') {
			return `${naturalHeight}px`;
		}
		const scale = typeof this.config.zoomSize === 'number' ? this.config.zoomSize : 2;
		return `${height * scale}px`;
	});

	ngOnInit(): void {
		effect(
			() => {
				const imageElement = this.imageElement()?.nativeElement;
				if (imageElement) {
					this.setupImageMouseMoveListener(imageElement);
				}
			},
			{ injector: this.injector },
		);

		this.destroyRef.onDestroy(() => {
			this.mouseMoveSubscription?.unsubscribe();
			this.preloadedImagesCache.clear();
		});

		const initialIndex = Math.max(
			0,
			Math.min(this.config.startingIndex, this.data.displayObjects.length - 1),
		);
		this.loadDisplayObject(initialIndex);
	}

	onWindowResize(): void {
		const imageElement = this.imageElement()?.nativeElement;
		if (imageElement && this.currentImage() && imageElement.naturalWidth > 0) {
			this.setImageDetails(imageElement);
			const targetSize = this.calculateFittedDimensions(
				imageElement.naturalWidth,
				imageElement.naturalHeight,
			);
			this.wrapperDimensions.set({
				width: `${targetSize.width}px`,
				height: `${targetSize.height}px`,
			});
		}
	}

	nextDisplayObject(event?: Event): void {
		if (event) {
			event.preventDefault();
		}
		const index = this.getNextIndex();
		this.loadDisplayObject(index !== false ? index : this.data.displayObjects.length - 1);
	}

	prevDisplayObject(event?: Event): void {
		if (event) {
			event.preventDefault();
		}
		const index = this.getPrevIndex();
		this.loadDisplayObject(index !== false ? index : 0);
	}

	closeModal(): void {
		this.dialogRef.close();
	}

	imageClick(event: MouseEvent): void {
		if (!this.config.enableImageClick) {
			return;
		}

		const offsetX = event.offsetX ?? 0;
		const width = this.zoomStyles().width;
		if (width > 0 && offsetX / width < 0.5) {
			this.prevDisplayObject();
		} else {
			this.nextDisplayObject();
		}
	}

	touchStart(event: TouchEvent): void {
		if (event.touches.length === 1) {
			this.touchStartX = event.touches[0]!.clientX;
			this.touchStartY = event.touches[0]!.clientY;
		}
	}

	touchEnd(event: TouchEvent): void {
		if (event.changedTouches.length === 1) {
			const deltaX = event.changedTouches[0]!.clientX - this.touchStartX;
			const deltaY = event.changedTouches[0]!.clientY - this.touchStartY;

			if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
				if (deltaX < 0) {
					this.nextDisplayObject();
				} else {
					this.prevDisplayObject();
				}
			}
		}
	}

	imageMouseIn(event: MouseEvent): void {
		this.isHoveringImage.set(true);
		const target = (event.currentTarget || event.target) as HTMLImageElement;
		if (target) {
			this.setImageDetails(target);
		}
		this.updateZoomPosition(event);
	}

	imageMouseOut(): void {
		this.isHoveringImage.set(false);
	}

	private setupImageMouseMoveListener(imageElement: HTMLImageElement): void {
		this.mouseMoveSubscription?.unsubscribe();
		this.mouseMoveSubscription = this.ngZone.runOutsideAngular(() =>
			fromEvent<MouseEvent>(imageElement, 'mousemove').subscribe((event: MouseEvent) => {
				this.updateZoomPosition(event);
			}),
		);
	}

	private updateZoomPosition(event: MouseEvent): void {
		const imageElement = this.imageElement()?.nativeElement;
		let offsetX = event.offsetX ?? 0;
		let offsetY = event.offsetY ?? 0;

		if (imageElement) {
			const rect = imageElement.getBoundingClientRect();
			if (rect.width > 0 && rect.height > 0) {
				offsetX = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
				offsetY = Math.max(0, Math.min(rect.height, event.clientY - rect.top));
			}
		}

		const zoomElement = this.zoomElement()?.nativeElement;
		const zoomWindowWidth = zoomElement?.offsetWidth || this.zoomStyles().zoomWindowWidth || 160;
		const zoomWindowHeight = zoomElement?.offsetHeight || this.zoomStyles().zoomWindowHeight || 160;

		this.zoomStyles.update((current) => ({
			...current,
			x: offsetX,
			y: offsetY,
			zoomWindowWidth,
			zoomWindowHeight,
		}));

		if (zoomElement) {
			zoomElement.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
		}

		const zoomImageElement = this.zoomImageElement()?.nativeElement;
		if (zoomImageElement) {
			zoomImageElement.style.transform = this.zoomTransformation();
		}
	}

	private setImageDetails(imageElement: HTMLImageElement): void {
		const naturalWidth = imageElement.naturalWidth;
		const naturalHeight = imageElement.naturalHeight;
		const fitted = this.calculateFittedDimensions(naturalWidth, naturalHeight);
		const width = imageElement.clientWidth || fitted.width;
		const height = imageElement.clientHeight || fitted.height;
		const zoomElement = this.zoomElement()?.nativeElement;
		const zoomWindowWidth = zoomElement?.offsetWidth || this.zoomStyles().zoomWindowWidth || 160;
		const zoomWindowHeight = zoomElement?.offsetHeight || this.zoomStyles().zoomWindowHeight || 160;

		this.zoomStyles.update((current) => ({
			...current,
			width,
			naturalWidth,
			height,
			naturalHeight,
			zoomWindowWidth,
			zoomWindowHeight,
		}));
	}

	private getNextIndex(): number | false {
		const nextIndex = this.currentIndex() + 1;
		if (nextIndex > this.data.displayObjects.length - 1) {
			return this.config.loopGallery ? 0 : false;
		}
		return nextIndex;
	}

	private getPrevIndex(): number | false {
		const prevIndex = this.currentIndex() - 1;
		if (prevIndex < 0) {
			return this.config.loopGallery ? this.data.displayObjects.length - 1 : false;
		}
		return prevIndex;
	}

	private loadDisplayObject(index: number): void {
		const targetObject = this.data.displayObjects[index];
		if (!targetObject) {
			return;
		}

		this.currentIndex.set(index);

		if (!this.config.enableAnimations) {
			this.wrapperDimensions.set({ width: 'auto', height: 'auto' });
			this.imageOpacity.set(1);
			this.isLoading.set(true);

			this.preloadDisplayObject(targetObject)
				.pipe(
					takeUntilDestroyed(this.destroyRef),
					catchError((error) => {
						console.error('Failed to load display object:', error);
						this.isLoading.set(false);
						return of(void 0);
					}),
				)
				.subscribe({
					next: (preloadedImage) => {
						if (preloadedImage) {
							this.setImageDetails(preloadedImage);
						}
						const videoElementRef = this.videoElement();
						if (videoElementRef?.nativeElement) {
							videoElementRef.nativeElement.load();
						}
						this.isLoading.set(false);
						this.prefetchAdjacentObjects();
					},
					error: () => {
						this.isLoading.set(false);
					},
				});
			return;
		}

		this.imageOpacity.set(0);
		this.isHoveringImage.set(false);
		this.isLoading.set(true);

		if (this.isFirstLoad) {
			this.wrapperDimensions.set({ width: '0px', height: '0px' });
		}

		this.preloadDisplayObject(targetObject)
			.pipe(
				takeUntilDestroyed(this.destroyRef),
				catchError((error) => {
					console.error('Failed to load display object:', error);
					this.isLoading.set(false);
					this.imageOpacity.set(1);
					return of(void 0);
				}),
				switchMap((preloadedImage) => {
					let naturalWidth = 900;
					let naturalHeight = 600;

					if (preloadedImage) {
						naturalWidth = preloadedImage.naturalWidth;
						naturalHeight = preloadedImage.naturalHeight;
						this.setImageDetails(preloadedImage);
					} else if (this.isGalleryVideo(targetObject) && targetObject.resolution) {
						naturalWidth = targetObject.resolution.width;
						naturalHeight = targetObject.resolution.height;
					} else if (this.isGalleryImage(targetObject) && targetObject.resolution) {
						naturalWidth = targetObject.resolution.width;
						naturalHeight = targetObject.resolution.height;
					}

					const targetSize = this.calculateFittedDimensions(naturalWidth, naturalHeight);
					const delayTime = this.isFirstLoad ? 30 : 10;
					this.isFirstLoad = false;

					return timer(delayTime).pipe(
						tap(() => {
							this.wrapperDimensions.set({
								width: `${targetSize.width}px`,
								height: `${targetSize.height}px`,
							});
						}),
						switchMap(() => timer(350)),
						map(() => preloadedImage),
					);
				}),
			)
			.subscribe({
				next: (preloadedImage) => {
					if (preloadedImage) {
						this.setImageDetails(preloadedImage);
					}

					const videoElementRef = this.videoElement();
					if (videoElementRef?.nativeElement) {
						videoElementRef.nativeElement.load();
					}

					this.isLoading.set(false);
					this.imageOpacity.set(1);
					this.prefetchAdjacentObjects();
				},
				error: () => {
					this.isLoading.set(false);
					this.imageOpacity.set(1);
				},
			});
	}

	private calculateFittedDimensions(
		naturalWidth: number,
		naturalHeight: number,
	): { width: number; height: number } {
		if (!naturalWidth || !naturalHeight) {
			return { width: 600, height: 400 };
		}
		const maxWidth = typeof window !== 'undefined' ? window.innerWidth * 0.95 : 1200;
		const maxHeight = typeof window !== 'undefined' ? window.innerHeight * 0.85 : 800;
		const scale = Math.min(maxWidth / naturalWidth, maxHeight / naturalHeight, 1);

		const fittedWidth = Math.round(naturalWidth * scale);
		const fittedHeight = Math.round(naturalHeight * scale);

		const minWidth = Math.min(300, maxWidth);
		const width = Math.max(fittedWidth, minWidth);

		return {
			width,
			height: fittedHeight,
		};
	}

	private prefetchAdjacentObjects(): void {
		if (!this.config.enableImagePreloading) {
			return;
		}
		const nextIndex = this.getNextIndex();
		if (nextIndex !== false) {
			this.preloadDisplayObject(this.data.displayObjects[nextIndex]!).subscribe();
		}
		const prevIndex = this.getPrevIndex();
		if (prevIndex !== false) {
			this.preloadDisplayObject(this.data.displayObjects[prevIndex]!).subscribe();
		}
	}

	private preloadDisplayObject(
		displayObject: TGalleryDisplayObject,
	): Observable<HTMLImageElement | void> {
		if (this.isGalleryImage(displayObject)) {
			if (!this.preloadedImagesCache.has(displayObject.source)) {
				const image = new Image();
				this.preloadedImagesCache.set(
					displayObject.source,
					fromEvent(image, 'load').pipe(
						map(() => image),
						shareReplay({
							bufferSize: 1,
							refCount: true,
						}),
					),
				);
				image.src = displayObject.source;
			}
			return this.preloadedImagesCache.get(displayObject.source)!;
		}
		return of(void 0);
	}

	private isGalleryImage(
		galleryDisplayObject: TGalleryDisplayObject,
	): galleryDisplayObject is IGalleryImage {
		return galleryDisplayObject.type === 'image';
	}

	private isGalleryVideo(
		galleryDisplayObject: TGalleryDisplayObject,
	): galleryDisplayObject is IGalleryVideo {
		return galleryDisplayObject.type === 'video';
	}
}
