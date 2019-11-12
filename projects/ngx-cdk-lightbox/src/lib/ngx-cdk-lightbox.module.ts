import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { NgxCdkLightboxComponent } from './ngx-cdk-lightbox.component';
import { NgxCdkLightboxService } from './ngx-cdk-lightbox.service';
import { SafeHtmlPipe } from '../pipes/SafeHtml.pipe';

@NgModule({
	declarations: [
		NgxCdkLightboxComponent,
		SafeHtmlPipe,
	],
	imports: [
		CommonModule,
		MatProgressSpinnerModule,
	],
	providers: [
		NgxCdkLightboxService,
		OverlayModule,
	],
	exports: [
		NgxCdkLightboxComponent,
		OverlayModule,
	],
	entryComponents: [
		NgxCdkLightboxComponent,
	],
})
export class NgxCdkLightboxModule {
}
