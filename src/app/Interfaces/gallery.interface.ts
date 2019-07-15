export interface GalleryImageInterface
{
	source: string;
	description?: string;
	copyright?: string;
}

export interface GalleryConfigInterface
{
	enableZoom?: boolean;
	zoomSize?: number|'originalSize';
	enableImageClick?: boolean;
	loopGallery?: boolean;
	enableImageCounter?: boolean;
	imageCounterText?: string;
	enableCloseIcon?: boolean;
	closeIcon?: string;
	enableArrows?: boolean;
	arrowRight?: string;
	arrowLeft?: string;
}

export const closeIconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';
export const arrowLeftSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/><path fill="none" d="M0 0h24v24H0V0z"/></svg>';
export const arrowRightSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/><path fill="none" d="M0 0h24v24H0V0z"/></svg>';
