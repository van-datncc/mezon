import { Block, size, useTheme } from '@mezon/mobile-ui';
import { AttachmentEntity, selectAttachmentPhoto } from '@mezon/store';
import React, { memo, useEffect, useRef } from 'react';
import { Animated, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { getAspectRatioSize, useImageResolution } from 'react-native-zoom-toolkit';
import { useSelector } from 'react-redux';
import { style } from './styles';
interface IRenderFooterModalProps {
	imageSelected?: AttachmentEntity;
	onImageThumbnailChange: (image: AttachmentEntity) => void;
	visible?: boolean;
}

export const RenderFooterModal = memo((props: IRenderFooterModalProps) => {
	const { imageSelected, onImageThumbnailChange, visible } = props;
	const { themeValue } = useTheme();
	const allImageList = useSelector(selectAttachmentPhoto());
	const styles = style(themeValue);

	const { resolution } = useImageResolution({ uri: imageSelected?.url });
	const imageSize = getAspectRatioSize({
		aspectRatio: resolution?.width / resolution?.height,
		width: size.s_60,
	});
	const flatListRef = useRef<Animated.FlatList<AttachmentEntity>>(null);

	useEffect(() => {
		if (imageSelected?.id) {
			const index = allImageList.findIndex(file => file?.id === imageSelected?.id);
			if (index !== -1 && flatListRef.current) {
				flatListRef.current.scrollToOffset({
					offset: (index - 3) * (size.s_40),
					animated: true,
				});
			}
		}
	}, [imageSelected?.id]);

	const handlePress = (imageFile: AttachmentEntity) => {
		if (imageFile?.id !== imageSelected?.id) {
			onImageThumbnailChange(imageFile);
		}
	};

	const renderItem = ({ item }: { item: AttachmentEntity }) => {
		const isSelected = item?.id === imageSelected?.id;
		return (
			<TouchableOpacity onPress={() => handlePress(item)}>
				<Block style={[styles.imageWrapper, isSelected && [styles.imageSelected, { width: imageSize.width }]]}>
					<FastImage source={{ uri: item?.url }} style={[styles.image]} resizeMode={imageSelected ? 'cover' : 'contain'} />
				</Block>
			</TouchableOpacity>
		);
	};
	return (
		<Block
			position='absolute'
			bottom={0}
			left={0}
			zIndex={1}
			justifyContent='space-between'
			flexDirection='row'
			backgroundColor='rgba(0, 0, 0, 0.4)'
			width='100%'
			height={visible ? size.s_100 : 0}
			alignItems='center'
		>
			<Block>
				<Animated.FlatList
					horizontal
					ref={flatListRef}
					data={allImageList}
					renderItem={renderItem}
					keyExtractor={(item, index) => `${item?.id}_${index}}`}
					showsHorizontalScrollIndicator={false}
					decelerationRate="fast"
				/>
			</Block>
		</Block>
	);
});
