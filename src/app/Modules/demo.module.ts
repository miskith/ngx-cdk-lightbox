import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { LightboxService, LightboxModule } from 'ngx-cdk-lightbox';
import { DemoComponent } from '../Components/demo.component';

@NgModule({
	declarations: [
		DemoComponent,
	],
	imports: [
		BrowserModule,
		LightboxModule,
		MatButtonModule,
	],
	providers: [
		LightboxService,
	],
	bootstrap: [
		DemoComponent,
	]
})
export class DemoModule
{
}
