import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

import { LightboxComponent } from '../Components/lightbox.component';
import { LightboxService } from './../Services/lightbox.service';
import { SafeHtmlPipe } from '../Pipes/SafeHtml.pipe';

@NgModule({
	declarations: [
		LightboxComponent,
		SafeHtmlPipe,
	],
	imports: [
		CommonModule,
		MatProgressSpinnerModule,
	],
	providers: [
		LightboxService,
		OverlayModule,
	],
	exports: [
		OverlayModule,
	],
	bootstrap: [
		LightboxComponent,
	],
	entryComponents: [
		LightboxComponent,
	],
})
export class LightboxModule
{
}
