import {
	Component,
	Inject,
	HostListener,
	OnDestroy,
	ViewChild,
	/*, ChangeDetectionStrategy*/ ElementRef,
} from '@angular/core';
import {
	SubscriptionLike,
	Observable,
	fromEvent,
	timer,
	combineLatest,
	BehaviorSubject,
} from 'rxjs';

import {
	LightboxOverlayRef,
	LIGHTBOX_MODAL_DATA,
	GalleryDataInterface,
} from '../ref/lightboxOverlay.ref';
import {
	GalleryDisplayObjectType,
	GalleryConfigInterface,
	GalleryImageInterface,
	GalleryVideoInterface,
} from '../interfaces/gallery.interface';

@Component({
	selector: 'lib-ngx-cdk-lightbox',
	templateUrl: 'ngx-cdk-lightbox.component.html',
	styleUrl: 'ngx-cdk-lightbox.component.scss',
	// changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxCdkLightboxComponent implements OnDestroy {
	private currentIndex: number = null;
	public displayZoom = false;
	public zoomStyles = {
		x: 0,
		y: 0,
		width: 0,
		naturalWidth: 0,
		height: 0,
		naturalHeight: 0,
	};
	public readonly config: GalleryConfigInterface = this.data.config;
	private readonly loadingStateBehaviour = new BehaviorSubject(false);
	public readonly loadingState$ = this.loadingStateBehaviour.asObservable();
	private subscriptions: Map<string, SubscriptionLike> = new Map();
	private preloadedImage: HTMLImageElement;
	@ViewChild('videoElement', { static: false }) private videoElement: ElementRef<HTMLVideoElement>;
	@ViewChild('imageElement', { static: false }) private imageElement: ElementRef<HTMLImageElement>;

	constructor(
		private readonly modalRef: LightboxOverlayRef,
		@Inject(LIGHTBOX_MODAL_DATA) public readonly data: GalleryDataInterface,
	) {
		this.loadDisplayObject(
			Math.max(0, Math.min(this.config.startingIndex, this.data.displayObjects.length - 1)),
		);
	}

	ngOnDestroy(): void {
		this.subscriptions.forEach((subscription) => subscription.unsubscribe());
	}

	get displayObject(): GalleryDisplayObjectType {
		return this.currentIndex === null ? null : this.data.displayObjects[this.currentIndex];
	}

	get image(): GalleryImageInterface | null {
		return this.displayObject && this.displayObject.type === 'image' ? this.displayObject : null;
	}

	get video(): GalleryVideoInterface | null {
		return this.displayObject && this.displayObject.type === 'video' ? this.displayObject : null;
	}

	get imageCounter(): string {
		return this.config.imageCounterText
			.replace(/IMAGE\_INDEX/, '' + (this.currentIndex + 1))
			.replace(/IMAGE\_COUNT/, '' + this.data.displayObjects.length);
	}

	private addSubscription(key: string, subscription: SubscriptionLike): void {
		if (this.subscriptions.has(key)) {
			this.subscriptions.get(key).unsubscribe();
			this.subscriptions.delete(key);
		}

		this.subscriptions.set(key, subscription);
	}

	private getNextIndex(index: number = this.currentIndex): number | false {
		const nextIndex = index + 1;
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

	private getPrevIndex(index: number = this.currentIndex): number | false {
		const prevIndex = index - 1;
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
	public nextDisplayObject(event?: KeyboardEvent | MouseEvent): void {
		if (event) {
			event.preventDefault();
		}

		const index = this.getNextIndex();
		this.loadDisplayObject(index !== false ? index : this.data.displayObjects.length - 1);
	}

	@HostListener('document:keyup.arrowleft', ['$event'])
	public prevDisplayObject(event?: KeyboardEvent | MouseEvent): void {
		if (event) {
			event.preventDefault();
		}

		const index = this.getPrevIndex();
		this.loadDisplayObject(index !== false ? index : 0);
	}

	@HostListener('document:keyup.escape')
	public closeModal(): void {
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
		this.loadingStateBehaviour.next(true);

		this.addSubscription(
			'animateImage',
			this.animateImage(index).subscribe(
				() => {
					this.loadingStateBehaviour.next(false);
					setTimeout(() => {
						if (this.imageElement) {
							this.setImageDetails(this.imageElement.nativeElement);
						}

						if (this.videoElement) {
							const videoElementContainer = this.videoElement.nativeElement;
							if (this.video && this.video.resolution) {
								videoElementContainer.style.aspectRatio = `${ this.video.resolution.width }/${ this.video.resolution.height }`;
							} else {
								videoElementContainer.style.aspectRatio = '';
							}

							this.videoElement.nativeElement.load();
						}
					}, 10);

					if (this.config.enableImagePreloading === true) {
						const nextIndex = this.getNextIndex();
						if (nextIndex !== false) this.preloadDisplayObject(this.data.displayObjects[nextIndex]);
						const prevIndex = this.getPrevIndex();
						if (prevIndex !== false) this.preloadDisplayObject(this.data.displayObjects[prevIndex]);
					}
				},
				(error) => {
					this.loadingStateBehaviour.next(false);
					console.error('Image could not be loaded.', error);
				},
			),
		);
	}

	private animateImage(index: number): Observable<any> {
		if (this.config.enableAnimations === false || !('source' in this.data.displayObjects[index])) {
			this.currentIndex = index;
			return this.preloadDisplayObject(this.data.displayObjects[this.currentIndex]);
		} else {
			return new Observable((observer) => {
				if (this.imageElement) this.imageElement.nativeElement.style.opacity = '0';
				this.addSubscription(
					'animateImageZoomIn',
					combineLatest([
						this.preloadDisplayObject(this.data.displayObjects[index]),
						timer(400),
					]).subscribe(() => {
						if (this.imageElement) {
							this.imageElement.nativeElement.parentElement.style.width =
								this.imageElement.nativeElement.parentElement.clientWidth + 'px';
							this.imageElement.nativeElement.parentElement.style.height =
								this.imageElement.nativeElement.parentElement.clientHeight + 'px';
						}
						const naturalWidth = this.preloadedImage.naturalWidth;
						const naturalHeight = this.preloadedImage.naturalHeight;
						const ratio = Math.max(
							naturalWidth / (window.innerWidth * 0.95),
							naturalHeight / (window.innerHeight * 0.85),
							1,
						);
						this.currentIndex = index;
						timer(1).subscribe(() => {
							if (this.imageElement) {
								this.imageElement.nativeElement.style.width = '0px';
								this.imageElement.nativeElement.style.height = '0px';
							}
							this.imageElement.nativeElement.parentElement.style.width =
								naturalWidth / ratio + 'px';
							this.imageElement.nativeElement.parentElement.style.height =
								naturalHeight / ratio + 'px';
							this.addSubscription(
								'animateImageZoomOut',
								timer(250).subscribe(() => {
									this.imageElement.nativeElement.parentElement.style.width = '';
									this.imageElement.nativeElement.parentElement.style.height = '';
									this.imageElement.nativeElement.style.width = 'auto';
									this.imageElement.nativeElement.style.height = 'auto';
									this.imageElement.nativeElement.style.opacity = '1';
									observer.next();
									observer.complete();
								}),
							);
						});
					}),
				);
			});
		}
	}

	private preloadDisplayObject(displayObject: GalleryDisplayObjectType): Observable<Event | void> {
		let observable: Observable<Event | void>;

		if ('source' in displayObject) {
			this.preloadedImage = new Image();
			observable = fromEvent(this.preloadedImage, 'load');
			this.preloadedImage.src = displayObject.source;
		} else {
			observable = new Observable((observer) => {
				observer.next();
				observer.complete();
			});
		}

		return observable;
	}

	public imageMouseIn(event: MouseEvent): void {
		this.setImageDetails(event.target as HTMLImageElement);
		this.zoomStyles = {
			...this.zoomStyles,
			...{ x: (event as any).layerX, y: (event as any).layerY },
		};
	}

	public imageMouseMove(event: MouseEvent): void {
		this.zoomStyles = {
			...this.zoomStyles,
			...{ x: (event as any).layerX, y: (event as any).layerY },
		};
	}

	public imageMouseOut(): void {
		this.displayZoom = false;
	}

	public imageClick(event: MouseEvent): void {
		if (this.config.enableImageClick === false) {
			return;
		}

		if ((event as any).layerX / this.zoomStyles.width < 0.5) {
			this.prevDisplayObject();
		} else {
			this.nextDisplayObject();
		}
	}

	public checkIsString(value: any): boolean {
		return !!(typeof value === 'string');
	}

	get zoomTransformation(): string {
		if (this.config.zoomSize === 'originalSize') {
			return (
				'translate(' +
				-1 * (this.zoomStyles.x * (this.zoomStyles.naturalWidth / this.zoomStyles.width) - 80) +
				'px, ' +
				-1 * (this.zoomStyles.y * (this.zoomStyles.naturalHeight / this.zoomStyles.height) - 80) +
				'px)'
			);
		} else {
			return (
				'translate(' +
				-1 * (this.zoomStyles.x * this.config.zoomSize - 80) +
				'px, ' +
				-1 * (this.zoomStyles.y * this.config.zoomSize - 80) +
				'px)'
			);
		}
	}

	get zoomWidth(): string {
		if (this.config.zoomSize === 'originalSize') {
			return this.zoomStyles.naturalWidth + 'px';
		} else {
			return this.zoomStyles.width * this.config.zoomSize + 'px';
		}
	}

	get zoomHeight(): string {
		if (this.config.zoomSize === 'originalSize') {
			return this.zoomStyles.naturalHeight + 'px';
		} else {
			return this.zoomStyles.height * this.config.zoomSize + 'px';
		}
	}
}
