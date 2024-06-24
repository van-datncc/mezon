import { useAuth } from '@mezon/core';
import {
	directActions,
	messagesActions,
	pinMessageActions,
	referencesActions,
	selectAllDirectMessages, selectPinMessageByChannelId, useAppDispatch
} from '@mezon/store';
import { IMessageWithUser } from '@mezon/utils';
import { setSelectedMessage, toggleIsShowPopupForwardTrue } from 'libs/store/src/lib/forwardMessage/forwardMessage.slice';
import React, { memo } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useSelector } from 'react-redux';

type PopupOptionProps = {
	message: IMessageWithUser;
	deleteSendMessage: (messageId: string) => Promise<void> | void;
};

function PopupOption({ message, deleteSendMessage }: PopupOptionProps) {
	const dispatch = useAppDispatch();
	const { userId } = useAuth();
	const listPinMessages = useSelector(selectPinMessageByChannelId(message.channel_id));
	const messageExists = listPinMessages.some((pinMessage) => pinMessage.message_id === message.id);
	const handleClickEdit = (event: React.MouseEvent<HTMLLIElement>) => {
		dispatch(referencesActions.setOpenReplyMessageState(false));
		dispatch(referencesActions.setOpenEditMessageState(true));
		dispatch(messagesActions.setOpenOptionMessageState(false));
		dispatch(referencesActions.setIdReferenceMessageEdit(message.id));
		event.stopPropagation();
	};

	const handleClickReply = (event: React.MouseEvent<HTMLLIElement>) => {
		dispatch(referencesActions.setIdReferenceMessageReply(message.id));
		dispatch(referencesActions.setOpenReplyMessageState(true));
		dispatch(referencesActions.setOpenEditMessageState(false));
		dispatch(messagesActions.setOpenOptionMessageState(false));
		dispatch(referencesActions.setIdReferenceMessageReply(message.id));
		event.stopPropagation();
	};

	const handleClickCopy = () => {
		dispatch(referencesActions.setOpenEditMessageState(false));
		dispatch(messagesActions.setOpenOptionMessageState(false));
		dispatch(referencesActions.setDataReferences(null));
	};

	const handleClickDelete = () => {
		deleteSendMessage(message.id);
	};
	const dmGroupChatList = useSelector(selectAllDirectMessages);
	const handleClickForward = () => {
		if (dmGroupChatList.length === 0) {
			dispatch(directActions.fetchDirectMessage({}));
		}
		dispatch(toggleIsShowPopupForwardTrue());
		dispatch(setSelectedMessage(message));
	};

	const handlePinMessage = () => {
		dispatch(pinMessageActions.setChannelPinMessage({ channel_id: message.channel_id, message_id: message.id }));
	};
	const handleUnPinMessage = () => {
		dispatch(pinMessageActions.deleteChannelPinMessage({ channel_id: message.channel_id, message_id: message.id }));
	};
	const checkUser = userId === message.sender_id;
	return (
		<div
			className={`dark:bg-[#151515] bg-bgLightMode rounded-[10px] p-2 absolute right-8 w-[180px] z-10 ${checkUser ? '-top-[150px]' : 'top-[-66px]'}`}
		>
			<ul className="flex flex-col gap-1">
				{checkUser && (
					<li
						className="p-2 dark:hover:bg-black hover:bg-bgLightModeThird dark:text-textDarkTheme text-textLightTheme rounded-lg text-[15px] cursor-pointer"
						onClick={handleClickEdit}
						role="button"
						aria-hidden
					>
						Edit Message
					</li>
				)}
				<li
					className="p-2 dark:hover:bg-black hover:bg-bgLightModeThird dark:text-textDarkTheme text-textLightTheme rounded-lg text-[15px] cursor-pointer"
					onClick={handleClickReply}
					role="button"
					aria-hidden
				>
					Reply
				</li>
				<li
					className="p-2 dark:hover:bg-black hover:bg-bgLightModeThird dark:text-textDarkTheme text-textLightTheme rounded-lg text-[15px] cursor-pointer"
					onClick={() => {
						handleClickForward();
					}}
					role="button"
					aria-hidden
				>
					Forward message
				</li>
				{messageExists ? (
					<li
						className="p-2 dark:hover:bg-black hover:bg-bgLightModeThird dark:text-textDarkTheme text-textLightTheme rounded-lg text-[15px] cursor-pointer"
						onClick={() => {
							handleUnPinMessage();
						}}
						role="button"
						aria-hidden
					>
						Unpin message
					</li>
				) : (
					<li
						className="p-2 dark:hover:bg-black hover:bg-bgLightModeThird dark:text-textDarkTheme text-textLightTheme rounded-lg text-[15px] cursor-pointer"
						onClick={() => {
							handlePinMessage();
						}}
						role="button"
						aria-hidden
					>
						Pin message
					</li>
				)}
				<CopyToClipboard text={message.content.t || ''}>
					<li
						className="p-2 dark:hover:bg-black hover:bg-bgLightModeThird dark:text-textDarkTheme text-textLightTheme rounded-lg text-[15px] cursor-pointer"
						onClick={handleClickCopy}
						role="button"
						aria-hidden
					>
						Copy Text
					</li>
				</CopyToClipboard>

				{checkUser && (
					<li
						className="p-2 dark:hover:bg-black hover:bg-bgLightModeThird rounded-lg text-[15px] cursor-pointer text-[#ff0000]"
						onClick={handleClickDelete}
						role="button"
						aria-hidden
					>
						Delete Message
					</li>
				)}
			</ul>
		</div>
	);
}

export default memo(PopupOption);