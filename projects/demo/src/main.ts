import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { bootstrapApplication } from '@angular/platform-browser';
import { HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';

import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
	providers: [
		importProvidersFrom([BrowserAnimationsModule]),
		{
			provide: HIGHLIGHT_OPTIONS,
			useValue: {
				coreLibraryLoader: () => import('highlight.js/lib/core'),
				languages: {
					typescript: () => import('highlight.js/lib/languages/typescript'),
					bash: () => import('highlight.js/lib/languages/bash'),
					json: () => import('highlight.js/lib/languages/json'),
				},
			},
		},
	],
}).catch((err) => console.error(err));
