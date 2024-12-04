import { PipeTransform, Pipe, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
	name: 'safeHtml',
	standalone: true,
})
export class SafeHtmlPipe implements PipeTransform {
	private readonly sanitizer: DomSanitizer = inject<DomSanitizer>(DomSanitizer);

	transform(html: string): SafeHtml {
		return this.sanitizer.bypassSecurityTrustHtml(html);
	}
}
