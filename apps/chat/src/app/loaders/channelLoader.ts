import { setJumpToMessageId } from '@mezon/core';
import { channelsActions, messagesActions } from '@mezon/store';
import { ShouldRevalidateFunction } from 'react-router-dom';
import { CustomLoaderFunction } from './appLoader';

export const channelLoader: CustomLoaderFunction = async ({ params, request, dispatch }) => {
	const { channelId, clanId } = params;
	const messageId = new URL(request.url).searchParams.get('messageId');

	if (!channelId) {
		throw new Error('Channel ID null');
	}

	if (messageId) {
		setJumpToMessageId(messageId);
		dispatch(messagesActions.jumpToMessage({ messageId: messageId ?? '', channelId: channelId }));
	}

	dispatch(channelsActions.joinChannel({ clanId: clanId ?? '', channelId: channelId, noFetchMembers: false }));
	dispatch(
		channelsActions.setIdChannelSelected({
			clanId: clanId || '',
			channelId,
		}),
	);
	return null;
};

export const shouldRevalidateChannel: ShouldRevalidateFunction = (ctx) => {
	const { currentParams, nextParams } = ctx;
	const { channelId: currentChannelId } = currentParams;
	const { channelId: nextChannelId } = nextParams;

	return currentChannelId !== nextChannelId;
};
