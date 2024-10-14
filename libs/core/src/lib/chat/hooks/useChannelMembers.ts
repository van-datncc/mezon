import {
	channelMetaActions,
	ChannelsEntity,
	channelUsersActions,
	selectAllChannelMembers,
	selectChannelById,
	useAppDispatch,
	useAppSelector
} from '@mezon/store';
import { IMentionOnMessage, uniqueUsers } from '@mezon/utils';
import { ChannelStreamMode } from 'mezon-js';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';

export type useChannelMembersOptions = {
	channelId?: string | null;
	mode: number;
};

export function useChannelMembers({ channelId, mode }: useChannelMembersOptions) {
	const channel = useSelector(selectChannelById(channelId ?? ''));
	const membersOfChild = useAppSelector((state) => (channelId ? selectAllChannelMembers(state, channelId as string) : null));
	const membersOfParent = useAppSelector((state) => (channel?.parrent_id ? selectAllChannelMembers(state, channel.parrent_id as string) : null));

	const dispatch = useAppDispatch();
	const addMemberToThread = useCallback(
		async (currentChannel: ChannelsEntity | null, mentions: IMentionOnMessage[]) => {
			if (currentChannel?.parrent_id === '0') return;
			const timestamp = Date.now() / 1000;

			const userIds = uniqueUsers(mentions, membersOfChild);

			const body = {
				channelId: currentChannel?.channel_id as string,
				channelType: currentChannel?.type,
				userIds: userIds,
				clanId: channel?.clan_id as string
			};
			if (userIds.length > 0) {
				await dispatch(channelUsersActions.addChannelUsers(body));
				dispatch(
					channelMetaActions.updateBulkChannelMetadata([
						{
							id: currentChannel?.channel_id ?? '',
							lastSeenTimestamp: timestamp,
							lastSentTimestamp: timestamp,
							lastSeenPinMessage: '',
							clanId: currentChannel?.clan_id ?? ''
						}
					])
				);
			}
		},
		[dispatch]
	);

	return useMemo(
		() => ({
			membersOfParent: mode === ChannelStreamMode.STREAM_MODE_CHANNEL && channel?.parrent_id !== '0' ? membersOfParent : membersOfChild,
			membersOfChild,
			addMemberToThread
		}),
		[membersOfChild, membersOfParent, mode, channel?.parrent_id, addMemberToThread]
	);
}
