import { ActionEmitEvent } from '@mezon/mobile-components';
import { attachmentActions, AttachmentEntity, useAppDispatch } from '@mezon/store-mobile';
import React, { useCallback, useEffect, useState } from 'react';
import { DeviceEventEmitter, View } from 'react-native';
import { ImageListModal } from '../../../components/ImageListModal';

type ChannelMessageActionListenerProps = {
	channelId: string;
	clanId: string;
};
const ChannelMessageActionListener = React.memo(({ clanId, channelId }: ChannelMessageActionListenerProps) => {
	const dispatch = useAppDispatch();
	const [visibleImageModal, setVisibleImageModal] = useState<boolean>(false);
	const [imageSelected, setImageSelected] = useState<AttachmentEntity>();
	const onCloseModalImage = useCallback(() => {
		setVisibleImageModal(false);
	}, []);

	const onOpenImage = useCallback(
		async (image: AttachmentEntity) => {
			await dispatch(attachmentActions.fetchChannelAttachments({ clanId, channelId }));
			setImageSelected(image);
			setVisibleImageModal(true);
		},
		[channelId, clanId, dispatch]
	);

	useEffect(() => {
		const eventOpenImage = DeviceEventEmitter.addListener(ActionEmitEvent.ON_OPEN_IMAGE_DETAIL_MESSAGE_ITEM, onOpenImage);
		return () => {
			eventOpenImage.remove();
		};
	}, [onOpenImage]);

	return (
		<View>
			{visibleImageModal && (
				<ImageListModal channelId={channelId} visible={visibleImageModal} onClose={onCloseModalImage} imageSelected={imageSelected} />
			)}
		</View>
	);
});

export default ChannelMessageActionListener;
