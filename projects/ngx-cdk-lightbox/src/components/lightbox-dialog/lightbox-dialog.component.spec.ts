import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Observable } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
	LIGHTBOX_DEFAULT_CONFIG,
	provideLightboxConfig,
} from '../../services/ngx-cdk-lightbox/ngx-cdk-lightbox.service';
import { LightboxDialogComponent } from './lightbox-dialog.component';

describe('LightboxDialogComponent', () => {
	let component: LightboxDialogComponent;
	let fixture: ComponentFixture<LightboxDialogComponent>;

	const mockDialogRef = { close: vi.fn() };
	const mockData = {
		config: {
			startingIndex: 0,
			loopGallery: true,
			enableZoom: true,
			zoomSize: 2,
			i18n: { counter: 'IMAGE_INDEX / IMAGE_COUNT' },
			enableImageClick: true,
		},
		displayObjects: [
			{ type: 'image', source: 'test1.jpg', description: 'Photo 1' },
			{
				type: 'video',
				mp4Source: { 720: 'video-720.mp4', 1080: 'video-1080.mp4' },
				description: 'Video 1',
				resolution: { width: 1920, height: 1080 },
			},
			{ type: 'image', source: 'test3.jpg', description: 'Photo 3' },
		],
	};

	beforeEach(() => {
		TestBed.overrideComponent(LightboxDialogComponent, {
			set: {
				providers: [
					{ provide: DIALOG_DATA, useValue: mockData },
					{ provide: DialogRef, useValue: mockDialogRef },
				],
				imports: [],
				template: '<div></div>',
			},
		});

		fixture = TestBed.createComponent(LightboxDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create the component', () => {
		expect(component).toBeTruthy();
	});

	it('should calculate fitted dimensions correctly preserving aspect ratio', () => {
		const dimensions = (component as any).calculateFittedDimensions(1200, 800);
		expect(dimensions.width).toBeGreaterThan(0);
		expect(dimensions.height).toBeGreaterThan(0);
		expect(Math.round((dimensions.width / dimensions.height) * 100)).toBe(
			Math.round((1200 / 800) * 100),
		);
	});

	it('should compute imageCounter correctly', () => {
		component.currentIndex.set(0);
		expect(component.imageCounter()).toBe('1 / 3');
		component.currentIndex.set(2);
		expect(component.imageCounter()).toBe('3 / 3');
	});

	it('should return null for displayObject when currentIndex is out of bounds', () => {
		component.currentIndex.set(-1);
		expect(component.currentDisplayObject()).toBeNull();
		expect(component.currentImage()).toBeNull();
		expect(component.currentVideo()).toBeNull();
	});

	it('should return currentImage when active item is an image', () => {
		component.currentIndex.set(0);
		expect(component.currentImage()).toEqual(mockData.displayObjects[0]);
		expect(component.currentVideo()).toBeNull();
	});

	it('should return currentVideo and map videoSources for multi-resolution video', () => {
		component.currentIndex.set(1);
		expect(component.currentVideo()).toEqual(mockData.displayObjects[1]);
		expect(component.currentImage()).toBeNull();

		const sources = component.videoSources();
		expect(sources.length).toBe(2);
		expect(sources[0]).toEqual({ size: '720', src: 'video-720.mp4' });
		expect(sources[1]).toEqual({ size: '1080', src: 'video-1080.mp4' });
	});

	it('should map videoSources for string mp4Source', () => {
		(component.data as any).displayObjects[1] = {
			type: 'video',
			mp4Source: 'single-video.mp4',
		};
		component.currentIndex.set(1);
		expect(component.videoSources()).toEqual([{ src: 'single-video.mp4' }]);
	});

	it('should close the modal when closeModal is called', () => {
		component.closeModal();
		expect(mockDialogRef.close).toHaveBeenCalled();
	});

	it('should navigate next and prev with looping enabled', () => {
		component.currentIndex.set(0);
		component.nextDisplayObject();
		expect(component.currentIndex()).toBe(1);

		component.nextDisplayObject();
		expect(component.currentIndex()).toBe(2);

		component.nextDisplayObject();
		expect(component.currentIndex()).toBe(0);

		component.prevDisplayObject();
		expect(component.currentIndex()).toBe(2);
	});

	it('should handle touch swipe gestures (left = next, right = prev)', () => {
		component.currentIndex.set(0);

		// Swipe Left (deltaX = -80) -> Next
		component.touchStart({
			touches: [{ clientX: 150, clientY: 100 }],
		} as unknown as TouchEvent);
		component.touchEnd({
			changedTouches: [{ clientX: 70, clientY: 105 }],
		} as unknown as TouchEvent);
		expect(component.currentIndex()).toBe(1);

		// Swipe Right (deltaX = +80) -> Prev
		component.touchStart({
			touches: [{ clientX: 70, clientY: 100 }],
		} as unknown as TouchEvent);
		component.touchEnd({
			changedTouches: [{ clientX: 150, clientY: 105 }],
		} as unknown as TouchEvent);
		expect(component.currentIndex()).toBe(0);
	});

	it('should ignore vertical scrolling touch gestures', () => {
		component.currentIndex.set(0);
		component.touchStart({
			touches: [{ clientX: 100, clientY: 100 }],
		} as unknown as TouchEvent);
		component.touchEnd({
			changedTouches: [{ clientX: 105, clientY: 250 }],
		} as unknown as TouchEvent);
		expect(component.currentIndex()).toBe(0);
	});

	it('should navigate with imageClick based on click horizontal half', () => {
		component.currentIndex.set(1);
		component.zoomStyles.set({
			width: 200,
			height: 200,
			naturalWidth: 400,
			naturalHeight: 400,
			x: 0,
			y: 0,
		});

		// Click on left half (offsetX = 40 < 100) -> prev
		component.imageClick({ offsetX: 40 } as MouseEvent);
		expect(component.currentIndex()).toBe(0);

		// Click on right half (offsetX = 160 >= 100) -> next
		component.imageClick({ offsetX: 160 } as MouseEvent);
		expect(component.currentIndex()).toBe(1);
	});

	it('should enable zoom based on configuration and dimensions', () => {
		component.currentIndex.set(0);
		component.zoomStyles.set({
			width: 100,
			naturalWidth: 200,
			height: 100,
			naturalHeight: 200,
			x: 0,
			y: 0,
		});
		component.imageOpacity.set(1);
		component.isHoveringImage.set(true);
		(component as any)['config'] = { enableZoom: true, zoomSize: 'originalSize' };
		expect(component.canZoom()).toBeTruthy();
		expect(component.displayZoom()).toBeTruthy();
	});

	it('should not enable zoom if dimensions are equal or smaller in originalSize mode', () => {
		component.currentIndex.set(0);
		component.zoomStyles.set({
			width: 200,
			naturalWidth: 200,
			height: 200,
			naturalHeight: 200,
			x: 0,
			y: 0,
		});
		(component as any)['config'] = { enableZoom: true, zoomSize: 'originalSize' };
		expect(component.canZoom()).toBeFalsy();
	});

	it('should correctly calculate the zoom transformation based on dynamic window size', () => {
		component.zoomStyles.set({
			x: 50,
			y: 50,
			width: 100,
			height: 100,
			naturalWidth: 200,
			naturalHeight: 200,
			zoomWindowWidth: 220,
			zoomWindowHeight: 220,
		});
		(component as any)['config'] = { zoomSize: 'originalSize', enableZoom: true };
		// scale = 200 / 100 = 2; halfZoom = 110; translateX = -1 * (50 * 2 - 110) = 10px
		const transform = component.zoomTransformation();
		expect(transform).toBe('translate(10px, 10px)');
	});

	it('should preload a display object with an image source', () =>
		new Promise((done) => {
			const mockDisplayObject = { type: 'image', source: 'test.jpg' };
			const loadSpy = vi.spyOn(component as any, 'preloadDisplayObject').mockImplementation(
				() =>
					new Observable((observer) => {
						observer.next(new Event('load'));
						observer.complete();
					}),
			);

			(component['preloadDisplayObject'] as any)(mockDisplayObject).subscribe(() => {
				expect(loadSpy).toHaveBeenCalledWith(mockDisplayObject);
				done(void 0);
			});
		}));

	it('should reset zoom styles on imageMouseOut', () => {
		component.isHoveringImage.set(true);
		component.imageMouseOut();
		expect(component.isHoveringImage()).toBeFalsy();
		expect(component.displayZoom()).toBeFalsy();
	});

	it('should set image details on imageMouseIn', () => {
		const mockMouseEvent = {
			target: { clientWidth: 100, clientHeight: 100, naturalWidth: 200, naturalHeight: 200 },
			offsetX: 0,
			offsetY: 0,
		} as unknown as MouseEvent;
		component.imageMouseIn(mockMouseEvent);
		expect(component.zoomStyles().width).toBe(100);
		expect(component.zoomStyles().naturalWidth).toBe(200);
	});

	it('should refit dimensions on window resize', () => {
		component.currentIndex.set(0);
		const mockImageElement = {
			naturalWidth: 800,
			naturalHeight: 600,
			clientWidth: 800,
			clientHeight: 600,
		} as HTMLImageElement;
		(component as any)['imageElement'] = () => ({ nativeElement: mockImageElement });
		component.onWindowResize();
		expect(component.wrapperDimensions().width).not.toBe('0px');
	});

	it('should jump to first and last display object via firstDisplayObject and lastDisplayObject', () => {
		component.lastDisplayObject();
		expect(component.currentIndex()).toBe(2);
		component.firstDisplayObject();
		expect(component.currentIndex()).toBe(0);
	});

	it('should generate correct live announcement text for screen readers', () => {
		component.currentIndex.set(0);
		expect(component.liveAnnouncementText()).toBe('1 / 3. Photo 1');
	});

	it('should correctly calculate boundary slide states when loopGallery is false', () => {
		(component as any)['config'] = { ...component.config, loopGallery: false };
		component.currentIndex.set(0);
		expect(component.isAtFirstSlide()).toBeTruthy();
		expect(component.isAtLastSlide()).toBeFalsy();

		component.currentIndex.set(2);
		expect(component.isAtFirstSlide()).toBeFalsy();
		expect(component.isAtLastSlide()).toBeTruthy();
	});

	it('should provide default lightbox config provider', () => {
		const provider = provideLightboxConfig({ loopGallery: false });
		expect((provider as any).provide).toBe(LIGHTBOX_DEFAULT_CONFIG);
		expect((provider as any).useValue).toEqual({ loopGallery: false });
	});
});
