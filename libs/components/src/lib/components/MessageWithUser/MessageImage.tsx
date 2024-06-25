import { useAttachments, useRightClick } from '@mezon/core';
import { RightClickPos, notImplementForGifOrStickerSendFromPanel } from '@mezon/utils';
import { rightClickAction, selectPosClickingActive } from 'libs/store/src/lib/rightClick/rightClick.slice';
import { ApiMessageAttachment } from 'mezon-js/api.gen';
import { useDispatch, useSelector } from 'react-redux';
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
	const { setRightClickXy, setMessageRightClick } = useRightClick();
	const posClickActive = useSelector(selectPosClickingActive);

	const handleClick = (url: string) => {
		if (!isDimensionsValid && !checkImage) {
			setOpenModalAttachment(true);
			setAttachment(url);
		}
	};
	const imgStyle = {
		width: isDimensionsValid ? `${attachmentData.width}%` : undefined,
		height: isDimensionsValid ? `${attachmentData.height}%` : undefined,
	};

	const handleContextMenu = (event: React.MouseEvent<HTMLImageElement>) => {
		event.preventDefault();
		event.stopPropagation();
		dispatch(rightClickAction.setPosClickActive(RightClickPos.IMAGE_ON_CHANNEL));
		setRightClickXy({ x: event.pageX, y: event.pageY });
		setMessageRightClick(messageIdRightClick);
	};

	return (
		<div className="break-all">
			<img
				onContextMenu={handleContextMenu}
				className={
					'max-w-[100%] max-h-[30vh] object-cover my-2 rounded ' + (!isDimensionsValid && !checkImage ? 'cursor-pointer' : 'cursor-default')
				}
				src={attachmentData.url?.toString()}
				alt={attachmentData.url}
				onClick={() => handleClick(attachmentData.url || '')}
				style={imgStyle}
			/>
			{posClickActive === RightClickPos.IMAGE_ON_CHANNEL && <ContextMenu urlData={attachmentData.url ?? ''} />}
		</div>
	);
}

export default MessageImage;
