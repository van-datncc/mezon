import { ImageGallery, ImageObject } from '@georstat/react-native-image-gallery';
import { Block, size, useAnimatedState, useTheme } from '@mezon/mobile-ui';
import { selectAttachmentPhoto } from '@mezon/store';
import { Snowflake } from '@theinternetfolks/snowflake';
import { ApiMessageAttachment } from 'mezon-js/api.gen';
import React, { useCallback, useMemo } from 'react';
import { Pressable } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import { ImageItem } from './ImageItem';
import { RenderFooterModal } from './RenderFooterModal';
import { RenderHeaderModal } from './RenderHeaderModal';

interface IImageListModalProps {
	visible?: boolean;
	onClose?: () => void;
	imageSelected?: ApiMessageAttachment & { id?: string };
}

export const ImageListModal = React.memo((props: IImageListModalProps) => {
	const { visible, onClose, imageSelected } = props;
	const { themeValue } = useTheme();
	const allImageList = useSelector(selectAttachmentPhoto());
	const [onlyView, setOnlyView] = useAnimatedState(false);

	const formatImages: any[] = useMemo(() => {
		if (!imageSelected.id) {
			imageSelected['id'] = Snowflake.generate()
		}
		const uniqueImages = allImageList.filter((image, index, self) => {
			return index === self.findIndex(i => i.url === image.url)
		})
		return [imageSelected, ...uniqueImages.filter(x => x.url !== imageSelected.url)]
	}, [allImageList, imageSelected]);

	const onImagePress = useCallback(() => {
		setOnlyView(!onlyView);
	}, [onlyView])

	const renderCustomImage = (item: ImageObject, index: number) => {
		return (
			<Pressable>
				<ImageItem uri={item.url} key={`${index}_${item?.id}`} onClose={onClose} onImagePress={onImagePress} />
			</Pressable>
		);
	}

	const renderHeaderComponent = () => {
		if (onlyView) return null;
		return (<RenderHeaderModal onClose={onClose} />)
	}

	const renderFooterComponent = (item: ImageObject, currentIndex: number) => {
		return <RenderFooterModal item={item} key={`${currentIndex}_${item?.id}`} />;
	}

	const renderCustomThumb = (item: ImageObject, _: number, isSelected: boolean) => {
		return (
			<Block height={onlyView ? 0 : 'auto'} marginRight={size.s_10}>
				<FastImage
					source={{ uri: item.url }}
					style={{
						height: 70,
						width: 70,
						borderRadius: 15,
						borderWidth: 2,
						borderColor: isSelected ? 'yellow' : 'transparent'
					}}
					resizeMode='cover'
				/>
			</Block>
		)
	}

	return (
		<ImageGallery
			close={onClose}
			isOpen={visible}
			thumbSize={size.s_24 * 3}
			disableSwipe={false}
			images={formatImages}
			thumbColor={themeValue.bgViolet}
			renderCustomImage={renderCustomImage}
			renderHeaderComponent={renderHeaderComponent}
			renderFooterComponent={renderFooterComponent}
			renderCustomThumb={renderCustomThumb}
		/>
	);
});
