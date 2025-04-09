import { Metrics, size, useTheme } from '@mezon/mobile-ui';
import { EMimeTypes, createImgproxyUrl } from '@mezon/utils';
import * as Sentry from '@sentry/react-native';
import React, { useCallback, useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { getAspectRatioSize, useImageResolution } from 'react-native-zoom-toolkit';
import ImageNative from '../../../../../components/ImageNative';
import useTabletLandscape from '../../../../../hooks/useTabletLandscape';
import { style } from './styles';

const widthMedia = Metrics.screenWidth - 150;
const heightMedia = Metrics.screenHeight * 0.3;

type ImageProps = {
	url: string;
	width?: number;
	height?: number;
	filetype?: string;
};

type RenderImageProps = {
	image: ImageProps;
	index: number;
	disable?: boolean;
	onPress: (image: ImageProps) => void;
	onLongPress?: () => void;
	isMultiple?: boolean;
	remainingImagesCount?: number;
	isTablet?: boolean;
};

type ImageSize = {
	width: number;
	height: number;
};

type ImageProxyResult = {
	isProxyImage: boolean;
	url: string;
};

const RenderImageChat = React.memo(({ image, index, disable, onPress, onLongPress, isMultiple = false, remainingImagesCount }: RenderImageProps) => {
	const isTabletLandscape = useTabletLandscape();
	const [loadError, setLoadError] = useState(false);
	const [retryCount, setRetryCount] = useState(0);
	const MAX_RETRY_COUNT = 2;

	const handleImageError = useCallback(
		(error: any) => {
			console.error('Image loading failed:', error, image.url);
			Sentry.captureException(error, {
				tags: {
					component: 'RenderImageChat',
					imageUrl: image.url
				},
				extra: {
					imageDetails: image,
					retryCount
				}
			});

			if (retryCount < MAX_RETRY_COUNT) {
				setRetryCount((prev) => prev + 1);
				setLoadError(false);
			} else {
				setLoadError(true);
			}
		},
		[image, retryCount]
	);

	const imageSize = useMemo(
		() => getImageSize({ height: image?.height, width: image?.width, url: image?.url }),
		[image?.height, image?.url, image?.width]
	);

	if (loadError) {
		return null;
	}

	return (
		<ImageRenderer
			image={image}
			imageSize={imageSize}
			index={index}
			disable={disable}
			onPress={onPress}
			onLongPress={onLongPress}
			isMultiple={isMultiple}
			remainingImagesCount={remainingImagesCount}
			isTablet={isTabletLandscape}
			onError={handleImageError}
			retryAttempt={retryCount}
		/>
	);
});

const getImageSize = ({ url, height, width }: { url?: string; height?: number; width?: number }): ImageSize | Record<string, never> => {
	const isImageCheckIn = url?.includes('checkin.nccsoft');

	if (isImageCheckIn) {
		return {
			height: heightMedia,
			width: widthMedia
		};
	}

	if (height && width) {
		return { height, width };
	}

	return {};
};

const ImageRenderer = React.memo(
	({
		image,
		imageSize,
		index,
		disable,
		onPress,
		onLongPress,
		isMultiple,
		remainingImagesCount,
		isTablet,
		onError,
		retryAttempt
	}: RenderImageProps & {
		imageSize: any;
		onError: (error: any) => void;
		retryAttempt: number;
	}) => {
		const { themeValue } = useTheme();
		const styles = style(themeValue);
		const { resolution } = useImageResolution({ uri: image.url });

		const aspectRatio = (resolution?.width || 1) / (resolution?.height || 1);
		const dynamicImageSize = imageSize?.width
			? imageSize
			: getAspectRatioSize({
					aspectRatio,
					width: widthMedia
				});

		const isUploading = !image?.url?.includes('http') && !image?.url?.includes('data:image/png;base64');

		const photoSize = useMemo(() => {
			if (imageSize?.width) {
				return {
					width: isUploading
						? isMultiple
							? widthMedia / 2
							: widthMedia
						: isMultiple
							? widthMedia / 2
							: Math.min(imageSize.width, widthMedia),
					height: isUploading
						? isMultiple
							? heightMedia / 2
							: heightMedia
						: isMultiple
							? heightMedia / 2
							: (imageSize.height * Math.min(imageSize.width, widthMedia)) / imageSize.width
				};
			} else {
				return {
					width: !dynamicImageSize?.height && !isUploading ? widthMedia : isMultiple ? widthMedia / 2 : dynamicImageSize.width * 0.8,
					height: !dynamicImageSize?.height && !isUploading ? heightMedia : isMultiple ? heightMedia / 2 : dynamicImageSize.height * 0.8
				};
			}
		}, [dynamicImageSize, imageSize, isMultiple, isUploading]);

		const imageProxyObj = useMemo((): ImageProxyResult => {
			if (!image.url) {
				return { isProxyImage: false, url: '' };
			}

			const isSpecialFormat = ['image/gif', 'image/webp', 'gif', 'webp'].includes(image.filetype) || image?.url?.includes(EMimeTypes.tenor);

			if (isSpecialFormat) {
				return {
					isProxyImage: false,
					url: image.url
				};
			}

			return {
				isProxyImage: true,
				url: createImgproxyUrl(image?.url ?? '', {
					width: Math.round(image?.width * 0.6) || 500,
					height: Math.round(image?.height * 0.6) || 500,
					resizeType: 'fit'
				}) as string
			};
		}, [image?.filetype, image?.height, image?.url, image?.width]);

		if (!image.url) {
			return null;
		}

		const imageStyle = {
			width: photoSize?.width / (isTablet ? 1.8 : 1),
			height: photoSize?.height / (isTablet ? 1.8 : 1),
			opacity: isUploading ? 0.5 : 1,
			marginVertical: !remainingImagesCount && !isMultiple ? size.s_6 : 0
		};

		const containerStyle = [styles.imageMessageRender, imageStyle];

		return (
			<TouchableOpacity
				disabled={isUploading || disable}
				activeOpacity={0.8}
				key={`${index}-${retryAttempt}`} // Add retry attempt to force re-render
				onPress={() => onPress(image)}
				onLongPress={onLongPress}
				style={containerStyle}
			>
				{imageProxyObj?.isProxyImage ? (
					<ImageNative url={imageProxyObj?.url} resizeMode={isMultiple ? 'cover' : 'contain'} style={{ width: '100%', height: '100%' }} />
				) : (
					<FastImage
						source={{
							uri: imageProxyObj?.url,
							priority: FastImage.priority.high,
							cache: FastImage.cacheControl.immutable
						}}
						style={{ width: '100%', height: '100%' }}
						onError={() => onError(new Error(`FastImage load failed for ${imageProxyObj?.url}`))}
					/>
				)}

				{!!remainingImagesCount && (
					<View
						style={{
							...styles.overlay,
							width: photoSize?.width / (isTablet ? 1.8 : 1),
							height: photoSize?.height / (isTablet ? 1.8 : 1)
						}}
					>
						<Text style={styles.moreText}>+{remainingImagesCount}</Text>
					</View>
				)}
			</TouchableOpacity>
		);
	}
);

export { RenderImageChat };
