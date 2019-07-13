import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { LightboxComponent } from '../Components/lightbox.component';
import { LightboxService } from './../Services/lightbox.service';

@NgModule({
	declarations: [
		LightboxComponent,
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
	],
	providers: [
		LightboxService,
		MatDialogModule,
	],
	exports: [
		MatDialogModule,
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
