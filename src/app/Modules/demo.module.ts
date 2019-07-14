import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LightboxModule } from './lightbox.module';
import { MatButtonModule } from '@angular/material/button';

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
	providers: [],
	bootstrap: [
		DemoComponent,
	]
})
export class DemoModule
{
}
