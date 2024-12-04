import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';

import { LoaderComponent } from './loader.component';

describe('LoaderComponent', () => {
	let component: LoaderComponent;
	let fixture: ComponentFixture<LoaderComponent>;

	beforeEach(() => {
		TestBed.overrideComponent(LoaderComponent, {
			remove: {
				imports: [CommonModule],
			},
		}).overrideTemplate(LoaderComponent, '<div></div>');

		fixture = TestBed.createComponent(LoaderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create the component', () => {
		expect(component).toBeTruthy();
	});
});
