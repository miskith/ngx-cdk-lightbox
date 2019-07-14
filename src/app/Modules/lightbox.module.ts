import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

import { LightboxComponent } from '../Components/lightbox.component';
import { LightboxService } from './../Services/lightbox.service';
import { SafeHtmlPipe } from '../Pipes/SafeHtml.pipe';

@NgModule({
	declarations: [
		LightboxComponent,
		SafeHtmlPipe,
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
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
