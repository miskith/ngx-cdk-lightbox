import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { first, Observable } from 'rxjs';
import { describe, beforeEach, it, expect, vi } from 'vitest';

import { LightboxDialogComponent } from './lightbox-dialog.component';
import { LoaderComponent } from '../loader/loader.component';
import { SafeHtmlPipe } from '../../pipes/safe-html/safe-html.pipe';

describe('LightboxDialogComponent', () => {
	let component: LightboxDialogComponent;
	let fixture: ComponentFixture<LightboxDialogComponent>;

	const mockDialogRef = { close: vi.fn() };
	const mockData = {
		config: { startingIndex: 0, loopGallery: true, enableZoom: true, zoomSize: 2 },
		displayObjects: [
			{ type: 'image', source: 'test.jpg' },
			{ type: 'image', source: 'test2.jpg' },
			{ type: 'image', source: 'test3.jpg' },
		],
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [provideZonelessChangeDetection()],
		})
			.overrideComponent(LightboxDialogComponent, {
				add: {
					providers: [
						{ provide: DIALOG_DATA, useValue: mockData },
						{ provide: DialogRef, useValue: mockDialogRef },
					],
				},
				remove: {
					imports: [CommonModule, SafeHtmlPipe, LoaderComponent],
				},
			})
			.overrideTemplate(LightboxDialogComponent, '<div></div>');

		fixture = TestBed.createComponent(LightboxDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create the component', () => {
		expect(component).toBeTruthy();
	});

	it('should return null for displayObject when currentIndex is null', () =>
		new Promise((done) => {
			(component as any).currentIndex$.next(null);
			component.currentDisplayObject$.pipe(first()).subscribe((currentDisplayObject) => {
				expect(currentDisplayObject).toBeNull();
				done(void 0);
			});
		}));

	it('should return the current display object when currentIndex is set', () =>
		new Promise((done) => {
			(component as any).currentIndex$.next(0);
			component.currentDisplayObject$.pipe(first()).subscribe((currentDisplayObject) => {
				expect(currentDisplayObject).toEqual(mockData.displayObjects[0]);
				done(void 0);
			});
		}));

	it('should close the modal when closeModal is called', () => {
		component.closeModal();
		expect(mockDialogRef.close).toHaveBeenCalled();
	});

	it('should toggle zoom display based on configuration', () => {
		component['zoomStyles'] = {
			width: 100,
			naturalWidth: 200,
			height: 100,
			naturalHeight: 200,
			x: 0,
			y: 0,
		};
		(component as any)['config'] = { enableZoom: true, zoomSize: 'originalSize' };
		component['switchDisplayZoom']();
		expect(component.displayZoom).toBeTruthy();
	});

	it('should not enable zoom if dimensions are equal or smaller', () => {
		component['zoomStyles'] = {
			width: 200,
			naturalWidth: 200,
			height: 200,
			naturalHeight: 200,
			x: 0,
			y: 0,
		};
		(component as any)['config'] = { enableZoom: true, zoomSize: 'originalSize' };
		component['switchDisplayZoom']();
		expect(component.displayZoom).toBeFalsy();
	});

	it('should correctly calculate the zoom transformation', () => {
		component['zoomStyles'] = {
			x: 50,
			y: 50,
			width: 100,
			height: 100,
			naturalWidth: 200,
			naturalHeight: 200,
		};
		(component as any)['config'] = { zoomSize: 'originalSize', enableZoom: true };
		const transform = component.zoomTransformation;
		expect(transform).toContain('translate');
	});

	it('should preload a display object with an image source', () =>
		new Promise((done) => {
			const mockDisplayObject = { type: 'image', source: 'test.jpg' };
			const loadSpy = vi.spyOn(component as any, 'preloadDisplayObject').mockImplementation(() => {
				return new Observable((observer) => {
					observer.next(new Event('load'));
					observer.complete();
				});
			});

			(component['preloadDisplayObject'] as any)(mockDisplayObject).subscribe(() => {
				expect(loadSpy).toHaveBeenCalledWith(mockDisplayObject);
				done(void 0);
			});
		}));

	it('should reset zoom styles on imageMouseOut', () => {
		component.imageMouseOut();
		expect(component.displayZoom).toBeFalsy();
	});

	it('should set image details on imageMouseIn', () => {
		const mockEvent = {
			target: { clientWidth: 100, clientHeight: 100, naturalWidth: 200, naturalHeight: 200 },
		} as unknown as MouseEvent;
		component.imageMouseIn(mockEvent);
		expect(component['zoomStyles'].width).toBe(100);
		expect(component['zoomStyles'].naturalWidth).toBe(200);
	});
});
