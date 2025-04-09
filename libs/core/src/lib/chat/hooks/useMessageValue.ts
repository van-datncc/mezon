import { composeActions, getStore, selectCurrentChannel, selectDmGroupCurrentId, selectModeResponsive, useAppDispatch } from '@mezon/store';
import { ModeResponsive, RequestInput } from '@mezon/utils';
import { useCallback, useMemo } from 'react';

export function useMessageValue() {
	const dispatch = useAppDispatch();
	const setRequestInput = useCallback((request: RequestInput, isThread?: boolean) => {
		const store = getStore();
		const mode = selectModeResponsive(store.getState());
		const currentChannel = selectCurrentChannel(store.getState());
		const currentDmGroupId = selectDmGroupCurrentId(store.getState());

		if (mode === ModeResponsive.MODE_CLAN) {
			dispatch(
				composeActions.setComposeInput({
					channelId: isThread ? currentChannel?.id + String(isThread) : (currentChannel?.id as string),
					request
				})
			);
		} else {
			dispatch(
				composeActions.setComposeInput({
					channelId: currentDmGroupId || '',
					request
				})
			);
		}
	}, []);

	return useMemo(
		() => ({
			setRequestInput
		}),
		[setRequestInput]
	);
}
