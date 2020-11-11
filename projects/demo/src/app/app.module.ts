import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';

import { NgxCdkLightboxModule } from './../../../ngx-cdk-lightbox/src/public-api';
import { AppComponent } from './app.component';

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
		HighlightModule,
	],
	providers: [
		{provide: HIGHLIGHT_OPTIONS, useValue: {
			coreLibraryLoader: () => import('highlight.js/lib/core'),
			languages: {
				typescript: () => import('highlight.js/lib/languages/typescript'),
				shell: () => import('highlight.js/lib/languages/shell'),
			},
		}}
	],
	bootstrap: [
		AppComponent,
	],
})
export class AppModule {
}
