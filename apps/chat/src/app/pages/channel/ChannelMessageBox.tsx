import { IMessagePayload, MessageBox } from '@mezon/components';
import { useChatChannel } from '@mezon/core';
import { IMessage } from '@mezon/utils';
import { useCallback } from 'react';
import { useThrottledCallback } from 'use-debounce';

type ChannelMessageBoxProps = {
	channelId: string;
};

export function ChannelMessageBox({ channelId }: ChannelMessageBoxProps) {
    const { sendMessage, sendMessageTyping } = useChatChannel(channelId);

    const handleSend = useCallback(
        (mess: IMessagePayload) => {
            const messageToSend: IMessage = {
                ...mess,
            };
            console.log("mess", mess)
            sendMessage(messageToSend);
        },
        [sendMessage],
    );

    const handleTyping = useCallback(
        () => {
            sendMessageTyping();
        },
        [sendMessageTyping],
    );

    const handleTypingDebounced = useThrottledCallback(handleTyping, 1000);

    return (
        <div>
            <MessageBox onSend={handleSend} onTyping={handleTypingDebounced} />
        </div>
    );
}

ChannelMessageBox.Skeleton = () => {
	return (
		<div>
			<MessageBox.Skeleton />
		</div>
	);
};
