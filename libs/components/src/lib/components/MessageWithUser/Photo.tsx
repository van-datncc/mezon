import {
	ApiMediaExtendedPreview,
	ApiPhoto,
	buildClassName,
	calculateMediaDimensions,
	createImgproxyUrl,
	getMediaFormat,
	getMediaTransferState,
	getPhotoMediaHash,
	IMediaDimensions,
	MIN_MEDIA_HEIGHT,
	ObserveFn,
	SHOW_POSITION,
	useAppLayout,
	useBlurredMediaThumbRef,
	useIsIntersecting,
	useMediaTransition,
	useMediaWithLoadProgress,
	usePreviousDeprecated,
	useShowTransition
} from '@mezon/utils';
import { useCallback, useRef, useState } from 'react';
import { useMessageContextMenu } from '../ContextMenu';

export type OwnProps<T> = {
	id?: string;
	photo: ApiPhoto | ApiMediaExtendedPreview;
	isInWebPage?: boolean;
	messageText?: string;
	isOwn?: boolean;
	observeIntersection?: ObserveFn;
	noAvatars?: boolean;
	canAutoLoad?: boolean;
	isInSelectMode?: boolean;
	isSelected?: boolean;
	uploadProgress?: number;
	forcedWidth?: number;
	size?: 'inline' | 'pictogram';
	shouldAffectAppendix?: boolean;
	dimensions?: IMediaDimensions & { isSmall?: boolean };
	asForwarded?: boolean;
	nonInteractive?: boolean;
	isDownloading?: boolean;
	isProtected?: boolean;
	className?: string;
	clickArg?: T;
	onClick?: (url?: string) => void;
	onContextMenu?: (event: React.MouseEvent<HTMLImageElement>) => void;
	onCancelUpload?: (arg: T) => void;
};
const Photo = <T,>({
	id,
	photo,
	messageText,
	isOwn,
	observeIntersection,
	noAvatars,
	canAutoLoad = true,
	isInSelectMode,
	isSelected,
	uploadProgress,
	forcedWidth,
	size = 'inline',
	dimensions,
	asForwarded,
	nonInteractive,
	shouldAffectAppendix,
	isDownloading,
	isProtected,
	isInWebPage,
	clickArg,
	className,
	onClick,
	onContextMenu
}: OwnProps<T>) => {
	const ref = useRef<HTMLDivElement>(null);
	const isPaidPreview = photo.mediaType === 'extendedMediaPreview';

	const localBlobUrl = (photo as any).blobUrl;

	const isIntersecting = useIsIntersecting(ref, observeIntersection);

	const { setImageURL, setPositionShow } = useMessageContextMenu();

	const { isMobile } = useAppLayout();
	const [isLoadAllowed, setIsLoadAllowed] = useState(canAutoLoad);
	const shouldLoad = isLoadAllowed && isIntersecting;

	const { width, height, isSmall } =
		dimensions ||
		calculateMediaDimensions({
			media: photo,
			isOwn,
			asForwarded,
			noAvatars,
			isMobile,
			messageText,
			isInWebPage
		});
	const { mediaData, loadProgress } = useMediaWithLoadProgress(
		createImgproxyUrl(photo.url ?? '', { width: width, height: height, resizeType: 'fit' }),
		!isIntersecting
	);
	const fullMediaData = localBlobUrl || mediaData;

	const withBlurredBackground = Boolean(forcedWidth);
	const [withThumb] = useState(!fullMediaData);
	const noThumb = Boolean(fullMediaData);
	const thumbRef = useBlurredMediaThumbRef(photo, false);
	useMediaTransition(!noThumb, { ref: thumbRef });
	const blurredBackgroundRef = useBlurredMediaThumbRef(photo, !withBlurredBackground);

	const { loadProgress: downloadProgress } = useMediaWithLoadProgress(
		!isPaidPreview ? getPhotoMediaHash(photo, 'download') : undefined,
		!isDownloading,
		!isPaidPreview ? getMediaFormat(photo, 'download') : undefined
	);

	const { isUploading, isTransferring, transferProgress } = getMediaTransferState(
		uploadProgress || (isDownloading ? downloadProgress : loadProgress),
		shouldLoad && !fullMediaData,
		uploadProgress !== undefined
	);

	const wasLoadDisabled = usePreviousDeprecated(isLoadAllowed) === false;

	const { ref: spinnerRef, shouldRender: shouldRenderSpinner } = useShowTransition({
		isOpen: isTransferring,
		noMountTransition: wasLoadDisabled,
		className: 'slow',
		withShouldRender: true
	});

	const { ref: downloadButtonRef, shouldRender: shouldRenderDownloadButton } = useShowTransition({
		isOpen: !fullMediaData && !isLoadAllowed,
		withShouldRender: true
	});

	const componentClassName = buildClassName(
		'media-inner',
		!isUploading && !nonInteractive && 'interactive',
		isSmall && 'small-image',
		(width === height || size === 'pictogram') && 'square-image',
		height < MIN_MEDIA_HEIGHT && 'fix-min-height',
		className
	);

	const style =
		size === 'inline'
			? {
					height: height ? `${height}px` : 150,
					width: width ? `${width}px` : 'auto',
					...(dimensions && {
						position: 'absolute' as const,
						left: `${dimensions.x}px`,
						top: `${dimensions.y}px`
					})
				}
			: undefined;

	const { width: realWidth, height: realHeight } = photo;
	let displayWidth, displayHeight;

	const originalAspectRatio = realWidth && realHeight ? realWidth / realHeight : 1;

	if (realWidth && realHeight) {
		if (originalAspectRatio > 1) {
			displayHeight = Math.min(height, realHeight);
			displayWidth = Math.round(displayHeight * originalAspectRatio);
			if (displayWidth > width) {
				displayWidth = width;
				displayHeight = Math.round(displayWidth / originalAspectRatio);
			}
		} else {
			displayWidth = Math.min(width, realWidth);
			displayHeight = Math.round(displayWidth / originalAspectRatio);
			if (displayHeight > height) {
				displayHeight = height;
				displayWidth = Math.round(displayHeight * originalAspectRatio);
			}
		}
	} else {
		if (width && height) {
			if (width / height > 1) {
				displayHeight = height;
				displayWidth = Math.min(width, Math.round(height * originalAspectRatio));
			} else {
				displayWidth = width;
				displayHeight = Math.min(height, Math.round(width / originalAspectRatio));
			}
		} else {
			displayWidth = width || 300;
			displayHeight = height || 300;
		}
	}

	displayWidth = Math.min(displayWidth, width || displayWidth);
	displayHeight = Math.min(displayHeight, height || displayHeight);

	const handleContextMenu = useCallback((e: React.MouseEvent<HTMLImageElement>) => {
		setImageURL(photo?.url ?? '');
		setPositionShow(SHOW_POSITION.NONE);
		if (typeof onContextMenu === 'function') {
			onContextMenu(e || {});
		}
	}, []);

	return (
		<div
			id={id}
			ref={ref}
			className={'relative ' + componentClassName}
			style={style}
			onClick={() => {
				onClick?.(photo?.url);
			}}
		>
			{withBlurredBackground && <canvas ref={blurredBackgroundRef} className="thumbnail blurred-bg" />}
			{fullMediaData && (
				<img
					onContextMenu={handleContextMenu}
					src={fullMediaData}
					className={`max-w-full max-h-full w-full h-full block object-cover absolute bottom-0 left-0 z-[1] rounded overflow-hidden cursor-pointer duration-700 ease-in-out ${withBlurredBackground && 'with-blurred-bg'}`}
					alt=""
					style={{ width: displayWidth || forcedWidth || 'auto', height: displayHeight || 'auto' }}
					draggable={!isProtected}
				/>
			)}
			{withThumb && (
				<canvas
					style={{ width: displayWidth, height: displayHeight }}
					ref={thumbRef}
					className="max-w-full max-h-full block object-cover absolute bottom-0 left-0 rounded overflow-hidden "
				/>
			)}
			{isProtected && <span className="protector" />}
			{shouldRenderSpinner && !shouldRenderDownloadButton && (
				<div
					ref={spinnerRef as any}
					style={{ width: displayWidth, height: displayHeight }}
					className={`${!photo.thumbnail?.dataUri ? 'bg-[#0000001c]' : ''} max-w-full max-h-full absolute bottom-0 left-0 flex items-center justify-center bg-muted/30 backdrop-blur-[2px] rounded-md z-[3]`}
					aria-hidden="true"
				>
					<svg
						aria-hidden="true"
						className="w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-white"
						viewBox="0 0 100 101"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
							fill="currentColor"
						/>
						<path
							d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
							fill="currentFill"
						/>
					</svg>
				</div>
			)}
		</div>
	);
};

export default Photo;
