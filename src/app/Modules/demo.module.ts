import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { DemoComponent } from '../Components/demo.component';

@NgModule({
	declarations: [
		DemoComponent,
	],
	imports: [
		BrowserModule,
	],
	providers: [],
	bootstrap: [
		DemoComponent,
	]
})
export class DemoModule { }
