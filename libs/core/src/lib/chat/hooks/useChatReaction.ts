import { useCallback, useMemo } from 'react';
import { reactionActions, useAppDispatch } from '@mezon/store';

export type UseMessageReactionOption = {
	currentChannelId?: string | null | undefined;
};

export function useChatReaction() {
	const dispatch = useAppDispatch();

	const reactionMessageDispatch = useCallback(
		async (
			id: string,
			mode: number,
			channelId: string,
			messageId: string,
			emoji: string,
			count: number,
			message_sender_id: string,
			action_delete: boolean,
		) => {
			return dispatch(
				reactionActions.writeMessageReaction({
					id,
					channelId,
					mode,
					messageId,
					emoji,
					count,
					messageSenderId: message_sender_id,
					actionDelete: action_delete,
				})
			);
		},
		[dispatch],
	);

	return useMemo(
		() => ({
			reactionMessageDispatch,
		}),
		[reactionMessageDispatch],
	);
}
