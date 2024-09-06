import { GifStickerEmojiPopup, MessageBox, UserMentionList } from '@mezon/components';
import { useChatSending, useGifsStickersEmoji } from '@mezon/core';
// import { selectIdMessageRefReply } from '@mezon/store';
import { EmojiPlaces, IMessageSendPayload, SubPanelName, ThreadValue } from '@mezon/utils';
import { ApiMessageAttachment, ApiMessageMention, ApiMessageRef } from 'mezon-js/api.gen';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useThrottledCallback } from 'use-debounce';

export type ChannelMessageBoxProps = {
	channelId: string;
	clanId?: string;
	mode: number;
};

export function ChannelMessageBox({ channelId, clanId, mode }: Readonly<ChannelMessageBoxProps>) {
	const dispatch = useDispatch();
	const { sendMessage, sendMessageTyping } = useChatSending({ channelId, mode });
	const { subPanelActive } = useGifsStickersEmoji();

	const [isEmojiOnChat, setIsEmojiOnChat] = useState<boolean>(false);
	// const idMessageRefReply = useSelector(selectIdMessageRefReply(channelId));

	const handleSend = useCallback(
		(
			content: IMessageSendPayload,
			mentions?: Array<ApiMessageMention>,
			attachments?: Array<ApiMessageAttachment>,
			references?: Array<ApiMessageRef>,
			value?: ThreadValue,
			anonymous?: boolean,
			mentionEveryone?: boolean
		) => {
			sendMessage(content, mentions, attachments, references, anonymous, mentionEveryone);
		},
		[sendMessage]
	);

	const handleTyping = useCallback(() => {
		sendMessageTyping();
	}, [sendMessageTyping]);
	const handleTypingDebounced = useThrottledCallback(handleTyping, 1000);

	useEffect(() => {
		const isEmojiReactionPanel = subPanelActive === SubPanelName.EMOJI_REACTION_RIGHT || subPanelActive === SubPanelName.EMOJI_REACTION_BOTTOM;

		const isOtherActivePanel = subPanelActive !== SubPanelName.NONE && !isEmojiReactionPanel;

		const isSmallScreen = window.innerWidth < 640;

		const isActive = isOtherActivePanel || (isEmojiReactionPanel && isSmallScreen);

		setIsEmojiOnChat(isActive);
	}, [subPanelActive]);

	// const handleCloseReplyMessageBox = () => {
	// 	dispatch(referencesActions.setIdReferenceMessageReply({ channelId, idMessageRefReply: '' }));
	// };

	// useEscapeKey(handleCloseReplyMessageBox);

	return (
		<div className="mx-2 relative" role="button">
			{isEmojiOnChat && (
				<div
					onClick={(e) => {
						e.stopPropagation();
					}}
					className="max-sbm:bottom-[60px] bottom-[76px] right-[10px] absolute bg"
				>
					<GifStickerEmojiPopup emojiAction={EmojiPlaces.EMOJI_EDITOR} mode={mode} />
				</div>
			)}
			{/* {idMessageRefReply && <ReplyMessageBox channelId={channelId} idMessage={idMessageRefReply} />} */}
			<MessageBox
				listMentions={UserMentionList({ channelID: channelId, channelMode: mode })}
				onSend={handleSend}
				onTyping={handleTypingDebounced}
				currentChannelId={channelId}
				currentClanId={clanId}
				mode={mode}
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
