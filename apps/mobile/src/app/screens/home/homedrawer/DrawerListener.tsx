import { ActionEmitEvent } from '@mezon/mobile-components';
import {
	ChannelsEntity,
	channelMetaActions,
	channelsActions,
	clansActions,
	gifsStickerEmojiActions,
	selectAnyUnreadChannels,
	selectChannelById,
	selectFetchChannelStatus,
	useAppDispatch,
	useAppSelector
} from '@mezon/store-mobile';
import { SubPanelName, TIME_OFFSET } from '@mezon/utils';
import { useDrawerStatus } from '@react-navigation/drawer';
import { ChannelType } from 'mezon-js';
import React, { useEffect } from 'react';
import { DeviceEventEmitter, View } from 'react-native';
import { useSelector } from 'react-redux';

function useChannelSeen(channelId: string) {
	const dispatch = useAppDispatch();
	const currentChannel = useAppSelector((state) => selectChannelById(state, channelId)) || {};

	const statusFetchChannel = useSelector(selectFetchChannelStatus);
	const resetBadgeCount = !useSelector(selectAnyUnreadChannels);

	useEffect(() => {
		if (channelId) {
			DeviceEventEmitter.emit(ActionEmitEvent.CHANNEL_ID_ACTIVE, channelId);
		}
		const timestamp = Date.now() / 1000;
		dispatch(channelMetaActions.setChannelLastSeenTimestamp({ channelId, timestamp: timestamp + TIME_OFFSET }));
		dispatch(gifsStickerEmojiActions.setSubPanelActive(SubPanelName.NONE));
	}, [channelId, currentChannel, dispatch]);

	useEffect(() => {
		if (currentChannel.type === ChannelType.CHANNEL_TYPE_THREAD) {
			const channelWithActive = { ...currentChannel, active: 1 };
			dispatch(channelsActions.upsertOne(channelWithActive as ChannelsEntity));
		}
		if (!statusFetchChannel) return;
		const numberNotification = currentChannel?.count_mess_unread ? currentChannel?.count_mess_unread : 0;
		if (numberNotification && numberNotification > 0) {
			dispatch(channelsActions.updateChannelBadgeCount({ channelId: channelId, count: 0, isReset: true }));
			dispatch(clansActions.updateClanBadgeCount({ clanId: currentChannel?.clan_id ?? '', count: numberNotification * -1 }));
		}
		if (!numberNotification && resetBadgeCount) {
			dispatch(clansActions.updateClanBadgeCount({ clanId: currentChannel?.clan_id ?? '', count: 0, isReset: true }));
		}
	}, [currentChannel?.id, statusFetchChannel]);
}

function DrawerListener({ channelId }: { channelId: string }) {
	const isOpenDrawer = useDrawerStatus() === 'open';
	useChannelSeen(channelId || '');

	useEffect(() => {
		DeviceEventEmitter.emit(ActionEmitEvent.OPEN_CLOSE_DRAWER, { isOpenDrawer: isOpenDrawer });
	}, [isOpenDrawer]);
	return <View />;
}

export default React.memo(DrawerListener);
