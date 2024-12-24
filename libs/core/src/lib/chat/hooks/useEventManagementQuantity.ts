import { selectAllEventManagement, selectAllTextChannel } from '@mezon/store';
import { EEventStatus } from '@mezon/utils';
import { useSelector } from 'react-redux';

export const useEventManagementQuantity = () => {
	const allEventManagement = useSelector(selectAllEventManagement);
	const allThreadChannelPrivate = useSelector(selectAllTextChannel);

	const allThreadChannelPrivateIds = allThreadChannelPrivate.map((channel) => channel.channel_id);

	const eventsByUser = allEventManagement.filter(
		(event) => !event.channel_id || event.channel_id === '0' || allThreadChannelPrivateIds.includes(event.channel_id)
	);

	const numberEventManagement = eventsByUser.length;

	const eventUpcoming = eventsByUser.filter((event) => event.event_status === EEventStatus.UPCOMING || event.event_status === EEventStatus.ONGOING);

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
