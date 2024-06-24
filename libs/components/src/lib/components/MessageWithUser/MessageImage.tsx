import { useAttachments, useOnClickOutside, useRightClick } from '@mezon/core';
import { RightClickPos, notImplementForGifOrStickerSendFromPanel } from '@mezon/utils';
import { rightClickAction } from 'libs/store/src/lib/rightClick/rightClick.slice';
import { ApiMessageAttachment } from 'mezon-js/api.gen';
import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import ContextMenu from '../RightClick/ContextMenu';

export type MessageImage = {
	readonly attachmentData: ApiMessageAttachment;
	readonly messageIdRightClick: string;
};

function MessageImage({ attachmentData, messageIdRightClick }: MessageImage) {
	const dispatch = useDispatch();
	const { setOpenModalAttachment, setAttachment } = useAttachments();
	const isDimensionsValid = attachmentData.height && attachmentData.width && attachmentData.height > 0 && attachmentData.width > 0;
	const checkImage = notImplementForGifOrStickerSendFromPanel(attachmentData);
	const imageRef = useRef<HTMLDivElement | null>(null);
	const { setRightClickXy, setMessageRightClick } = useRightClick();
	const handleClick = (url: string) => {
		if (!isDimensionsValid && !checkImage) {
			setOpenModalAttachment(true);
			setAttachment(url);
		}
		handleCloseMenu();
	};
	const imgStyle = {
		width: isDimensionsValid ? `${attachmentData.width}%` : undefined,
		height: isDimensionsValid ? `${attachmentData.height}%` : undefined,
	};

	const [isMenuVisible, setMenuVisible] = useState(false);
	const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
		dispatch(rightClickAction.setPosClickActive(RightClickPos.IMAGE_ON_CHANNEL));
		setRightClickXy({ x: event.pageX, y: event.pageY });
		setMenuVisible(true);
		setMessageRightClick(messageIdRightClick);
		event.preventDefault();
	};

	const handleCloseMenu = () => {
		setMenuVisible(false);
	};
	useOnClickOutside(imageRef, handleCloseMenu);
	return (
		<div ref={imageRef} className="break-all" onContextMenu={handleContextMenu}>
			<img
				className={
					'max-w-[100%] max-h-[30vh] object-cover my-2 rounded ' + (!isDimensionsValid && !checkImage ? 'cursor-pointer' : 'cursor-default')
				}
				src={attachmentData.url?.toString()}
				alt={attachmentData.url}
				onClick={() => handleClick(attachmentData.url || '')}
				style={imgStyle}
			/>
			{isMenuVisible && <ContextMenu urlData={attachmentData.url ?? ''} onClose={handleCloseMenu} />}
		</div>
	);
}

export default MessageImage;
