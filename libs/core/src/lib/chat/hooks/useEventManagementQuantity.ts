import { getStore, selectAllAccount, selectAllTextChannel, selectCurrentClanId, selectEventsByClanId } from '@mezon/store';
import { EEventStatus } from '@mezon/utils';
import { useMemo } from 'react';

export const useEventManagementQuantity = () => {
	const store = getStore();
	const userId = selectAllAccount(store.getState())?.user?.id;
	const currentClanId = selectCurrentClanId(store.getState());
	const allEventManagement = selectEventsByClanId(store.getState(), currentClanId as string);
	const allThreadChannelPrivate = selectAllTextChannel(store.getState());
	const allThreadChannelPrivateIds = allThreadChannelPrivate.map((channel) => channel.channel_id);

	const eventsByUser = useMemo(
		() =>
			allEventManagement.filter(
				(event) =>
					(!event.isPrivate || event.creator_id === userId) &&
					(!event.channel_id || event.channel_id === '0' || allThreadChannelPrivateIds.includes(event.channel_id))
			),
		[allEventManagement, allThreadChannelPrivateIds, userId]
	);

	const numberEventManagement = eventsByUser.length;

	const eventUpcoming = useMemo(
		() => eventsByUser.filter((event) => event.event_status === EEventStatus.UPCOMING || event.event_status === EEventStatus.ONGOING),
		[eventsByUser]
	);
	const numberEventUpcoming = eventUpcoming.length;

	return {
		allEventManagement,
		allThreadChannelPrivate,
		eventsByUser,
		numberEventManagement,
		eventUpcoming,
		numberEventUpcoming
	};
};
