import { notImplementForGifOrStickerSendFromPanel } from '@mezon/utils';
import { ApiMessageAttachment } from 'mezon-js/api.gen';
import { useState } from 'react';
import MessageModalImage from './MessageModalImage';
import { useAttachments } from '@mezon/core';

export type MessageImage = {
	readonly attachmentData: ApiMessageAttachment;
};

function MessageImage({ attachmentData }: MessageImage) {
	const { setOpenModalAttachment, setAttachment } = useAttachments();
	const isDimensionsValid = attachmentData.height && attachmentData.width && attachmentData.height > 0 && attachmentData.width > 0;
	const checkImage = notImplementForGifOrStickerSendFromPanel(attachmentData);

	const handleClick = (url:string) => {
		if (!isDimensionsValid && !checkImage) {
			setOpenModalAttachment(true);
			setAttachment(url);
		}
	};
	const imgStyle = {
		width: isDimensionsValid ? `${attachmentData.width}%` : undefined,
		height: isDimensionsValid ? `${attachmentData.height}%` : undefined,
	};

	return (
		<div className="break-all">
			<img
				className={"max-w-[100%] max-h-[30vh] object-cover my-2 rounded " + (!isDimensionsValid && !checkImage ? "cursor-pointer" : "cursor-default")}
				src={attachmentData.url?.toString()}
				alt={attachmentData.url}
				onClick={()=>handleClick(attachmentData.url||'')}
				style={imgStyle}
			/>
		</div>
	);
}

export default MessageImage;
