import { Component, ChangeDetectionStrategy, input, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'lib-loader',
	templateUrl: 'loader.component.html',
	styleUrl: 'loader.component.scss',
	imports: [CommonModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderComponent {
	readonly loaderTemplate = input<TemplateRef<unknown> | null>(null);
}
