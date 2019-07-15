import { Component, Inject, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { SubscriptionLike, Observable, fromEvent } from 'rxjs';

import { LightboxOverlayRef, LIGHTBOX_MODAL_DATA, GalleryDataInterface } from './../Ref/lightboxOverlay.ref';
import { GalleryImageInterface, GalleryConfigInterface } from './../Interfaces/gallery.interface';


@Component({
	selector: 'lib-ngx-cdk-lightbox',
	templateUrl: '../Templates/lightbox.component.html',
	styleUrls: [
		'../Styles/lightbox.component.scss',
	],
})
export class LightboxComponent implements OnDestroy
{
	private currentIndex = 0;
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
	private subscriptions: SubscriptionLike[] = [];
	@ViewChild('imageElement', {static: false}) private imageElement;

	constructor(
		private modalRef: LightboxOverlayRef,
		@Inject(LIGHTBOX_MODAL_DATA) public data: GalleryDataInterface,
	)
	{
		this.currentIndex = Math.max(0, Math.min(this.config.startingIndex, (this.data.photos.length-1)));

		this.loadPhoto();
	}

	ngOnDestroy()
	{
		for (let i=0; i<this.subscriptions.length; i++)
			this.subscriptions[i].unsubscribe();
	}

	get photo():GalleryImageInterface
	{
		return this.data.photos[this.currentIndex];
	}

	get config():GalleryConfigInterface
	{
		return this.data.config;
	}

	get imageCounter():string
	{
		return this.config.imageCounterText.replace(/IMAGE\_INDEX/, ''+(this.currentIndex+1)).replace(/IMAGE\_COUNT/, ''+(this.data.photos.length));
	}

	private getNextIndex(index: number = this.currentIndex):number|false
	{
		const nextIndex = (index+1);
		if (nextIndex>this.data.photos.length-1)
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
				return (this.data.photos.length-1);
			else
				return false;
		}
		else
			return prevIndex;
	}

	@HostListener('document:keyup.arrowright', ['$event'])
	public nextPhoto(event?: KeyboardEvent|MouseEvent) {
		if (event)
			event.preventDefault();

		const index = this.getNextIndex();
		this.currentIndex = (index!==false ? index : (this.data.photos.length-1));
		this.loadPhoto();
	}

	@HostListener('document:keyup.arrowleft', ['$event'])
	public prevPhoto(event?: KeyboardEvent|MouseEvent) {
		if (event)
			event.preventDefault();

		const index = this.getPrevIndex();
		this.currentIndex = (index!==false ? index : 0);
		this.loadPhoto();
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

	private loadPhoto():void
	{
		this.imageLoading = true;

		const subscription = this.preloadPhoto(this.data.photos[this.currentIndex]).subscribe(() => {
			subscription.unsubscribe();
			this.imageLoading = false;
			setTimeout(() => {
				this.setImageDetails(this.imageElement.nativeElement);
			}, 10);

			if (this.config.enableImagePreloading===true)
			{
				const nextIndex = this.getNextIndex();
				if (nextIndex!==false)
					this.preloadPhoto(this.data.photos[nextIndex]);
				const prevIndex = this.getPrevIndex();
				if (prevIndex!==false)
					this.preloadPhoto(this.data.photos[prevIndex]);
			}
		}, error => {
			this.imageLoading = false;
			console.error('Image could not be loaded.');
		});

		return;
	}

	private preloadPhoto(photo: GalleryImageInterface):Observable<Event>
	{
		const image = new Image();
		const observable = fromEvent(image, 'load');
		image.src = photo.source;

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
		if (event.layerX/this.zoomStyles.width<0.5)
			this.prevPhoto();
		else
			this.nextPhoto();

		return;
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
