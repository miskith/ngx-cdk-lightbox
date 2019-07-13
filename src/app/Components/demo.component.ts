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
			{source: 'assets/images/image1.jpg'},
			{source: 'assets/images/image2.jpg', 'description': 'test'},
			{source: 'assets/images/image3.jpg', 'description': 'test 2'},
			{source: 'assets/images/image4.jpg', 'description': 'test 3'},
			{source: 'assets/images/image5.jpg'},
		]);

		return;
	}

}
