import { MentionData } from '@draft-js-plugins/mention';
import { MessageBox, ReplyMessage, UserMentionList } from '@mezon/components';
import { ChatContext, useChannelMembers, useChatSending } from '@mezon/core';
import { ChannelMembersEntity } from '@mezon/store';
import { IMessageSendPayload } from '@mezon/utils';
import { useCallback, useContext, useEffect } from 'react';
import { useThrottledCallback } from 'use-debounce';
import { ApiMessageAttachment, ApiMessageMention, ApiMessageRef } from 'vendors/mezon-js/packages/mezon-js/dist/api.gen';

type ChannelMessageBoxProps = {
	channelId: string;
	controlEmoji?: boolean;
	clanId?: string;
};

export function ChannelMessageBox({ channelId, controlEmoji, clanId }: ChannelMessageBoxProps) {
	const { sendMessage, sendMessageTyping } = useChatSending({ channelId });

	const handleSend = useCallback(
		(
			content: IMessageSendPayload,
			mentions?: Array<ApiMessageMention>,
			attachments?: Array<ApiMessageAttachment>,
			references?: Array<ApiMessageRef>,
		) => {
			sendMessage(content, mentions, attachments, references);
		},
		[sendMessage],
	);

	const handleTyping = useCallback(() => {
		sendMessageTyping();
	}, [sendMessageTyping]);

	const handleTypingDebounced = useThrottledCallback(handleTyping, 1000);

	const { setIsOpenReply } = useContext(ChatContext);

	useEffect(() => {
		setIsOpenReply(false);
	}, [channelId, clanId]);

	return (
		<div className="mx-4 relative">
			<ReplyMessage />
			<MessageBox
				isOpenEmojiPropOutside={controlEmoji}
				listMentions={UserMentionList(channelId)}
				onSend={handleSend}
				onTyping={handleTypingDebounced}
				currentChannelId={channelId}
				currentClanId={clanId}
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
