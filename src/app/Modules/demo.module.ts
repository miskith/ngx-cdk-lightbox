import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LightboxModule } from './lightbox.module';

import { DemoComponent } from '../Components/demo.component';

@NgModule({
	declarations: [
		DemoComponent,
	],
	imports: [
		BrowserModule,
		LightboxModule,
	],
	providers: [],
	bootstrap: [
		DemoComponent,
	]
})
export class DemoModule
{
}
