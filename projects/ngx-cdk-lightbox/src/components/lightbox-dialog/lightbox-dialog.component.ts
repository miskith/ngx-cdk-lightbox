import {
	Component,
	Inject,
	HostListener,
	ViewChild,
	ElementRef,
	inject,
	OnInit,
	DestroyRef,
	ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import {
	Observable,
	fromEvent,
	timer,
	BehaviorSubject,
	shareReplay,
	of,
	map,
	tap,
	switchMap,
} from 'rxjs';

import { IGalleryData } from '../../ref/lightboxOverlay.ref';
import {
	TGalleryDisplayObject,
	IGalleryConfig,
	IGalleryImage,
	IGalleryVideo,
} from '../../interfaces/gallery.interface';
import { SafeHtmlPipe } from '../../pipes/safe-html/safe-html.pipe';
import { LoaderComponent } from '../loader/loader.component';

@Component({
	selector: 'lib-lightbox-dialog',
	templateUrl: 'lightbox-dialog.component.html',
	styleUrl: 'lightbox-dialog.component.scss',
	imports: [CommonModule, SafeHtmlPipe, LoaderComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LightboxDialogComponent implements OnInit {
	displayZoom = false;
	zoomStyles = {
		x: 0,
		y: 0,
		width: 0,
		naturalWidth: 0,
		height: 0,
		naturalHeight: 0,
	};

	@Inject(DIALOG_DATA) readonly data: IGalleryData = inject<IGalleryData>(DIALOG_DATA);

	private readonly modalRef: DialogRef = inject<DialogRef>(DialogRef);
	private readonly destroyRef: DestroyRef = inject<DestroyRef>(DestroyRef);
	private readonly currentIndex$: BehaviorSubject<number | null> = new BehaviorSubject<
		number | null
	>(null);
	private readonly preloadedImages: Map<string, Observable<HTMLImageElement>> = new Map<
		string,
		Observable<HTMLImageElement>
	>();

	readonly config: IGalleryConfig = this.data.config;
	readonly isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	readonly currentDisplayObject$: Observable<TGalleryDisplayObject | null> =
		this.currentIndex$.pipe(
			map((index: number | null) => (index !== null ? this.data.displayObjects[index]! : null)),
		);
	readonly currentImage$: Observable<IGalleryImage | null> = this.currentDisplayObject$.pipe(
		map((displayObject: TGalleryDisplayObject | null) =>
			displayObject && this.isGalleryImage(displayObject) ? displayObject : null,
		),
	);
	readonly currentVideo$: Observable<IGalleryVideo | null> = this.currentDisplayObject$.pipe(
		map((displayObject: TGalleryDisplayObject | null) =>
			displayObject && this.isGalleryVideo(displayObject) ? displayObject : null,
		),
	);

	@ViewChild('videoElement', { static: false }) private videoElement!: ElementRef<HTMLVideoElement>;
	@ViewChild('imageElement', { static: false }) private imageElement!: ElementRef<HTMLImageElement>;

	ngOnInit(): void {
		this.loadDisplayObject(
			Math.max(0, Math.min(this.config.startingIndex, this.data.displayObjects.length - 1)),
		);
	}

	get imageCounter(): string {
		return this.config.imageCounterText
			.replace(/IMAGE\_INDEX/, '' + (this.currentIndex$.value! + 1))
			.replace(/IMAGE\_COUNT/, '' + this.data.displayObjects.length);
	}

	private getNextIndex(): number | false {
		const nextIndex = this.currentIndex$.value! + 1;
		if (nextIndex > this.data.displayObjects.length - 1) {
			if (this.config.loopGallery === true) {
				return 0;
			} else {
				return false;
			}
		} else {
			return nextIndex;
		}
	}

	private getPrevIndex(): number | false {
		const prevIndex = this.currentIndex$.value! - 1;
		if (prevIndex < 0) {
			if (this.config.loopGallery === true) {
				return this.data.displayObjects.length - 1;
			} else {
				return false;
			}
		} else {
			return prevIndex;
		}
	}

	@HostListener('document:keyup.arrowright', ['$event'])
	nextDisplayObject(event?: KeyboardEvent | MouseEvent): void {
		if (event) {
			event.preventDefault();
		}

		const index = this.getNextIndex();
		this.loadDisplayObject(index !== false ? index : this.data.displayObjects.length - 1);
	}

	@HostListener('document:keyup.arrowleft', ['$event'])
	prevDisplayObject(event?: KeyboardEvent | MouseEvent): void {
		if (event) {
			event.preventDefault();
		}

		const index = this.getPrevIndex();
		this.loadDisplayObject(index !== false ? index : 0);
	}

	@HostListener('document:keyup.escape')
	closeModal(): void {
		this.modalRef.close();
	}

	private setImageDetails(image: HTMLImageElement): void {
		this.zoomStyles = {
			...this.zoomStyles,
			...{
				width: image.clientWidth,
				naturalWidth: image.naturalWidth,
				height: image.clientHeight,
				naturalHeight: image.naturalHeight,
			},
		};

		this.switchDisplayZoom();
	}

	private switchDisplayZoom(): void {
		if (
			this.config.zoomSize !== 'originalSize' ||
			this.zoomStyles.width < this.zoomStyles.naturalWidth ||
			this.zoomStyles.height < this.zoomStyles.naturalHeight
		) {
			this.displayZoom = this.config.enableZoom === true;
		} else {
			this.displayZoom = false;
		}
	}

	private loadDisplayObject(index: number): void {
		this.isLoading$.next(true);

		this.animateImage(index)
			.pipe(
				takeUntilDestroyed(this.destroyRef),
				tap(() => this.isLoading$.next(false)),
			)
			.subscribe({
				next: () => {
					setTimeout(() => {
						if (this.imageElement) {
							this.setImageDetails(this.imageElement.nativeElement);
						}

						if (this.videoElement) {
							const videoElementContainer = this.videoElement.nativeElement;
							const video = this.data.displayObjects[this.currentIndex$.value!] as IGalleryVideo;
							if (video.resolution) {
								videoElementContainer.style.aspectRatio = `${video.resolution.width}/${video.resolution.height}`;
							} else {
								videoElementContainer.style.aspectRatio = '';
							}

							this.videoElement.nativeElement.load();
						}
					}, 10);

					if (this.config.enableImagePreloading === true) {
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
				},
			});
	}

	private animateImage(index: number): Observable<unknown> {
		if (this.config.enableAnimations === false || !('source' in this.data.displayObjects[index]!)) {
			this.currentIndex$.next(index);
			return this.preloadDisplayObject(this.data.displayObjects[this.currentIndex$.value!]!);
		} else {
			if (this.imageElement) {
				this.imageElement.nativeElement.style.opacity = '0';
			}

			return this.preloadDisplayObject(this.data.displayObjects[index]!).pipe(
				switchMap((image: HTMLImageElement | void) => {
					if (this.imageElement) {
						this.imageElement.nativeElement.parentElement!.style.width = `${this.imageElement.nativeElement.parentElement!.clientWidth}px`;
						this.imageElement.nativeElement.parentElement!.style.height = `${this.imageElement.nativeElement.parentElement!.clientHeight}px`;
					}
					const naturalWidth = image!.naturalWidth;
					const naturalHeight = image!.naturalHeight;
					const ratio = Math.max(
						naturalWidth / (window.innerWidth * 0.95),
						naturalHeight / (window.innerHeight * 0.85),
						1,
					);
					this.currentIndex$.next(index);

					return timer(1).pipe(
						tap(() => {
							if (this.imageElement) {
								this.imageElement.nativeElement.style.width = '0px';
								this.imageElement.nativeElement.style.height = '0px';
							}
							this.imageElement.nativeElement.parentElement!.style.width = `${naturalWidth / ratio}px`;
							this.imageElement.nativeElement.parentElement!.style.height = `${naturalHeight / ratio}px`;
						}),
						switchMap(() =>
							timer(250).pipe(
								tap(() => {
									this.imageElement.nativeElement.parentElement!.style.width = '';
									this.imageElement.nativeElement.parentElement!.style.height = '';
									this.imageElement.nativeElement.style.width = 'auto';
									this.imageElement.nativeElement.style.height = 'auto';
									this.imageElement.nativeElement.style.opacity = '1';
								}),
							),
						),
					);
				}),
				takeUntilDestroyed(this.destroyRef),
			);
		}
	}

	private preloadDisplayObject(
		displayObject: TGalleryDisplayObject,
	): Observable<HTMLImageElement | void> {
		if (this.isGalleryImage(displayObject)) {
			if (!this.preloadedImages.has(displayObject.source)) {
				const image = new Image();
				this.preloadedImages.set(
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

			return this.preloadedImages.get(displayObject.source)!;
		} else {
			return of(void 0);
		}
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

	imageMouseIn(event: MouseEvent): void {
		this.setImageDetails(event.target as HTMLImageElement);
		this.zoomStyles = {
			...this.zoomStyles,
			...{ x: (event as any).layerX, y: (event as any).layerY },
		};
	}

	imageMouseMove(event: MouseEvent): void {
		this.zoomStyles = {
			...this.zoomStyles,
			...{ x: (event as any).layerX, y: (event as any).layerY },
		};
	}

	imageMouseOut(): void {
		this.displayZoom = false;
	}

	imageClick(event: MouseEvent): void {
		if (this.config.enableImageClick === false) {
			return;
		}

		if ((event as any).layerX / this.zoomStyles.width < 0.5) {
			this.prevDisplayObject();
		} else {
			this.nextDisplayObject();
		}
	}

	checkIsString(value: any): boolean {
		return !!(typeof value === 'string');
	}

	get zoomTransformation(): string {
		if (this.config.zoomSize === 'originalSize') {
			return `translate(${-1 * (this.zoomStyles.x * (this.zoomStyles.naturalWidth / this.zoomStyles.width) - 80)}px, ${-1 * (this.zoomStyles.y * (this.zoomStyles.naturalHeight / this.zoomStyles.height) - 80)}px)`;
		} else {
			return `translate(${-1 * (this.zoomStyles.x * this.config.zoomSize - 80)}px, ${-1 * (this.zoomStyles.y * this.config.zoomSize - 80)}px)`;
		}
	}

	get zoomWidth(): string {
		if (this.config.zoomSize === 'originalSize') {
			return `${this.zoomStyles.naturalWidth}px`;
		} else {
			return `${this.zoomStyles.width * this.config.zoomSize}px`;
		}
	}

	get zoomHeight(): string {
		if (this.config.zoomSize === 'originalSize') {
			return `${this.zoomStyles.naturalHeight}px`;
		} else {
			return `${this.zoomStyles.height * this.config.zoomSize}px`;
		}
	}
}
