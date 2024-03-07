import { selectMembersByChannelId } from '@mezon/store';
import React, { useMemo } from 'react';
import { useDirect } from './useDirect';
import { useSelector } from 'react-redux';
import { clansActions, useAppDispatch } from '@mezon/store';
import { ApiLinkInviteUser } from 'vendors/mezon-js/packages/mezon-js/api.gen';
import { useClans } from './useClans';

export function useDMInvite(channelID?:string) {
		const dispatch = useAppDispatch();
		const { listDM: dmGroupChatList } = useDirect({autoFetch:true});
		const rawMembers = useSelector(selectMembersByChannelId(channelID));
		const { usersClan } = useClans();
		
		const listDMInvite = useMemo(() => {
			const userIdInClanArray = usersClan.map(user => user.id);
			const memberIds = rawMembers.map(member => member.id);
			const filteredListUserClan = dmGroupChatList.filter(item => {
				if ((item.user_id && item.user_id.length > 1) || 
				(item.user_id && item.user_id.length === 1 && !userIdInClanArray.includes(item.user_id[0]))) {
					return true;
				}
				return false;
			});
			if (channelID === '') {
				return filteredListUserClan;
			}
			const filteredListUserChannel = dmGroupChatList.filter(item => {
				if ((item.user_id && item.user_id.length > 1) || 
					(item.user_id && item.user_id.length === 1 && !memberIds.includes(item.user_id[0]))) {
					return true;
				}
				return false;
			});
			return filteredListUserChannel;
		}, [channelID, dmGroupChatList, usersClan, rawMembers]);

		const createLinkInviteUser = React.useCallback(
			async (clan_id: string, channel_id: string, expiry_time: number) => {
				const action = await dispatch(
					clansActions.createLinkInviteUser({
						clan_id: clan_id,
						channel_id: channel_id,
						expiry_time: expiry_time,
					}),
				);
				const payload = action.payload as ApiLinkInviteUser;
				return payload;
			},
			[dispatch],
		);

        

	return useMemo(
		() => ({
			listDMInvite,
			createLinkInviteUser
		}),
		[listDMInvite, createLinkInviteUser],
	);
}
