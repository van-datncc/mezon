import { MentionData } from '@draft-js-plugins/mention';
import { IMessagePayload, MessageBox } from '@mezon/components';
import { useChatChannel } from '@mezon/core';
import { ChannelMembersEntity } from '@mezon/store';
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
			sendMessage(messageToSend);
		},
		[sendMessage],
	);

	const handleTyping = useCallback(() => {
		sendMessageTyping();
	}, [sendMessageTyping]);

	const handleTypingDebounced = useThrottledCallback(handleTyping, 1000);
	const { members } = useChatChannel(channelId);
	const userMentionRaw = members[0].users;
	const newUserMentionList: MentionData[] = userMentionRaw?.map((item: ChannelMembersEntity) => ({
		avatar: item?.user?.avatar_url ?? '',
		name: item?.user?.username ?? '',
		id: item?.user?.id ?? '',
	}));

	return (
		<div>
			<MessageBox memberList={newUserMentionList && newUserMentionList} onSend={handleSend} onTyping={handleTypingDebounced} />
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
