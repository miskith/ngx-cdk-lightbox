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
import { LiveAnnouncer } from '@angular/cdk/a11y';
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
import { type IGalleryI18n, resolveLightboxI18n } from '../../i18n/lightbox-i18n';
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
		'[attr.aria-label]': 'i18n().gallery',
		'(document:keyup.arrowright)': 'nextDisplayObject($event)',
		'(document:keyup.arrowleft)': 'prevDisplayObject($event)',
		'(document:keyup.home)': 'firstDisplayObject($event)',
		'(document:keyup.end)': 'lastDisplayObject($event)',
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
	private readonly liveAnnouncer: LiveAnnouncer = inject<LiveAnnouncer>(LiveAnnouncer);
	private readonly preloadedImagesCache = new Map<string, Observable<HTMLImageElement>>();

	private mouseMoveSubscription?: Subscription;
	private touchStartXCoordinate = 0;
	private touchStartYCoordinate = 0;
	private isFirstLoad = true;

	readonly i18n = computed<IGalleryI18n>(() => resolveLightboxI18n(this.config.i18n));
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
		const activeIndex = this.currentIndex();
		if (activeIndex < 0 || activeIndex >= this.data.displayObjects.length) {
			return null;
		}
		return this.data.displayObjects[activeIndex] ?? null;
	});

	readonly currentImage = computed<IGalleryImage | null>(() => {
		const displayItem = this.currentDisplayObject();
		return displayItem && this.isGalleryImage(displayItem) ? displayItem : null;
	});

	readonly currentVideo = computed<IGalleryVideo | null>(() => {
		const displayItem = this.currentDisplayObject();
		return displayItem && this.isGalleryVideo(displayItem) ? displayItem : null;
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
		this.i18n()
			.counter.replace(/IMAGE_INDEX/, String(this.currentIndex() + 1))
			.replace(/IMAGE_COUNT/, String(this.data.displayObjects.length)),
	);

	readonly isAtFirstSlide = computed<boolean>(
		() => !this.config.loopGallery && this.currentIndex() === 0,
	);

	readonly isAtLastSlide = computed<boolean>(
		() => !this.config.loopGallery && this.currentIndex() === this.data.displayObjects.length - 1,
	);

	readonly liveAnnouncementText = computed<string>(() => {
		const activeDisplayObject = this.currentDisplayObject();
		if (!activeDisplayObject) {
			return '';
		}
		const counterText = this.imageCounter();
		const descriptionText = activeDisplayObject.description
			? `. ${activeDisplayObject.description}`
			: '';
		return `${counterText}${descriptionText}`;
	});

	readonly videoSources = computed<IVideoSourceItem[]>(() => {
		const activeVideo = this.currentVideo();
		if (!activeVideo) {
			return [];
		}
		if (typeof activeVideo.mp4Source === 'string') {
			return [{ src: activeVideo.mp4Source }];
		}
		return Object.entries(activeVideo.mp4Source).map(([size, src]) => ({
			size,
			src,
		}));
	});

	readonly zoomTransformation = computed<string>(() => {
		const { x, y, width, naturalWidth, height, naturalHeight, zoomWindowWidth, zoomWindowHeight } =
			this.zoomStyles();
		const halfZoomWidth = (zoomWindowWidth || 160) / 2;
		const halfZoomHeight = (zoomWindowHeight || 160) / 2;

		if (this.config.zoomSize === 'originalSize') {
			const scaleX = width > 0 ? naturalWidth / width : 1;
			const scaleY = height > 0 ? naturalHeight / height : 1;
			const translateX = -1 * (x * scaleX - halfZoomWidth);
			const translateY = -1 * (y * scaleY - halfZoomHeight);
			return `translate(${translateX}px, ${translateY}px)`;
		}
		const numericScale = typeof this.config.zoomSize === 'number' ? this.config.zoomSize : 2;
		return `translate(${-1 * (x * numericScale - halfZoomWidth)}px, ${-1 * (y * numericScale - halfZoomHeight)}px)`;
	});

	readonly zoomWidth = computed<string>(() => {
		const { width, naturalWidth } = this.zoomStyles();
		if (this.config.zoomSize === 'originalSize') {
			return `${naturalWidth}px`;
		}
		const numericScale = typeof this.config.zoomSize === 'number' ? this.config.zoomSize : 2;
		return `${width * numericScale}px`;
	});

	readonly zoomHeight = computed<string>(() => {
		const { height, naturalHeight } = this.zoomStyles();
		if (this.config.zoomSize === 'originalSize') {
			return `${naturalHeight}px`;
		}
		const numericScale = typeof this.config.zoomSize === 'number' ? this.config.zoomSize : 2;
		return `${height * numericScale}px`;
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

		effect(
			() => {
				const announcementMessage = this.liveAnnouncementText();
				if (announcementMessage) {
					void this.liveAnnouncer.announce(announcementMessage, 'polite');
				}
			},
			{ injector: this.injector },
		);

		this.destroyRef.onDestroy(() => {
			this.mouseMoveSubscription?.unsubscribe();
			this.preloadedImagesCache.clear();
			this.liveAnnouncer.clear();
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
			const targetDimensions = this.calculateFittedDimensions(
				imageElement.naturalWidth,
				imageElement.naturalHeight,
			);
			this.wrapperDimensions.set({
				width: `${targetDimensions.width}px`,
				height: `${targetDimensions.height}px`,
			});
			return;
		}

		const videoElement = this.videoElement()?.nativeElement;
		if (videoElement && this.currentVideo() && videoElement.videoWidth > 0) {
			const targetDimensions = this.calculateFittedDimensions(
				videoElement.videoWidth,
				videoElement.videoHeight,
			);
			this.wrapperDimensions.set({
				width: `${targetDimensions.width}px`,
				height: `${targetDimensions.height}px`,
			});
		}
	}

	onVideoMetadataLoaded(event: Event): void {
		const videoElement = event.target as HTMLVideoElement;
		if (videoElement && videoElement.videoWidth > 0 && videoElement.videoHeight > 0) {
			const targetDimensions = this.calculateFittedDimensions(
				videoElement.videoWidth,
				videoElement.videoHeight,
			);
			this.wrapperDimensions.set({
				width: `${targetDimensions.width}px`,
				height: `${targetDimensions.height}px`,
			});
		}
	}

	nextDisplayObject(event?: Event): void {
		if (event) {
			event.preventDefault();
		}
		const nextIndex = this.getNextDisplayObjectIndex();
		if (nextIndex !== false) {
			this.loadDisplayObject(nextIndex);
		}
	}

	prevDisplayObject(event?: Event): void {
		if (event) {
			event.preventDefault();
		}
		const previousIndex = this.getPreviousDisplayObjectIndex();
		if (previousIndex !== false) {
			this.loadDisplayObject(previousIndex);
		}
	}

	firstDisplayObject(event?: Event): void {
		if (event) {
			event.preventDefault();
		}
		this.loadDisplayObject(0);
	}

	lastDisplayObject(event?: Event): void {
		if (event) {
			event.preventDefault();
		}
		this.loadDisplayObject(this.data.displayObjects.length - 1);
	}

	closeModal(): void {
		this.dialogRef.close();
	}

	imageClick(event: MouseEvent): void {
		if (!this.config.enableImageClick) {
			return;
		}

		const cursorOffsetX = event.offsetX ?? 0;
		const displayedWidth = this.zoomStyles().width;
		if (displayedWidth > 0 && cursorOffsetX / displayedWidth < 0.5) {
			this.prevDisplayObject();
		} else {
			this.nextDisplayObject();
		}
	}

	touchStart(event: TouchEvent): void {
		if (event.touches.length === 1) {
			this.touchStartXCoordinate = event.touches[0]!.clientX;
			this.touchStartYCoordinate = event.touches[0]!.clientY;
		}
	}

	touchEnd(event: TouchEvent): void {
		if (event.changedTouches.length === 1) {
			const horizontalSwipeDistance = event.changedTouches[0]!.clientX - this.touchStartXCoordinate;
			const verticalSwipeDistance = event.changedTouches[0]!.clientY - this.touchStartYCoordinate;

			if (
				Math.abs(horizontalSwipeDistance) > 40 &&
				Math.abs(horizontalSwipeDistance) > Math.abs(verticalSwipeDistance) * 1.5
			) {
				if (horizontalSwipeDistance < 0) {
					this.nextDisplayObject();
				} else {
					this.prevDisplayObject();
				}
			}
		}
	}

	imageMouseIn(event: MouseEvent): void {
		this.isHoveringImage.set(true);
		const targetImage = (event.currentTarget || event.target) as HTMLImageElement;
		if (targetImage) {
			this.setImageDetails(targetImage);
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
		let cursorOffsetX = event.offsetX ?? 0;
		let cursorOffsetY = event.offsetY ?? 0;

		if (imageElement) {
			const boundingRectangle = imageElement.getBoundingClientRect();
			if (boundingRectangle.width > 0 && boundingRectangle.height > 0) {
				cursorOffsetX = Math.max(
					0,
					Math.min(boundingRectangle.width, event.clientX - boundingRectangle.left),
				);
				cursorOffsetY = Math.max(
					0,
					Math.min(boundingRectangle.height, event.clientY - boundingRectangle.top),
				);
			}
		}

		const zoomElement = this.zoomElement()?.nativeElement;
		const zoomWindowWidth = zoomElement?.offsetWidth || this.zoomStyles().zoomWindowWidth || 160;
		const zoomWindowHeight = zoomElement?.offsetHeight || this.zoomStyles().zoomWindowHeight || 160;

		this.zoomStyles.update((currentStyles) => ({
			...currentStyles,
			x: cursorOffsetX,
			y: cursorOffsetY,
			zoomWindowWidth,
			zoomWindowHeight,
		}));

		if (zoomElement) {
			zoomElement.style.transform = `translate(${cursorOffsetX}px, ${cursorOffsetY}px)`;
		}

		const zoomImageElement = this.zoomImageElement()?.nativeElement;
		if (zoomImageElement) {
			zoomImageElement.style.transform = this.zoomTransformation();
		}
	}

	private setImageDetails(imageElement: HTMLImageElement): void {
		const naturalWidth = imageElement.naturalWidth;
		const naturalHeight = imageElement.naturalHeight;
		const fittedDimensions = this.calculateFittedDimensions(naturalWidth, naturalHeight);
		const width = imageElement.clientWidth || fittedDimensions.width;
		const height = imageElement.clientHeight || fittedDimensions.height;
		const zoomElement = this.zoomElement()?.nativeElement;
		const zoomWindowWidth = zoomElement?.offsetWidth || this.zoomStyles().zoomWindowWidth || 160;
		const zoomWindowHeight = zoomElement?.offsetHeight || this.zoomStyles().zoomWindowHeight || 160;

		this.zoomStyles.update((currentStyles) => ({
			...currentStyles,
			width,
			naturalWidth,
			height,
			naturalHeight,
			zoomWindowWidth,
			zoomWindowHeight,
		}));
	}

	private getNextDisplayObjectIndex(): number | false {
		const nextIndex = this.currentIndex() + 1;
		if (nextIndex > this.data.displayObjects.length - 1) {
			return this.config.loopGallery ? 0 : false;
		}
		return nextIndex;
	}

	private getPreviousDisplayObjectIndex(): number | false {
		const previousIndex = this.currentIndex() - 1;
		if (previousIndex < 0) {
			return this.config.loopGallery ? this.data.displayObjects.length - 1 : false;
		}
		return previousIndex;
	}

	private loadDisplayObject(targetIndex: number): void {
		const targetObject = this.data.displayObjects[targetIndex];
		if (!targetObject) {
			return;
		}

		this.currentIndex.set(targetIndex);

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
						queueMicrotask(() => {
							const videoElementRef = this.videoElement();
							if (videoElementRef?.nativeElement) {
								videoElementRef.nativeElement.load();
							}
						});
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

					const targetDimensions = this.calculateFittedDimensions(naturalWidth, naturalHeight);
					const delayTime = this.isFirstLoad ? 30 : 10;
					this.isFirstLoad = false;

					return timer(delayTime).pipe(
						tap(() => {
							this.wrapperDimensions.set({
								width: `${targetDimensions.width}px`,
								height: `${targetDimensions.height}px`,
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

					queueMicrotask(() => {
						const videoElementRef = this.videoElement();
						if (videoElementRef?.nativeElement) {
							videoElementRef.nativeElement.load();
						}
					});

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
		const maxViewportWidth = typeof window !== 'undefined' ? window.innerWidth * 0.95 : 1200;
		const maxViewportHeight = typeof window !== 'undefined' ? window.innerHeight * 0.85 : 800;
		const captionHeightBudget = 80;
		const maxMediaHeight = Math.max(160, maxViewportHeight - captionHeightBudget);

		const scalingFactor = Math.min(
			maxViewportWidth / naturalWidth,
			maxMediaHeight / naturalHeight,
			1,
		);

		const fittedWidth = Math.round(naturalWidth * scalingFactor);
		const fittedHeight = Math.round(naturalHeight * scalingFactor);

		const minContainerWidth = Math.min(340, maxViewportWidth);
		const finalWidth = Math.max(fittedWidth, minContainerWidth);

		return {
			width: finalWidth,
			height: fittedHeight,
		};
	}

	private prefetchAdjacentObjects(): void {
		if (!this.config.enableImagePreloading) {
			return;
		}
		const nextIndex = this.getNextDisplayObjectIndex();
		if (nextIndex !== false) {
			this.preloadDisplayObject(this.data.displayObjects[nextIndex]!).subscribe();
		}
		const previousIndex = this.getPreviousDisplayObjectIndex();
		if (previousIndex !== false) {
			this.preloadDisplayObject(this.data.displayObjects[previousIndex]!).subscribe();
		}
	}

	private preloadDisplayObject(
		displayObject: TGalleryDisplayObject,
	): Observable<HTMLImageElement | void> {
		if (this.isGalleryImage(displayObject)) {
			if (!this.preloadedImagesCache.has(displayObject.source)) {
				const preloadedImageInstance = new Image();
				this.preloadedImagesCache.set(
					displayObject.source,
					fromEvent(preloadedImageInstance, 'load').pipe(
						map(() => preloadedImageInstance),
						shareReplay({
							bufferSize: 1,
							refCount: true,
						}),
					),
				);
				preloadedImageInstance.src = displayObject.source;
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
