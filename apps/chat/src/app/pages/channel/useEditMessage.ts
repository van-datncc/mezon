import { useChatSending } from '@mezon/core';
import { messagesActions, referencesActions, selectChannelDraftMessage, selectIdMessageRefEdit, selectOpenEditMessageState } from '@mezon/store';
import { IMessageWithUser } from '@mezon/utils';
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useEditMessage = (channelId: string, channelLabel: string, mode: number, message: IMessageWithUser) => {
	const dispatch = useDispatch();
	const { EditSendMessage } = useChatSending({ channelId: channelId || '', mode });

	const openEditMessageState = useSelector(selectOpenEditMessageState);
	const idMessageRefEdit = useSelector(selectIdMessageRefEdit);
	const channelDraftMessage = useSelector((state) => selectChannelDraftMessage(state, channelId, message.id));

	const [content, setContent] = useState(channelDraftMessage.draft_content);

	const handleCancelEdit = useCallback(() => {
		dispatch(referencesActions.setIdReferenceMessageEdit(''));
		dispatch(messagesActions.deleteChannelDraftMessage({ channelId }));
	}, [dispatch]);

	const setChannelDraftMessage = useCallback(
		(channelId: string, message_id: string, draft_content: string) => {
			dispatch(
				messagesActions.setChannelDraftMessage({
					channelId: channelId as string,
					channelDraftMessage: {
						message_id,
						draft_content,
					},
				}),
			);
		},
		[dispatch],
	);

	const handleSend = useCallback(
		(editMessage: string, messageId: string) => {
			const content = editMessage.trim();
			EditSendMessage(content, messageId);
			setChannelDraftMessage(channelId, messageId, content);
		},
		[EditSendMessage],
	);

	return {
		openEditMessageState,
		idMessageRefEdit,
		content,
		setContent,
		handleCancelEdit,
		handleSend,
		setChannelDraftMessage,
	};
};
