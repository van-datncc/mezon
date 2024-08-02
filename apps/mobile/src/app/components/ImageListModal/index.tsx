import { Metrics } from '@mezon/mobile-ui';
import { selectAttachmentPhoto } from '@mezon/store';
import { ApiMessageAttachment } from 'mezon-js/api.gen';
import React, { useMemo } from 'react';
import ImageView from 'react-native-image-view';
import { useSelector } from 'react-redux';
import { RenderFooterModal } from './RenderFooterModal';

interface IImageListModalProps {
	visible?: boolean;
	idxSelected?: number;
	onImageChange?: (idx: number) => void;
	onImageChangeFooter?: (idx: number) => void;
	onClose?: () => void;
	imageSelected?: ApiMessageAttachment;
}

export const ImageListModal = React.memo((props: IImageListModalProps) => {
	const { visible, idxSelected, onClose, onImageChange, onImageChangeFooter, imageSelected } = props;
	const attachments = useSelector(selectAttachmentPhoto());

	const createAttachmentObject = (attachment: any) => ({
		source: {
			uri: attachment.url,
		},
		filename: attachment.filename,
		title: attachment.filename,
		width: Metrics.screenWidth,
		height: Metrics.screenHeight - 150,
		url: attachment.url,
		uri: attachment.url,
		uploader: attachment.uploader,
		create_time: attachment.create_time,
	});

	const formatAttachments: any[] = useMemo(() => {
		const imageSelectedUrl = imageSelected ? createAttachmentObject(imageSelected) : {};
		const attachmentObjects = attachments.filter((u) => u.url !== imageSelected?.url).map(createAttachmentObject);
		return [imageSelectedUrl, ...attachmentObjects];
	}, [attachments, imageSelected]);

	return (
		<ImageView
			animationType={'fade'}
			images={formatAttachments || []}
			imageIndex={idxSelected}
			isVisible={visible}
			isSwipeCloseEnabled={true}
			onImageChange={(idx: number) => {
				onImageChange(idx);
			}}
			controls={{
				next: true,
				prev: true,
				close: true,
			}}
			onClose={onClose}
			renderFooter={() => (
				<RenderFooterModal data={formatAttachments || []} idxSelected={idxSelected} onImageChangeFooter={onImageChangeFooter} />
			)}
		/>
	);
});
