import {
	Component,
	ChangeDetectionStrategy,
	ElementRef,
	viewChild,
	HostListener,
	OnInit,
	DestroyRef,
	NgZone,
	Injector,
	inject,
	signal,
	computed,
	effect,
} from '@angular/core';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import {
	Observable,
	Subscription,
	fromEvent,
	timer,
	of,
	map,
	tap,
	switchMap,
	catchError,
	shareReplay,
} from 'rxjs';

import {
	TGalleryDisplayObject,
	IGalleryConfig,
	IGalleryImage,
	IGalleryVideo,
	IGalleryData,
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
}

interface IVideoSourceItem {
	src: string;
	size?: string;
}

@Component({
	selector: 'lib-lightbox-dialog',
	templateUrl: 'lightbox-dialog.component.html',
	styleUrl: 'lightbox-dialog.component.scss',
	imports: [CommonModule, NgTemplateOutlet, SafeHtmlPipe, LoaderComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
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

	readonly currentIndex = signal<number>(0);
	readonly isLoading = signal<boolean>(false);
	readonly displayZoom = signal<boolean>(false);
	readonly zoomStyles = signal<IZoomStyles>({
		x: 0,
		y: 0,
		width: 0,
		naturalWidth: 0,
		height: 0,
		naturalHeight: 0,
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

	readonly imageCounter = computed<string>(() => {
		return this.config.imageCounterText
			.replace(/IMAGE_INDEX/, String(this.currentIndex() + 1))
			.replace(/IMAGE_COUNT/, String(this.data.displayObjects.length));
	});

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
		const { x, y, width, naturalWidth, height, naturalHeight } = this.zoomStyles();
		if (this.config.zoomSize === 'originalSize') {
			const translateX = -1 * (x * (width > 0 ? naturalWidth / width : 1) - 80);
			const translateY = -1 * (y * (height > 0 ? naturalHeight / height : 1) - 80);
			return `translate(${translateX}px, ${translateY}px)`;
		}
		const scale = this.config.zoomSize;
		return `translate(${-1 * (x * scale - 80)}px, ${-1 * (y * scale - 80)}px)`;
	});

	readonly zoomWidth = computed<string>(() => {
		const { width, naturalWidth } = this.zoomStyles();
		return this.config.zoomSize === 'originalSize'
			? `${naturalWidth}px`
			: `${width * this.config.zoomSize}px`;
	});

	readonly zoomHeight = computed<string>(() => {
		const { height, naturalHeight } = this.zoomStyles();
		return this.config.zoomSize === 'originalSize'
			? `${naturalHeight}px`
			: `${height * this.config.zoomSize}px`;
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

	@HostListener('document:keyup.arrowright', ['$event'])
	nextDisplayObject(event?: Event): void {
		if (event) {
			event.preventDefault();
		}
		const index = this.getNextIndex();
		this.loadDisplayObject(index !== false ? index : this.data.displayObjects.length - 1);
	}

	@HostListener('document:keyup.arrowleft', ['$event'])
	prevDisplayObject(event?: Event): void {
		if (event) {
			event.preventDefault();
		}
		const index = this.getPrevIndex();
		this.loadDisplayObject(index !== false ? index : 0);
	}

	@HostListener('document:keyup.escape')
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
		this.setImageDetails(event.target as HTMLImageElement);
		const offsetX = event.offsetX ?? 0;
		const offsetY = event.offsetY ?? 0;
		this.zoomStyles.update((current) => ({
			...current,
			x: offsetX,
			y: offsetY,
		}));
	}

	imageMouseMove(event: MouseEvent): void {
		this.updateZoomPosition(event);
	}

	imageMouseOut(): void {
		this.displayZoom.set(false);
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
		const offsetX = event.offsetX ?? 0;
		const offsetY = event.offsetY ?? 0;

		this.zoomStyles.update((current) => ({
			...current,
			x: offsetX,
			y: offsetY,
		}));

		const zoomElement = this.zoomElement()?.nativeElement;
		if (zoomElement) {
			zoomElement.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
		}

		const zoomImageElement = this.zoomImageElement()?.nativeElement;
		if (zoomImageElement) {
			zoomImageElement.style.transform = this.zoomTransformation();
		}
	}

	private setImageDetails(imageElement: HTMLImageElement): void {
		this.zoomStyles.update((current) => ({
			...current,
			width: imageElement.clientWidth,
			naturalWidth: imageElement.naturalWidth,
			height: imageElement.clientHeight,
			naturalHeight: imageElement.naturalHeight,
		}));

		this.switchDisplayZoom();
	}

	private switchDisplayZoom(): void {
		const styles = this.zoomStyles();
		const canZoom =
			this.config.zoomSize !== 'originalSize' ||
			styles.width < styles.naturalWidth ||
			styles.height < styles.naturalHeight;

		this.displayZoom.set(this.config.enableZoom && canZoom);
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
		this.isLoading.set(true);

		this.animateImage(index)
			.pipe(
				takeUntilDestroyed(this.destroyRef),
				tap(() => this.isLoading.set(false)),
			)
			.subscribe({
				next: () => {
					setTimeout(() => {
						const imageElementRef = this.imageElement();
						if (imageElementRef?.nativeElement) {
							this.setImageDetails(imageElementRef.nativeElement);
						}

						const videoElementRef = this.videoElement();
						if (videoElementRef?.nativeElement) {
							const videoElementContainer = videoElementRef.nativeElement;
							const video = this.currentVideo();
							if (video?.resolution) {
								videoElementContainer.style.aspectRatio = `${video.resolution.width}/${video.resolution.height}`;
							} else {
								videoElementContainer.style.aspectRatio = '';
							}
							videoElementContainer.load();
						}
					}, 10);

					if (this.config.enableImagePreloading) {
						const nextIndex = this.getNextIndex();
						if (nextIndex !== false) {
							this.preloadDisplayObject(this.data.displayObjects[nextIndex]!).subscribe();
						}
						const prevIndex = this.getPrevIndex();
						if (prevIndex !== false) {
							this.preloadDisplayObject(this.data.displayObjects[prevIndex]!).subscribe();
						}
					}
				},
				error: (error) => {
					console.error('Image could not be loaded.', error);
					this.isLoading.set(false);
				},
			});
	}

	private animateImage(index: number): Observable<unknown> {
		if (!this.config.enableAnimations || !('source' in this.data.displayObjects[index]!)) {
			this.currentIndex.set(index);
			return this.preloadDisplayObject(this.data.displayObjects[this.currentIndex()]!);
		}

		const imageElement = this.imageElement()?.nativeElement;
		if (imageElement) {
			imageElement.style.opacity = '0';
		}

		return this.preloadDisplayObject(this.data.displayObjects[index]!).pipe(
			catchError((error) => {
				console.error('Image preload error:', error);
				return of(void 0);
			}),
			switchMap((preloadedImage: HTMLImageElement | void) => {
				const parentElement = this.imageElement()?.nativeElement?.parentElement;
				if (parentElement) {
					parentElement.style.width = `${parentElement.clientWidth}px`;
					parentElement.style.height = `${parentElement.clientHeight}px`;
				}
				const naturalWidth = preloadedImage ? preloadedImage.naturalWidth : 0;
				const naturalHeight = preloadedImage ? preloadedImage.naturalHeight : 0;
				const ratio = Math.max(
					naturalWidth / (window.innerWidth * 0.95),
					naturalHeight / (window.innerHeight * 0.85),
					1,
				);
				this.currentIndex.set(index);

				return timer(1).pipe(
					tap(() => {
						const currentImageElement = this.imageElement()?.nativeElement;
						if (currentImageElement?.parentElement) {
							currentImageElement.style.width = '0px';
							currentImageElement.style.height = '0px';
							currentImageElement.parentElement.style.width = `${naturalWidth / ratio}px`;
							currentImageElement.parentElement.style.height = `${naturalHeight / ratio}px`;
						}
					}),
					switchMap(() =>
						timer(250).pipe(
							tap(() => {
								const currentImageElement = this.imageElement()?.nativeElement;
								if (currentImageElement?.parentElement) {
									currentImageElement.parentElement.style.width = '';
									currentImageElement.parentElement.style.height = '';
									currentImageElement.style.width = 'auto';
									currentImageElement.style.height = 'auto';
									currentImageElement.style.opacity = '1';
								}
							}),
						),
					),
				);
			}),
			takeUntilDestroyed(this.destroyRef),
		);
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
