import { useChatSending } from '@mezon/core';
import { ChannelsEntity } from '@mezon/store-mobile';
import { TypeMessage } from '@mezon/utils';
import { ChannelStreamMode, ChannelType } from 'mezon-js';
import { useEffect, useRef } from 'react';
import ChannelMessages from './ChannelMessages';

type ChannelMediaProps = {
	currentChannel: ChannelsEntity | null;
};

export const ChannelMedia = ({ currentChannel }: ChannelMediaProps) => {
	const mode =
		currentChannel?.type === ChannelType.CHANNEL_TYPE_THREAD ? ChannelStreamMode.STREAM_MODE_THREAD : ChannelStreamMode.STREAM_MODE_CHANNEL;
	const { sendMessage } = useChatSending({ channelOrDirect: currentChannel || undefined, mode });

	const isListenerAttached = useRef(false);

	useEffect(() => {
		if (isListenerAttached.current) return;
		isListenerAttached.current = true;

		const handleKeyPress = (event: KeyboardEvent) => {
			if (event.ctrlKey && event.key === 'b') {
				event.preventDefault();
				sendMessage({ t: 'Buzz!!' }, [], [], [], undefined, undefined, undefined, TypeMessage.MessageBuzz);
			}
		};

		window.addEventListener('keydown', handleKeyPress);

		return () => {
			window.removeEventListener('keydown', handleKeyPress);
			isListenerAttached.current = false;
		};
	}, []);

	if (
		currentChannel?.type === ChannelType.CHANNEL_TYPE_TEXT ||
		currentChannel?.type === ChannelType.CHANNEL_TYPE_THREAD ||
		currentChannel?.type === ChannelType.CHANNEL_TYPE_STREAMING
	) {
		return (
			<ChannelMessages
				key={currentChannel.id}
				clanId={currentChannel?.clan_id || ''}
				channelId={currentChannel?.id}
				channelLabel={currentChannel.channel_label}
				type={currentChannel?.type}
				mode={mode}
			/>
		);
	}
	return <ChannelMessages.Skeleton />;
};
