import { Block, useAnimatedState, useTheme } from '@mezon/mobile-ui';
import { AttachmentEntity, selectAttachmentPhoto } from '@mezon/store';
import { ApiMessageAttachment } from 'mezon-js/api.gen';
import React, { useMemo, useRef, useState } from 'react';
import { Modal, StyleSheet } from 'react-native';
import Gallery, { GalleryRef, RenderItemInfo } from 'react-native-awesome-gallery';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import { RenderFooterModal } from './RenderFooterModal';
import { RenderHeaderModal } from './RenderHeaderModal';

interface IImageListModalProps {
	visible?: boolean;
	onClose?: () => void;
	imageSelected?: AttachmentEntity;
}

interface IVisibleToolbarConfig {
	showHeader: boolean;
	showFooter: boolean;
}
const originScale = 1;

export const ImageListModal = React.memo((props: IImageListModalProps) => {
	const { visible, onClose, imageSelected } = props;
	const { themeValue } = useTheme();
	const [currentImage, setCurrentImage] = useState<AttachmentEntity | null>(null);
	const [visibleToolbarConfig, setVisibleToolbarConfig] = useAnimatedState<IVisibleToolbarConfig>({ showHeader: true, showFooter: false });
	const allImageList = useSelector(selectAttachmentPhoto());
	const ref = useRef<GalleryRef>(null);

	const initialIndex = useMemo(() => {
		const imageIndexSelected = allImageList.findIndex(file => file?.filename === imageSelected?.filename);
		return imageIndexSelected === -1 ? 0 : imageIndexSelected;
	}, [allImageList, imageSelected])

	const updateToolbarConfig = (newValue: Partial<IVisibleToolbarConfig>) => {
		setVisibleToolbarConfig({ ...visibleToolbarConfig, ...newValue })
	}

	const onIndexChange = (newIndex: number) => {
		if (allImageList[newIndex]?.id !== currentImage?.id) {
			setCurrentImage(allImageList[newIndex]);
			ref.current?.reset();
			//TODO
		}
	}

	const onTap = () => {
		updateToolbarConfig({
			showHeader: !visibleToolbarConfig.showHeader,
		})
	}

	const onDoubleTap = (toScale: number) => {
		if (toScale > originScale) {
			updateToolbarConfig({ showHeader: false });
		}
	}

	const onImageSelectedChange = (image: AttachmentEntity) => {
		const imageIndexSelected = allImageList?.findIndex(i => i?.id === image?.id);
		if (imageIndexSelected > -1) {
			setCurrentImage(image);
			ref.current?.setIndex(imageIndexSelected);
			ref.current?.reset();
		}
	}

	const renderItem = ({
		item,
		setImageDimensions,
	}: RenderItemInfo<ApiMessageAttachment>) => {
		return (
			<FastImage
				source={{ uri: item?.url }}
				style={StyleSheet.absoluteFillObject}
				resizeMode='contain'
				onLoad={(e) => {
					const { width, height } = e.nativeEvent;
					setImageDimensions({ width, height });
				}}
			/>
		);
	};

	return (
		<Modal visible={visible}>
			<Block flex={1}>
				{visibleToolbarConfig.showHeader && (
					<RenderHeaderModal onClose={onClose} imageSelected={currentImage} />
				)}
				<Gallery
					ref={ref}
					initialIndex={initialIndex}
					data={allImageList}
					keyExtractor={(item, index) => `${item?.filename}_${index}`}
					onSwipeToClose={onClose}
					onIndexChange={onIndexChange}
					renderItem={renderItem}
					onDoubleTap={onDoubleTap}
					onTap={onTap}
					onPanStart={() => {
						if (!visibleToolbarConfig.showFooter) {
							updateToolbarConfig({
								showFooter: true,
							})
							setTimeout(() => {
								updateToolbarConfig({
									showFooter: false,
								})
							}, 3000)
						}
					}}
				/>
				{visibleToolbarConfig.showFooter && (
					<RenderFooterModal imageSelected={currentImage} onImageSelectedChange={onImageSelectedChange} />
				)}
			</Block>
		</Modal>
	)
});
