import { GifStickerEmojiPopup, MessageBox, ReplyMessageBox, UserMentionList } from '@mezon/components';
import { useChatSending, useGifsStickersEmoji, useMenu, useOnClickOutside } from '@mezon/core';
import { IMessageSendPayload, SubPanelName, ThreadValue } from '@mezon/utils';
import { ApiMessageAttachment, ApiMessageMention, ApiMessageRef } from 'mezon-js/api.gen';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useThrottledCallback } from 'use-debounce';

export type ChannelMessageBoxProps = {
	channelId: string;
	channelLabel: string;
	clanId?: string;
	mode: number;
};

export function ChannelMessageBox({ channelId, channelLabel, clanId, mode }: Readonly<ChannelMessageBoxProps>) {
	const { sendMessage, sendMessageTyping } = useChatSending({ channelId, channelLabel, mode });
	const { isShowMemberList } = useMenu();
	const { subPanelActive } = useGifsStickersEmoji();
	const [classNamePopup, setClassNamePopup] = useState<string>(
		`fixed bottom-[66px] z-10 max-sm:hidden  ${isShowMemberList ? 'right-64' : 'right-4'}`,
	);
	const [isEmojiOnChat, setIsEmojiOnChat] = useState<boolean>(false);
	const panelRef = useRef<HTMLDivElement | null>(null);
	const [showPanel, setShowPanel] = useState(false);

	const handleSend = useCallback(
		(
			content: IMessageSendPayload,
			mentions?: Array<ApiMessageMention>,
			attachments?: Array<ApiMessageAttachment>,
			references?: Array<ApiMessageRef>,
			value?: ThreadValue,
			anonymous?: boolean,
		) => {
			sendMessage(content, mentions, attachments, references, anonymous);
		},
		[sendMessage],
	);

	const handleTyping = useCallback(() => {
		sendMessageTyping();
	}, [sendMessageTyping]);
	const handleTypingDebounced = useThrottledCallback(handleTyping, 1000);

	useEffect(() => {
		if (
			subPanelActive !== SubPanelName.NONE &&
			subPanelActive !== SubPanelName.EMOJI_REACTION_RIGHT &&
			subPanelActive !== SubPanelName.EMOJI_REACTION_BOTTOM
		) {
			console.log(isEmojiOnChat)
			console.log(showPanel)
			setIsEmojiOnChat(true);
			setShowPanel(true);
		} else {
			setIsEmojiOnChat(false);
		}
	}, [subPanelActive]);

	useOnClickOutside(panelRef, (event) => {
		event.stopPropagation();
		setShowPanel(false);
	});

	return (
		<div className="mx-2 relative " role="button" aria-hidden>
			{isEmojiOnChat && showPanel && (
				<div
					ref={panelRef}
					className={classNamePopup}
					onClick={(e) => {
						e.stopPropagation();
					}}
				>
					<GifStickerEmojiPopup />
				</div>
			)}
			<ReplyMessageBox />
			<MessageBox
				listMentions={UserMentionList(channelId)}
				onSend={handleSend}
				onTyping={handleTypingDebounced}
				currentChannelId={channelId}
				currentClanId={clanId}
			/>
			{isEmojiOnChat && (
				<div
					className={`relative h-[300px] overflow-y-scroll w-full hidden max-sm:block`}
					onClick={(e) => {
						e.stopPropagation();
					}}
				>
					<GifStickerEmojiPopup />
				</div>
			)}
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
