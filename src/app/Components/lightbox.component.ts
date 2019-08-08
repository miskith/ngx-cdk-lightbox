import { Component, Inject, HostListener, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { SubscriptionLike, Observable, fromEvent, timer, combineLatest } from 'rxjs';

import { LightboxOverlayRef, LIGHTBOX_MODAL_DATA, GalleryDataInterface } from './../Ref/lightboxOverlay.ref';
import { GalleryDisplayObjectType, GalleryConfigInterface, GalleryImageInterface, GalleryVideoInterface } from './../Interfaces/gallery.interface';


@Component({
	selector: 'lib-ngx-cdk-lightbox',
	templateUrl: '../Templates/lightbox.component.html',
	styleUrls: [
		'../Styles/lightbox.component.scss',
	],
})
export class LightboxComponent implements OnDestroy
{
	private currentIndex = null;
	public displayZoom = false;
	public zoomStyles = {
		x: 0,
		y: 0,
		width: 0,
		naturalWidth: 0,
		height: 0,
		naturalHeight: 0,
	};
	public imageLoading = true;
	private subscriptions: Map<string, SubscriptionLike> = new Map();
	private preloadedImage: HTMLImageElement;
	@ViewChild('videoElement', {static: false}) private videoElement: ElementRef;
	@ViewChild('imageElement', {static: false}) private imageElement: ElementRef;

	constructor(
		private modalRef: LightboxOverlayRef,
		@Inject(LIGHTBOX_MODAL_DATA) public data: GalleryDataInterface,
	)
	{
		this.loadDisplayObject(Math.max(0, Math.min(this.config.startingIndex, (this.data.displayObjects.length-1))));
	}

	ngOnDestroy()
	{
		this.subscriptions.forEach((subscription)=>{
			subscription.unsubscribe();
		});
	}

	get displayObject():GalleryDisplayObjectType|false
	{
		return (this.currentIndex===null ? false : this.data.displayObjects[this.currentIndex]);
	}

	get displayObjectType():'photo'|'video'|null
	{
		if (this.displayObject===false)
			return null;

		return (('source' in this.displayObject) ? 'photo' : 'video');
	}

	get photo():GalleryImageInterface|null
	{
		return (this.displayObjectType==='photo' ? <GalleryImageInterface>this.displayObject : null);
	}

	get video():GalleryVideoInterface|null
	{
		return (this.displayObjectType==='video' ? <GalleryVideoInterface>this.displayObject : null);
	}

	get config():GalleryConfigInterface
	{
		return this.data.config;
	}

	get imageCounter():string
	{
		return this.config.imageCounterText.replace(/IMAGE\_INDEX/, ''+(this.currentIndex+1)).replace(/IMAGE\_COUNT/, ''+(this.data.displayObjects.length));
	}

	private addSubscription(key: string, subscription: SubscriptionLike):void
	{
		if (this.subscriptions.has(key))
		{
			this.subscriptions.get(key).unsubscribe();
			this.subscriptions.delete(key);
		}

		this.subscriptions.set(key, subscription);

		return;
	}

	private getNextIndex(index: number = this.currentIndex):number|false
	{
		const nextIndex = (index+1);
		if (nextIndex>this.data.displayObjects.length-1)
		{
			if (this.config.loopGallery===true)
				return 0;
			else
				return false;
		}
		else
			return nextIndex;
	}

	private getPrevIndex(index: number = this.currentIndex):number|false
	{
		const prevIndex = (index-1);
		if (prevIndex<0)
		{
			if (this.config.loopGallery===true)
				return (this.data.displayObjects.length-1);
			else
				return false;
		}
		else
			return prevIndex;
	}

	@HostListener('document:keyup.arrowright', ['$event'])
	public nextDisplayObject(event?: KeyboardEvent|MouseEvent) {
		if (event)
			event.preventDefault();

		const index = this.getNextIndex();
		this.loadDisplayObject((index!==false ? index : (this.data.displayObjects.length-1)));
	}

	@HostListener('document:keyup.arrowleft', ['$event'])
	public prevDisplayObject(event?: KeyboardEvent|MouseEvent) {
		if (event)
			event.preventDefault();

		const index = this.getPrevIndex();
		this.loadDisplayObject((index!==false ? index : 0));
	}

	@HostListener('document:keyup.escape', ['$event'])
	public closeModal(event?: KeyboardEvent)
	{
		this.modalRef.close();
	}

	private setImageDetails(image: HTMLImageElement):void
	{
		this.zoomStyles = {...this.zoomStyles, ...{
			width: image.clientWidth,
			naturalWidth: image.naturalWidth,
			height: image.clientHeight,
			naturalHeight: image.naturalHeight,
		}};
		this.switchDisplayZoom();

		return;
	}

	private switchDisplayZoom():void
	{
		if (this.config.zoomSize!=='originalSize' || this.zoomStyles.width<this.zoomStyles.naturalWidth || this.zoomStyles.height<this.zoomStyles.naturalHeight)
			this.displayZoom = (this.config.enableZoom===true);
		else
			this.displayZoom = false;

		return;
	}

	private loadDisplayObject(index: number):void
	{
		this.imageLoading = true;

		this.addSubscription('animatePhoto', this.animatePhoto(index).subscribe(()=>{
			this.imageLoading = false;
			setTimeout(()=>{
				if (this.imageElement)
					this.setImageDetails(this.imageElement.nativeElement);
				if (this.videoElement)
					this.videoElement.nativeElement.load();
			}, 10);

			if (this.config.enableImagePreloading===true)
			{
				const nextIndex = this.getNextIndex();
				if (nextIndex!==false)
					this.preloadDisplayObject(this.data.displayObjects[nextIndex]);
				const prevIndex = this.getPrevIndex();
				if (prevIndex!==false)
					this.preloadDisplayObject(this.data.displayObjects[prevIndex]);
			}
		}, error => {
			this.imageLoading = false;
			console.error('Image could not be loaded.', error);
		}));

		return;
	}

	private animatePhoto(index: number):Observable<any>
	{
		if (this.config.enableAnimations===false || !('source' in this.data.displayObjects[index]))
		{
			this.currentIndex = index;
			return this.preloadDisplayObject(this.data.displayObjects[this.currentIndex]);
		}
		else
		{
			return new Observable((observer)=>{
				if (this.imageElement)
					this.imageElement.nativeElement.style.opacity = 0;
				this.addSubscription('animatePhotoZoomIn', combineLatest(
					this.preloadDisplayObject(this.data.displayObjects[index]),
					timer(400),
				).subscribe(()=>{
					if (this.imageElement)
					{
						this.imageElement.nativeElement.parentElement.style.width = this.imageElement.nativeElement.parentElement.clientWidth+'px';
						this.imageElement.nativeElement.parentElement.style.height = this.imageElement.nativeElement.parentElement.clientHeight+'px';
					}
					const naturalWidth = this.preloadedImage.naturalWidth;
					const naturalHeight = this.preloadedImage.naturalHeight;
					const ratio = Math.max(naturalWidth/(window.innerWidth*0.95), naturalHeight/(window.innerHeight*0.85), 1);
					this.currentIndex = index;
					this.addSubscription('animatePhotoSet', timer(1).subscribe(()=>{
						if (this.imageElement)
						{
							this.imageElement.nativeElement.style.width = 0;
							this.imageElement.nativeElement.style.height = 0;
						}
						this.imageElement.nativeElement.parentElement.style.width = naturalWidth/ratio+'px';
						this.imageElement.nativeElement.parentElement.style.height = naturalHeight/ratio+'px';
						this.addSubscription('animatePhotoZoomOut', timer(250).subscribe(()=>{
							this.imageElement.nativeElement.parentElement.style.width = '';
							this.imageElement.nativeElement.parentElement.style.height = '';
							this.imageElement.nativeElement.style.width = 'auto';
							this.imageElement.nativeElement.style.height = 'auto';
							this.imageElement.nativeElement.style.opacity = 1;
							observer.next();
							observer.complete();
						}));
					}));
				})
			)});
		}
	}

	private preloadDisplayObject(displayObject: GalleryDisplayObjectType):Observable<Event|void>
	{
		let observable;

		if ('source' in displayObject)
		{
			this.preloadedImage = new Image();
			observable = fromEvent(this.preloadedImage, 'load');
			this.preloadedImage.src = displayObject.source;
		}
		else
			observable = Observable.create((observer) => {observer.next(); observer.complete()});

		return observable;
	}

	public imageMouseIn(event: MouseEvent):void
	{
		this.setImageDetails(<HTMLImageElement>event.target);
		this.zoomStyles = {...this.zoomStyles, ...{x: event.layerX, y: event.layerY}};

		return;
	}

	public imageMouseMove(event: MouseEvent):void
	{
		this.zoomStyles = {...this.zoomStyles, ...{x: event.layerX, y: event.layerY}};

		return;
	}

	public imageMouseOut():void
	{
		this.displayZoom = false;

		return;
	}

	public imageClick(event: MouseEvent):void
	{
		if (this.config.enableImageClick===false)
			return;

		if (event.layerX/this.zoomStyles.width<0.5)
			this.prevDisplayObject();
		else
			this.nextDisplayObject();

		return;
	}

	public checkIsString(value: any):boolean
	{
		return !!((typeof value)==='string');
	}

	get zoomTransformation():string
	{
		if (this.config.zoomSize==='originalSize')
			return 'translate('+(-1*(this.zoomStyles.x*(this.zoomStyles.naturalWidth/this.zoomStyles.width)-80))+'px, '+(-1*(this.zoomStyles.y*(this.zoomStyles.naturalHeight/this.zoomStyles.height)-80))+'px)';
		else
			return 'translate('+(-1*(this.zoomStyles.x*this.config.zoomSize-80))+'px, '+(-1*(this.zoomStyles.y*this.config.zoomSize-80))+'px)';
	}

	get zoomWidth():string
	{
		if (this.config.zoomSize==='originalSize')
			return this.zoomStyles.naturalWidth+'px';
		else
			return (this.zoomStyles.width*this.config.zoomSize)+'px';
	}

	get zoomHeight():string
	{
		if (this.config.zoomSize==='originalSize')
			return this.zoomStyles.naturalHeight+'px';
		else
			return (this.zoomStyles.height*this.config.zoomSize)+'px';
	}

}
