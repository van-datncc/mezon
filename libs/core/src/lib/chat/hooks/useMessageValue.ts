import { referencesActions, selectCurrentChannelId, selectValueTextInputByChannelId, useAppDispatch } from '@mezon/store';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';

export function useMessageValue(channelId?: string) {
	const dispatch = useAppDispatch();
	const currentChannelId = useSelector(selectCurrentChannelId);
	const valueTextInput = useSelector(selectValueTextInputByChannelId(channelId ?? ''));

	const setValueTextInput = useCallback(
		(value: string, isThread?: boolean) => {
			dispatch(
				referencesActions.setValueTextInput({
					channelId: isThread ? currentChannelId + String(isThread) : (currentChannelId as string),
					value,
				}),
			);
		},
		[currentChannelId, dispatch],
	);

	return useMemo(
		() => ({
			valueTextInput,
			setValueTextInput,
		}),
		[setValueTextInput, valueTextInput],
	);
}
