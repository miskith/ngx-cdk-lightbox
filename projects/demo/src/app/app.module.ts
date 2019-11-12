import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { HighlightModule } from 'ngx-highlightjs';
import typescript from 'highlight.js/lib/languages/typescript';
import shell from 'highlight.js/lib/languages/shell';

import { NgxCdkLightboxModule } from './../../../ngx-cdk-lightbox/src/public-api';
import { AppComponent } from './app.component';

export function hljsLanguages() {
	return [
		{name: 'typescript', func: typescript},
		{name: 'shell', func: shell},
	];
}

@NgModule({
	declarations: [
		AppComponent,
	],
	imports: [
		BrowserModule,
		NgxCdkLightboxModule,
		MatButtonModule,
		MatTabsModule,
		MatCardModule,
		BrowserAnimationsModule,
		HighlightModule.forRoot({
			languages: hljsLanguages,
		}),
	],
	providers: [],
	bootstrap: [
		AppComponent,
	],
})
export class AppModule {
}
