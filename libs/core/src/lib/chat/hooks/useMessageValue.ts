import {
	channelsActions,
	selectCurrentChannel,
	selectDmGroupCurrentId,
	selectModeResponsive,
	selectRequestByChannelId,
	useAppDispatch,
	useAppSelector
} from '@mezon/store';
import { ModeResponsive, RequestInput } from '@mezon/utils';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';

export function useMessageValue(channelId?: string) {
	const dispatch = useAppDispatch();
	const mode = useSelector(selectModeResponsive);
	const currentChannel = useAppSelector((state) => selectCurrentChannel(state));
	const currentDmGroupId = useSelector(selectDmGroupCurrentId);
	const request = useAppSelector((state) =>
		selectRequestByChannelId(state, mode === ModeResponsive.MODE_CLAN ? channelId || '' : currentDmGroupId || '')
	);
	const setRequestInput = useCallback(
		(request: RequestInput, isThread?: boolean) => {
			if (mode === ModeResponsive.MODE_CLAN) {
				dispatch(
					channelsActions.setRequestInput({
						clanId: mode === ModeResponsive.MODE_CLAN ? (currentChannel?.clan_id as string) : '0',
						channelId: isThread ? currentChannel?.id + String(isThread) : (currentChannel?.id as string),
						request
					})
				);
			} else {
				dispatch(
					channelsActions.setRequestInput({
						clanId: '0',
						channelId: currentDmGroupId || '',
						request
					})
				);
			}
		},
		[currentChannel, currentDmGroupId, mode, dispatch]
	);

	return useMemo(
		() => ({
			request,
			setRequestInput
		}),
		[setRequestInput, request]
	);
}
