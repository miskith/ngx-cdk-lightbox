import { Component, Inject, HostListener } from '@angular/core';

import { LightboxOverlayRef, LIGHTBOX_MODAL_DATA } from './../Ref/lightboxOverlay.ref';
import { GalleryImageInterface, GalleryConfigInterface } from './../Interfaces/gallery.interface';

@Component({
	templateUrl: '../Templates/lightbox.component.html',
	styleUrls: [
		'../Styles/lightbox.component.scss',
	],
})
export class LightboxComponent
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

	constructor(
		private modalRef: LightboxOverlayRef,
		@Inject(LIGHTBOX_MODAL_DATA) public data: {photos: GalleryImageInterface[], config: GalleryConfigInterface},
	)
	{
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

	@HostListener('document:keyup.arrowright', ['$event'])
	public nextPhoto(event?: KeyboardEvent|MouseEvent) {
		if (event)
			event.preventDefault();

		if (this.config.loopGallery===false)
			this.currentIndex = Math.min(this.currentIndex+1, this.data.photos.length-1);
		else
		{
			const index = (this.currentIndex+1);
			if (index>this.data.photos.length-1)
				this.currentIndex = 0;
			else
				this.currentIndex = index;
		}
	}

	@HostListener('document:keyup.arrowleft', ['$event'])
	public prevPhoto(event?: KeyboardEvent|MouseEvent) {
		if (event)
			event.preventDefault();

		if (this.config.loopGallery===false)
			this.currentIndex = Math.max(this.currentIndex-1, 0);
		else
		{
			const index = (this.currentIndex-1);
			if (index<0)
				this.currentIndex = this.data.photos.length-1;
			else
				this.currentIndex = index;
		}
	}

	@HostListener('document:keyup.escape', ['$event'])
	public closeModal()
	{
		this.modalRef.close();
	}

	private setImageDetails():void // ToDO - call after changing image
	{
		this.zoomStyles = {...this.zoomStyles, ...{
			width: (<HTMLImageElement>event.target).clientWidth,
			naturalWidth: (<HTMLImageElement>event.target).naturalWidth,
			height: (<HTMLImageElement>event.target).clientHeight,
			naturalHeight: (<HTMLImageElement>event.target).naturalHeight,
		}};

		return;
	}

	private switchDisplayZoom():void
	{
		if (this.config.zoomSize!=='originalSize' || this.zoomStyles.width<this.zoomStyles.naturalWidth || this.zoomStyles.height<this.zoomStyles.naturalHeight)
			this.displayZoom = (this.config.enableZoom===true);

		return;
	}

	public imageMouseIn(event: MouseEvent):void
	{
		this.setImageDetails();
		this.zoomStyles = {...this.zoomStyles, ...{x: event.layerX, y: event.layerY}};
		this.switchDisplayZoom();

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
