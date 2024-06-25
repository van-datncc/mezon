import { useDeleteMessage } from '@mezon/core';
import {
	directActions,
	messagesActions,
	pinMessageActions,
	referencesActions,
	selectAllDirectMessages,
	selectCurrentChannel,
	selectMessageByMessageId,
	useAppDispatch,
} from '@mezon/store';
import { RightClickList, RightClickPos } from '@mezon/utils';
import { setSelectedMessage, toggleIsShowPopupForwardTrue } from 'libs/store/src/lib/forwardMessage/forwardMessage.slice';
import { rightClickAction, selectMessageIdRightClicked, selectModeActive } from 'libs/store/src/lib/rightClick/rightClick.slice';
import { memo } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useSelector } from 'react-redux';
import ItemDetail from '../ItemDetail';
import { handleCopyImage, handleCopyLink, handleOpenLink, handleSaveImage } from './function';

interface IMenuItem {
	item: any;
	urlData: string;
}

const MenuItem: React.FC<IMenuItem> = ({ item, urlData }) => {
	const dispatch = useAppDispatch();
	const getMessageIdRightClicked = useSelector(selectMessageIdRightClicked);
	const getMessageRclicked = useSelector(selectMessageByMessageId(getMessageIdRightClicked));
	const dmGroupChatList = useSelector(selectAllDirectMessages);
	const currentChannel = useSelector(selectCurrentChannel);
	const getModeActive = useSelector(selectModeActive);

	const { deleteSendMessage } = useDeleteMessage({
		channelId: currentChannel?.id || '',
		mode: getModeActive,
	});

	const clickItem = () => {
		if (item.name === RightClickList.COPY_IMAGE) {
			handleCopyImage(urlData);
		}
		if (item.name === RightClickList.SAVE_IMAGE) {
			handleSaveImage(urlData);
		}
		if (item.name === RightClickList.COPY_LINK) {
			handleCopyLink(urlData);
		}
		if (item.name === RightClickList.OPEN_LINK) {
			handleOpenLink(urlData);
		}
		if (item.name === RightClickList.EDIT_MESSAGE) {
			dispatch(referencesActions.setOpenReplyMessageState(false));
			dispatch(referencesActions.setOpenEditMessageState(true));
			dispatch(messagesActions.setOpenOptionMessageState(false));
			dispatch(referencesActions.setIdReferenceMessageEdit(getMessageIdRightClicked));
		}
		if (item.name === RightClickList.REPLY) {
			dispatch(referencesActions.setIdReferenceMessageReply(getMessageIdRightClicked));
			dispatch(referencesActions.setOpenReplyMessageState(true));
			dispatch(referencesActions.setOpenEditMessageState(false));
			dispatch(messagesActions.setOpenOptionMessageState(false));
		}
		if (item.name === RightClickList.COPY_TEXT) {
			dispatch(referencesActions.setOpenEditMessageState(false));
			dispatch(messagesActions.setOpenOptionMessageState(false));
			dispatch(referencesActions.setDataReferences(null));
		}
		if (item.name === RightClickList.FORWARD_MESSAGE) {
			if (dmGroupChatList.length === 0) {
				dispatch(directActions.fetchDirectMessage({}));
			}
			dispatch(toggleIsShowPopupForwardTrue());
			dispatch(setSelectedMessage(getMessageRclicked));
		}
		if (item.name === RightClickList.PIN_MESSAGE) {
			dispatch(pinMessageActions.setChannelPinMessage({ channel_id: getMessageRclicked?.channel_id, message_id: getMessageRclicked?.id }));
		}
		if (item.name === RightClickList.UNPIN_MESSAGE) {
			dispatch(pinMessageActions.deleteChannelPinMessage({ channel_id: getMessageRclicked?.channel_id, message_id: getMessageRclicked?.id }));
		}
		if (item.name === RightClickList.DELETE_MESSAGE) {
			deleteSendMessage(getMessageRclicked.id);
		}
		dispatch(rightClickAction.setPosClickActive(RightClickPos.NONE));
	};

	return (
		<div>
			{item.name === RightClickList.COPY_LINK ? (
				<CopyToClipboard text={urlData}>
					<ItemDetail item={item} onClick={clickItem} />
				</CopyToClipboard>
			) : item.name === RightClickList.COPY_TEXT ? (
				<CopyToClipboard text={getMessageRclicked.content.t ?? ''}>
					<ItemDetail item={item} onClick={clickItem} />
				</CopyToClipboard>
			) : (
				<ItemDetail item={item} onClick={clickItem} />
			)}
		</div>
	);
};

export default memo(MenuItem);
