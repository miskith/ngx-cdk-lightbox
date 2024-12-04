import { Component, ChangeDetectionStrategy, Input, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'lib-loader',
	templateUrl: 'loader.component.html',
	styleUrl: 'loader.component.scss',
	imports: [CommonModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderComponent {
	@Input() loaderTemplate: TemplateRef<unknown> | null = null;
}
