import { IMessage } from '@mezon/utils';
import { useSeenMessagePool } from './useSeenMessagePool';
import { channelsActions, useAppDispatch } from '@mezon/store-mobile';

export function useChatMessage(messageId: string) {
	const { markMessageAsSeen: doMarkMessageAsSeen } = useSeenMessagePool();
	const dispatch = useAppDispatch();

	const markMessageAsSeen = (message: IMessage) => {
		const timestamp = Date.now() / 1000;
		doMarkMessageAsSeen(message);
		dispatch(channelsActions.setChannelLastSeenTimestamp({ channelId: message.channel_id, timestamp }));
	};

	return {
		markMessageAsSeen,
	};
}
