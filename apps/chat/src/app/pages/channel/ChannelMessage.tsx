import { MessageReaction, MessageWithUser, UnreadMessageBreak } from '@mezon/components';
import {
	selectIdMessageRefEdit,
	selectLastSeenMessage,
	selectMemberByUserId,
	selectMessageEntityById,
	selectOpenEditMessageState,
} from '@mezon/store';
import { IMessageWithUser } from '@mezon/utils';
import { useSeenMessagePool } from 'libs/core/src/lib/chat/hooks/useSeenMessagePool';
import { rightClickAction } from 'libs/store/src/lib/rightClick/rightClick.slice';
import { memo, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MessageInput from './MessageInput';
import ModalDeleteMess from './ModalDeleteMess';
import { useDeleteMessageHook } from './useDeleteMessage';

type MessageProps = {
	channelId: string;
	messageId: string;
	mode: number;
	channelLabel: string;
};

export function ChannelMessage({ messageId, channelId, mode, channelLabel }: Readonly<MessageProps>) {
	const dispatch = useDispatch();
	const message = useSelector((state) => selectMessageEntityById(state, channelId, messageId));
	const { markMessageAsSeen } = useSeenMessagePool();
	const user = useSelector(selectMemberByUserId(message.sender_id));
	const { deleteMessage, setDeleteMessage } = useDeleteMessageHook(channelId, channelLabel, mode);
	const openEditMessageState = useSelector(selectOpenEditMessageState);
	const idMessageRefEdit = useSelector(selectIdMessageRefEdit);

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

	useEffect(() => {
		dispatch(rightClickAction.setModeActive(mode));
	}, [mode]);

	return (
		<>
			<div className="fullBoxText relative group">
			<MessageWithUser message={mess as IMessageWithUser} user={user} mode={mode} isEditing={isEditing}/>
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
			{lastSeen && <UnreadMessageBreak />}
			{deleteMessage && <ModalDeleteMess mode={mode} closeModal={() => setDeleteMessage(false)} mess={message} />}
		</>
	);
}

ChannelMessage.Skeleton = () => (
	<div>
		<MessageWithUser.Skeleton />
	</div>
);

export const MemorizedChannelMessage = memo(ChannelMessage);
