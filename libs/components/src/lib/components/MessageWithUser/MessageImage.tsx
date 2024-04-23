import { useEscapeKey } from '@mezon/core';
import { notImplementForGifOrStickerSendFromPanel } from '@mezon/utils';
import { ApiMessageAttachment } from 'mezon-js/api.gen';
import { useEffect, useState } from 'react';
import MessageModalImage from './MessageModalImage';

export type MessageImage = {
	content?: string;
	attachmentData: ApiMessageAttachment;
};

function MessageImage({ attachmentData }: MessageImage) {
	const [openModal, setOpenModal] = useState(false);
	const [scale, setScale] = useState(1);
	const isDimensionsValid = attachmentData.height && attachmentData.width && attachmentData.height > 0 && attachmentData.width > 0;
	const checkImage = notImplementForGifOrStickerSendFromPanel(attachmentData);

	const handleWheel = (event: any) => {
		const deltaY = event.deltaY;
		setScale((prevScale) => {
			let newScale = prevScale;
			if (deltaY > 0) {
				newScale = Math.max(1, prevScale - 0.05);
			} else {
				newScale = Math.min(5, prevScale + 0.05);
			}
			return newScale;
		});
	};

	useEffect(() => {
		setScale(1);
	}, [openModal]);

	const closeModal = () => {
		setOpenModal(false);
	};

	useEscapeKey(closeModal);

	return (
		<>
			<div className="break-all">
				<img
					className={`max-w-[100%] max-h-[30vh] object-cover my-2 rounded ${!isDimensionsValid && !checkImage ? `cursor-pointer` : `cursor-default`}`}
					src={attachmentData.url?.toString()}
					alt={attachmentData.url}
					onClick={() => {
						if (!isDimensionsValid && !checkImage) {
							setOpenModal(true);
						} else return;
					}}
					style={{
						width: isDimensionsValid ? `${attachmentData.width}%` : undefined,
						height: isDimensionsValid ? `${attachmentData.height}%` : undefined,
					}}
				/>
			</div>

			<MessageModalImage open={openModal} closeModal={closeModal} url={attachmentData.url} />
		</>
	);
}

export default MessageImage;
