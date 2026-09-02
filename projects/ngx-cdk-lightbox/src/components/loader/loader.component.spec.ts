import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { LoaderComponent } from './loader.component';

describe('LoaderComponent', () => {
	let component: LoaderComponent;
	let fixture: ComponentFixture<LoaderComponent>;

	beforeEach(() => {
		TestBed.overrideComponent(LoaderComponent, {
			set: {
				imports: [],
				template: `
					<div class="loader" role="status" aria-live="polite">
						<span class="loader__sr-only">{{ loadingText() }}</span>
						<div class="loader__spinner" aria-hidden="true"></div>
					</div>
				`,
			},
		});

		fixture = TestBed.createComponent(LoaderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create the component', () => {
		expect(component).toBeTruthy();
	});

	it('should have default loadingText', () => {
		expect(component.loadingText()).toBe('Loading gallery media...');
		const compiledElement = fixture.nativeElement as HTMLElement;
		const screenReaderElement = compiledElement.querySelector('.loader__sr-only');
		expect(screenReaderElement?.textContent).toBe('Loading gallery media...');
	});

	it('should render custom loadingText when provided', () => {
		fixture.componentRef.setInput('loadingText', 'Cargando contenido...');
		fixture.detectChanges();
		const compiledElement = fixture.nativeElement as HTMLElement;
		const screenReaderElement = compiledElement.querySelector('.loader__sr-only');
		expect(screenReaderElement?.textContent).toBe('Cargando contenido...');
	});
});
