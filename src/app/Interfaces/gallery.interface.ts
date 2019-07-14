export interface GalleryImageInterface
{
	source: string;
	description?: string;
}

export interface GalleryConfigInterface
{
	enableZoom?: boolean;
	zoomSize?: number|'originalSize';
	enableImageClick?: boolean;
	loopGallery?: boolean;
	enableImageCounter?: boolean;
	imageCounterText?: string;
}
