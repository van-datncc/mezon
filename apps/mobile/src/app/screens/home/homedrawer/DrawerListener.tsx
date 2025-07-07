import { useSeenMessagePool } from '@mezon/core';
import {
	channelMembersActions,
	channelsActions,
	ChannelsEntity,
	selectChannelById,
	selectCurrentChannel,
	selectLastMessageByChannelId,
	useAppDispatch,
	useAppSelector
} from '@mezon/store-mobile';
import { useFocusEffect } from '@react-navigation/native';
import { ChannelStreamMode, ChannelType } from 'mezon-js';
import React, { useCallback, useEffect, useRef } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';

function useChannelSeen(channelId: string) {
	const dispatch = useAppDispatch();
	const currentChannel = useAppSelector((state) => selectChannelById(state, channelId));
	const lastMessage = useAppSelector((state) => selectLastMessageByChannelId(state, channelId));

	const { markAsReadSeen } = useSeenMessagePool();
	const handleReadMessage = useCallback(() => {
		if (!lastMessage) {
			return;
		}
		const mode =
			currentChannel?.type === ChannelType.CHANNEL_TYPE_CHANNEL || currentChannel?.type === ChannelType.CHANNEL_TYPE_STREAMING
				? ChannelStreamMode.STREAM_MODE_CHANNEL
				: ChannelStreamMode.STREAM_MODE_THREAD;
		markAsReadSeen(lastMessage, mode, currentChannel?.count_mess_unread || 0);
	}, [lastMessage, currentChannel, markAsReadSeen]);

	useEffect(() => {
		if (currentChannel.type === ChannelType.CHANNEL_TYPE_THREAD) {
			const channelWithActive = { ...currentChannel, active: 1 };
			dispatch(
				channelsActions.upsertOne({
					clanId: currentChannel?.clan_id || '',
					channel: channelWithActive as ChannelsEntity
				})
			);
		}
	}, [currentChannel?.id]);

	useEffect(() => {
		if (lastMessage) {
			handleReadMessage();
		}
	}, [lastMessage, handleReadMessage]);
}

function DrawerListener() {
	const currentChannel = useSelector(selectCurrentChannel);
	const prevChannelIdRef = useRef<string>();
	const dispatch = useAppDispatch();
	useChannelSeen(currentChannel?.channel_id || '');

	const fetchMemberChannel = useCallback(async () => {
		if (!currentChannel) {
			return;
		}
		await dispatch(
			channelMembersActions.fetchChannelMembers({
				clanId: currentChannel?.clan_id || '',
				channelId: (currentChannel?.type === ChannelType.CHANNEL_TYPE_THREAD ? currentChannel?.parent_id : currentChannel?.channel_id) || '',
				channelType: ChannelType.CHANNEL_TYPE_CHANNEL
			})
		);
	}, [currentChannel, dispatch]);

	useFocusEffect(
		useCallback(() => {
			if (prevChannelIdRef.current !== currentChannel?.channel_id) {
				fetchMemberChannel();
			}
			prevChannelIdRef.current = currentChannel?.channel_id;
		}, [currentChannel?.channel_id])
	);

	return <View />;
}

export default React.memo(DrawerListener);
