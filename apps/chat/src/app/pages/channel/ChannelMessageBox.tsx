import { MentionData } from '@draft-js-plugins/mention';
import { MessageBox } from '@mezon/components';
import { useChannelMembers, useChatSending } from '@mezon/core';
import { ChannelMembersEntity } from '@mezon/store';
import { IMessageSendPayload } from '@mezon/utils';
import { useCallback, useState } from 'react';
import { useThrottledCallback } from 'use-debounce';

type ChannelMessageBoxProps = {
	channelId: string;
};

export function ChannelMessageBox({ channelId }: ChannelMessageBoxProps) {
	const { sendMessage, sendMessageTyping } = useChatSending({ channelId });

	const handleSend = useCallback(
		(mess: IMessageSendPayload) => {
			sendMessage(mess);
		},
		[sendMessage],
	);

	const handleTyping = useCallback(() => {
		sendMessageTyping();
	}, [sendMessageTyping]);

	const handleTypingDebounced = useThrottledCallback(handleTyping, 1000);
	const { members } = useChannelMembers({ channelId });
	const userMentionRaw = members[0].users;
	const newUserMentionList: MentionData[] = userMentionRaw?.map((item: ChannelMembersEntity) => ({
		avatar: item?.user?.avatar_url ?? '',
		name: item?.user?.username ?? '',
		id: item?.user?.id ?? '',
	}));

	const [isOpen, setIsOpen] = useState(false);
	const handleBlurEmoji = () => {
		console.log('clicked');
		return setIsOpen(!isOpen);
	};

	return (
		<div onClick={handleBlurEmoji}>
			<MessageBox
				// onBlurEmoji={handleBlurEmoji}
				isOpenEmoji={isOpen}
				listMentions={newUserMentionList}
				onSend={handleSend}
				onTyping={handleTypingDebounced}
			/>
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
