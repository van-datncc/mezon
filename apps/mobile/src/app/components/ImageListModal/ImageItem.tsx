import React, { memo } from 'react';
import { Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';
import ImageZoom from 'react-native-image-pan-zoom';
import { getAspectRatioSize, useImageResolution } from 'react-native-zoom-toolkit';
const { width, height } = Dimensions.get('window');

interface IImageItemProps {
	uri: any,
	onClose: () => void
	onImagePress?: () => void;
}

const maxHeightReduction = 100;

export const ImageItem = memo((props: IImageItemProps) => {
	const { uri, onClose, onImagePress } = props;
	const { isFetching, resolution } = useImageResolution({ uri: uri });
	if (isFetching || resolution === undefined) {
		return null;
	}

	const imageSize = getAspectRatioSize({
		aspectRatio: resolution.width / resolution.height,
		width: width,
	});

	const isImageTooHigh = imageSize.height > height / 1.5;
	return (
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		<ImageZoom
			enableSwipeDown={true}
			swipeDownThreshold={100}
			onSwipeDown={onClose}
			cropWidth={width}
			cropHeight={height - (isImageTooHigh ? maxHeightReduction : 0)}
			imageWidth={imageSize.width}
			imageHeight={imageSize.height - (isImageTooHigh ? maxHeightReduction : 0)}
			onClick={onImagePress}
		>
			<FastImage style={{ width: imageSize.width, height: imageSize.height }} source={{ uri: uri }} />
		</ImageZoom>
	);
});
