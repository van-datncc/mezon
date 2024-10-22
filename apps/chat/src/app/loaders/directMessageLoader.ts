import { channelsActions, directActions } from '@mezon/store';
import { notificationService } from '@mezon/utils';
import { CustomLoaderFunction } from './appLoader';

export const directMessageLoader: CustomLoaderFunction = async ({ params, dispatch }) => {
	const { directId, type } = params;
	if (!directId) {
		throw new Error('DirectMessage ID null');
	}

	await dispatch(
		directActions.joinDirectMessage({
			directMessageId: directId,
			channelName: '',
			type: Number(type)
		})
	);
	dispatch(channelsActions.setPreviousChannels({ channelId: directId }));
	notificationService.setCurrentChannelId(directId);

	return null;
};
