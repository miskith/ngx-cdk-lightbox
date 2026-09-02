import { Component, ChangeDetectionStrategy, input, TemplateRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

@Component({
	selector: 'lib-loader',
	templateUrl: 'loader.component.html',
	styleUrl: 'loader.component.scss',
	imports: [NgTemplateOutlet],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderComponent {
	readonly loaderTemplate = input<TemplateRef<unknown> | null>(null);
}
