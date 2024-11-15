import { channelsActions } from '@mezon/store';
import { notificationService } from '@mezon/utils';
import { ShouldRevalidateFunction } from 'react-router-dom';
import { CustomLoaderFunction } from './appLoader';

export const channelLoader: CustomLoaderFunction = async ({ params, request, dispatch }) => {
	const { channelId, clanId } = params;
	const messageId = new URL(request.url).searchParams.get('messageId');
	if (!channelId || !clanId) {
		throw new Error('Channel ID null');
	}
	await dispatch(channelsActions.addThreadToChannels({ channelId, clanId }));
	dispatch(channelsActions.joinChannel({ clanId, channelId, noFetchMembers: false, messageId: messageId || '' }));
	dispatch(channelsActions.setPreviousChannels({ channelId }));
	notificationService.setCurrentChannelId(channelId);
	return null;
};

export const shouldRevalidateChannel: ShouldRevalidateFunction = (ctx) => {
	const { currentParams, nextParams, currentUrl, nextUrl } = ctx;

	const currentMessageId = new URL(currentUrl).searchParams.get('messageId');
	const nextMessageId = new URL(nextUrl).searchParams.get('messageId');

	const { channelId: currentChannelId } = currentParams;
	const { channelId: nextChannelId } = nextParams;

	return currentChannelId !== nextChannelId || currentMessageId !== nextMessageId;
};
