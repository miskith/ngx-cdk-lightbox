import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { NgxCdkLightboxComponent } from '../components/ngx-cdk-lightbox.component';
import { SafeHtmlPipe } from '../pipes/SafeHtml.pipe';

@NgModule({
	declarations: [NgxCdkLightboxComponent, SafeHtmlPipe],
	imports: [CommonModule, MatProgressSpinnerModule, OverlayModule],
	exports: [NgxCdkLightboxComponent, OverlayModule],
})
export class NgxCdkLightboxModule {}
