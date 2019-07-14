import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PipeTransform, Pipe } from '@angular/core';

@Pipe({name: 'safeHtml'})
export class SafeHtmlPipe implements PipeTransform
{
	constructor(private sanitizer: DomSanitizer)
	{
	}

	transform(html: string):SafeHtml
	{
		return this.sanitizer.bypassSecurityTrustHtml(html);
	}

}
