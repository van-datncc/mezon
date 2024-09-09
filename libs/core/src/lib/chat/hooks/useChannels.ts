import { ChannelsEntity, channelsActions, selectAllChannels, selectCurrentChannelId, selectCurrentClanId, useAppDispatch } from '@mezon/store';
import { ChannelThreads } from '@mezon/utils';
import React from 'react';
import { useSelector } from 'react-redux';
import { useAppNavigation } from '../../app/hooks/useAppNavigation';

export function useChannels() {
	const channels = useSelector(selectAllChannels);
	const { toChannelPage, navigate, toMembersPage } = useAppNavigation();
	const currentClanId = useSelector(selectCurrentClanId);
	const currentChannelId = useSelector(selectCurrentChannelId);
	const dispatch = useAppDispatch();

	const channelFilter = React.useMemo(() => channels.filter((channel) => channel.parrent_id === '0' || channel.parrent_id === ''), [channels]);
	const listChannels = React.useMemo(() => {
		const channelThread = channelFilter.map((channel) => {
			const thread = channels.filter((thread) => channel && channel?.channel_id === thread.parrent_id) as ChannelsEntity[];
			return {
				...channel,
				threads: thread
			};
		});
		return channelThread as ChannelThreads[];
	}, [channelFilter, channels]);

	const handleConfirmDeleteChannel = async (channelId: string, clanId: string) => {
		await dispatch(channelsActions.deleteChannel({ channelId, clanId: clanId as string }));
		navigateAfterDeleteChannel(channelId);
	};

	const navigateAfterDeleteChannel = (channelId: string) => {
		let channelLink: string;
		if (channels.length === 1) {
			channelLink = toMembersPage(currentClanId as string);
			navigate(channelLink);
			return;
		}
		if (channelId === currentChannelId) {
			if (channelId === channels[0].channel_id) {
				channelLink = toChannelPage(channels[1].channel_id as string, currentClanId as string);
				navigate(channelLink);
				return;
			}
			channelLink = toChannelPage(channels[0].channel_id as string, currentClanId as string);
			navigate(channelLink);
			return;
		}
	};

	return React.useMemo(
		() => ({
			channels,
			listChannels,
			navigateAfterDeleteChannel,
			handleConfirmDeleteChannel
		}),
		[channels, listChannels, navigateAfterDeleteChannel, handleConfirmDeleteChannel]
	);
}
