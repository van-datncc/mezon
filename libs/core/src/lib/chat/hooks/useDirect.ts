import { appActions, directActions, selectAllDirectMessages, selectDirectsUnreadlist, selectIsLoadDMData, selectIsShowMemberListDM, selectIsUseProfileDM, useAppDispatch } from '@mezon/store';

import { useCallback, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ChannelType } from 'mezon-js';
import { ApiCreateChannelDescRequest } from 'mezon-js/api.gen';
import { useAppParams } from '../../app/hooks/useAppParams';

type UseDirectParams = {
	autoFetch: boolean, 
}

export function useDirect({autoFetch = false }:UseDirectParams = {autoFetch : false}) {
	const dispatch = useAppDispatch();
	const listDM = useSelector(selectAllDirectMessages);
	const { directId: currentDmGroupId } = useAppParams();
	const listDirectMessage = useSelector(selectDirectsUnreadlist);
	const listDirectMessageUnread = listDirectMessage.filter((directMessage) => directMessage.id !== currentDmGroupId);

	const isLoadDM = useSelector(selectIsLoadDMData);
	const isShowMemberListDM = useSelector(selectIsShowMemberListDM);
	const isUseProfileDM = useSelector(selectIsUseProfileDM);

	const createDirectMessageWithUser = useCallback(
		async (userId: string) => {
			const bodyCreateDm: ApiCreateChannelDescRequest = {
				type: ChannelType.CHANNEL_TYPE_DM,
				channel_private: 1,
				user_ids: [userId],
			};
			const response = await dispatch(directActions.createNewDirectMessage(bodyCreateDm));
			const resPayload = response.payload as ApiCreateChannelDescRequest;

			if (resPayload.channel_id) {
				await dispatch(
					directActions.joinDirectMessage({
						directMessageId: resPayload.channel_id,
						channelName: resPayload.channel_label,
						type: Number(resPayload.type),
					}),
				);
			}

			return resPayload;
		},
		[dispatch],
	);
	const refechDMList = useCallback(
		() => {
			dispatch(directActions.fetchDirectMessage({}))
		},
		[dispatch],
	);

	const setIsShowMemberListDM = useCallback(
		async (status: boolean) => {
			await dispatch(appActions.setIsShowMemberListDM(status));
		},
		[dispatch],
	);

	const setIsUseProfileDM = useCallback(
		async (status: boolean) => {
			await dispatch(appActions.setIsUseProfileDM(status));
		},
		[dispatch],
	);

	useEffect(() => {
		if (isLoadDM || !autoFetch){
			return
		} 
		refechDMList()
	}, [isLoadDM, refechDMList, autoFetch]);

	return useMemo(
		() => ({
			listDM,
			isShowMemberListDM,
			isUseProfileDM,
			createDirectMessageWithUser,
			refechDMList,
			setIsShowMemberListDM,
			setIsUseProfileDM,
			listDirectMessageUnread
		}),
		[
			listDM, 
			isUseProfileDM,
			isShowMemberListDM,
			createDirectMessageWithUser, 
			refechDMList,
			setIsShowMemberListDM,
			setIsUseProfileDM,
			listDirectMessageUnread],
	);
}
