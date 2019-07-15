import { Component } from '@angular/core';

import { LightboxService } from './../Services/lightbox.service';

@Component({
	selector: 'lightbox-root',
	templateUrl: '../Templates/demo.component.html',
	styleUrls: [
		'../Styles/demo.component.scss',
	]
})
export class DemoComponent
{
	constructor(private lightboxService: LightboxService)
	{
	}

	public openLightbox():void
	{
		this.lightboxService.open([
			{source: 'https://image.shutterstock.com/z/stock-photo-two-beach-chairs-on-tropical-vacation-at-sea-1411290431.jpg', copyright: 'https://www.shutterstock.com'},
			{source: 'https://image.shutterstock.com/z/stock-photo-soft-waves-with-foam-of-ocean-on-the-sandy-beach-background-1383401564.jpg', description: 'beach', copyright: 'https://www.shutterstock.com'},
			{source: 'https://gallery.yopriceville.com/var/albums/Backgrounds/Background_Sea_Beach.jpg?m=1432232957', description: 'One huge image O.o', copyright: 'https://gallery.yopriceville.com/Backgrounds/Background_Sea_Beach'},
			{source: 'assets/images/image1.jpg', copyright: 'unknown'},
			{source: 'assets/images/image2.jpg', description: 'test', copyright: 'unknown'},
			{source: 'assets/images/image3.jpg', description: 'test 2', copyright: 'unknown'},
			{source: 'assets/images/image4.jpg', description: 'test 3', copyright: 'unknown'},
			{source: 'assets/images/image5.jpg', copyright: 'unknown'},
		], {
			enableZoom: true,
		});

		return;
	}

}
