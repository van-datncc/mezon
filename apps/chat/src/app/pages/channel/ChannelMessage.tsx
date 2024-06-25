import React, { memo, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useSeenMessagePool } from 'libs/core/src/lib/chat/hooks/useSeenMessagePool';
import { IMessageWithUser } from '@mezon/utils';
import { MessageReaction, MessageWithUser, UnreadMessageBreak, UserMentionList } from '@mezon/components';
import { selectIdMessageRefEdit, selectLastSeenMessage, selectMemberByUserId, selectMessageEntityById, selectOpenEditMessageState, selectOpenOptionMessageState, selectReactionBottomState, selectReactionRightState, selectTheme } from '@mezon/store';
import { useChannels } from '@mezon/core';
import ModalDeleteMess from './ModalDeleteMess';
import ChannelMessagePopup from './ChannelMessagePopup';
import MessageInput from './MessageInput';
import { useDeleteMessageHook } from './useDeleteMessage';

type MessageProps = {
	channelId: string;
	messageId: string;
	mode: number;
	channelLabel: string;
};

export function ChannelMessage({ messageId, channelId, mode, channelLabel }: Readonly<MessageProps>) {
	const message = useSelector((state) => selectMessageEntityById(state, channelId, messageId));
	const reactionRightState = useSelector(selectReactionRightState);
	const reactionBottomState = useSelector(selectReactionBottomState);
	const { markMessageAsSeen } = useSeenMessagePool();
	const user = useSelector(selectMemberByUserId(message.sender_id));
	const { deleteMessage, setDeleteMessage, DeleteSendMessage } = useDeleteMessageHook(channelId, channelLabel, mode);
	const openEditMessageState = useSelector(selectOpenEditMessageState);
	const idMessageRefEdit = useSelector(selectIdMessageRefEdit);
	const openOptionMessageState = useSelector(selectOpenOptionMessageState);

	const isEditing = useMemo(() => {
		return openEditMessageState && idMessageRefEdit === messageId;
	}, [openEditMessageState, idMessageRefEdit, messageId]);

	const lastSeen = useSelector(selectLastSeenMessage(channelId, messageId));

	useEffect(() => {
		markMessageAsSeen(message);
	}, [markMessageAsSeen, message]);

	const mess = useMemo(() => {
		if (typeof message.content === 'object' && typeof (message.content as Record<string, unknown>).id === 'string') {
			return message.content;
		}
		return message;
	}, [message]);

	return (
		<>
			<div className="fullBoxText relative group">
				<MessageWithUser
					message={mess as IMessageWithUser}
					user={user}
					mode={mode}
					isEditing={isEditing}
					popup={
						<ChannelMessagePopup
							reactionRightState={reactionRightState}
							mess={mess as IMessageWithUser}
							reactionBottomState={reactionBottomState}
							openEditMessageState={isEditing}
							openOptionMessageState={openOptionMessageState}
							mode={mode}
							deleteSendMessage={DeleteSendMessage}
						/>
					}
				/>
				{
					isEditing ? (
						<MessageInput
							messageId={messageId}
							channelId={channelId}
							mode={mode}
							channelLabel={channelLabel}
							message={mess as IMessageWithUser}
						/>
					) : null
				}
				{lastSeen && <UnreadMessageBreak />}
				{deleteMessage && <ModalDeleteMess mode={mode} closeModal={() => setDeleteMessage(false)} mess={message} />}
			</div>
			<MessageReaction message={message} mode={mode} />
		</>
	);
}

ChannelMessage.Skeleton = () => (
	<div>
		<MessageWithUser.Skeleton />
	</div>
);

export const MemorizedChannelMessage = memo(ChannelMessage);
