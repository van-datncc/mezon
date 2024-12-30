import { ActionEmitEvent } from '@mezon/mobile-components';
import { ChannelStreamMode } from 'mezon-js';
import { memo, useEffect, useRef } from 'react';
import { DeviceEventEmitter } from 'react-native';
import UseMentionList from '../../../../../../hooks/useUserMentionList';

interface IChatMessageLeftAreaProps {
	mode: ChannelStreamMode;
	channelId: string;
	parentId: string;
}

export const ChatBoxListener = memo(({ parentId, mode, channelId }: IChatMessageLeftAreaProps) => {
	const listMentions = UseMentionList({
		channelID: mode === ChannelStreamMode.STREAM_MODE_THREAD ? parentId : channelId || '',
		channelMode: mode
	});
	const previousListMentions = useRef(null);

	useEffect(() => {
		const timeoout = setTimeout(() => {
			if (JSON.stringify(previousListMentions?.current) !== JSON.stringify(listMentions || previousListMentions?.current) && !!listMentions) {
				DeviceEventEmitter.emit(ActionEmitEvent.ON_SET_LIST_MENTION_DATA, { data: listMentions });
				previousListMentions.current = listMentions;
			}
		}, 300);

		return () => {
			if (timeoout) clearTimeout(timeoout);
		};
	}, [listMentions]);

	return null;
});
