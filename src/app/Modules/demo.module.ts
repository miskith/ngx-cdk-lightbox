import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { HighlightModule } from 'ngx-highlightjs';
import typescript from 'highlight.js/lib/languages/typescript';
import shell from 'highlight.js/lib/languages/shell';

//import { LightboxService, LightboxModule } from 'ngx-cdk-lightbox';
import { LightboxService } from '../Services/lightbox.service';
import { LightboxModule } from '../Modules/lightbox.module';
import { DemoComponent } from '../Components/demo.component';

export function hljsLanguages() {
	return [
		{name: 'typescript', func: typescript},
		{name: 'shell', func: shell},
	];
}

@NgModule({
	declarations: [
		DemoComponent,
	],
	imports: [
		BrowserModule,
		LightboxModule,
		MatButtonModule,
		MatTabsModule,
		MatCardModule,
		BrowserAnimationsModule,
		HighlightModule.forRoot({
			languages: hljsLanguages
		}),
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
