import { bootstrapApplication } from '@angular/platform-browser';
import { HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';

import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
	providers: [
		{
			provide: HIGHLIGHT_OPTIONS,
			useValue: {
				coreLibraryLoader: () => import('highlight.js/lib/core'),
				languages: {
					typescript: () => import('highlight.js/lib/languages/typescript'),
					bash: () => import('highlight.js/lib/languages/bash'),
					json: () => import('highlight.js/lib/languages/json'),
					css: () => import('highlight.js/lib/languages/css'),
				},
			},
		},
	],
}).catch((err) => console.error(err));
