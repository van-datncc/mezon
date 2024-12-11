import { createImgproxyUrl } from '@mezon/utils';
import { ApiMessageAttachment } from 'mezon-js/api.gen';
import React from 'react';
import { StyleSheet } from 'react-native';
import { RenderItemInfo } from 'react-native-awesome-gallery';
import FastImage from 'react-native-fast-image';

export const ItemImageModal = React.memo(({ item, setImageDimensions }: RenderItemInfo<ApiMessageAttachment>) => {
	const [isLoadFailProxy, setIsLoadFailProxy] = React.useState<boolean>(false);

	return (
		<FastImage
			source={{ uri: isLoadFailProxy ? (item?.url ?? '') : createImgproxyUrl(item?.url ?? '', { width: 700, height: 700, resizeType: 'fit' }) }}
			style={StyleSheet.absoluteFillObject}
			resizeMode="contain"
			onLoad={(e) => {
				const { width, height } = e.nativeEvent;
				setImageDimensions({ width, height });
			}}
			onError={() => {
				setIsLoadFailProxy(true);
			}}
		/>
	);
});
