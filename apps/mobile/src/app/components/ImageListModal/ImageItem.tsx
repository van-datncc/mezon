import React from 'react';
import { Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';
import ImageZoom from 'react-native-image-pan-zoom';
import { getAspectRatioSize, useImageResolution } from 'react-native-zoom-toolkit';
const { width, height } = Dimensions.get('window');

export const ImageItem = ({ uri, onClose }) => {
	const { isFetching, resolution } = useImageResolution({ uri: uri });
	if (isFetching || resolution === undefined) {
		return null;
	}

	const imageSize = getAspectRatioSize({
		aspectRatio: resolution.width / resolution.height,
		width: width,
	});
	return (
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		<ImageZoom
			enableSwipeDown={true}
			swipeDownThreshold={100}
			onSwipeDown={onClose}
			cropWidth={width}
			cropHeight={height}
			imageWidth={imageSize.width}
			imageHeight={imageSize.height}
		>
			<FastImage style={{ width: imageSize.width, height: imageSize.height }} source={{ uri: uri }} />
		</ImageZoom>
	);
};
