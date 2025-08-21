import { useFriends } from '@mezon/core';
import { selectAnyUnreadChannel, selectBadgeCountAllClan, selectTotalUnreadDM, useAppSelector } from '@mezon/store-mobile';
import notifee from '@notifee/react-native';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export const BadgeAppIconLoader = () => {
	const hasUnreadChannel = useAppSelector((state) => selectAnyUnreadChannel(state));
	const allNotificationReplyMentionAllClan = useSelector(selectBadgeCountAllClan);
	const totalUnreadMessages = useSelector(selectTotalUnreadDM);
	const { quantityPendingRequest } = useFriends();

	useEffect(() => {
		try {
			let notificationCountAllClan = 0;
			notificationCountAllClan = allNotificationReplyMentionAllClan < 0 ? 0 : allNotificationReplyMentionAllClan;
			const notificationCount = notificationCountAllClan + totalUnreadMessages + quantityPendingRequest;

			if (hasUnreadChannel && !notificationCount) {
				notifee?.setBadgeCount(0);
				return;
			}
			notifee?.setBadgeCount(notificationCount);
		} catch (e) {
			console.error('log  => error BadgeAppIconLoader', e);
		}
	}, [allNotificationReplyMentionAllClan, totalUnreadMessages, quantityPendingRequest, hasUnreadChannel]);
	return null;
};
