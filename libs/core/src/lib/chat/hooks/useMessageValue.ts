import { selectValueTextInputByChannelId } from '@mezon/store';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export function useMessageValue(channelId: string) {
	const valueTextInput = useSelector(selectValueTextInputByChannelId(channelId));

	return useMemo(
		() => ({
			valueTextInput,
		}),
		[valueTextInput],
	);
}
