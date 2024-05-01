import { useChatReaction, useEmojiSuggestion, useGifsStickersEmoji, useReference } from '@mezon/core';
import { EmojiPlaces, IMessageWithUser, SubPanelName } from '@mezon/utils';
import EmojiPicker, { EmojiClickData, EmojiStyle, SuggestionMode, Theme } from 'emoji-picker-react';
import { ChannelStreamMode } from 'mezon-js';
import { useRef } from 'react';

export type EmojiPickerOptions = {
	messageEmoji?: IMessageWithUser;
	emojiAction?: EmojiPlaces;
	mode?: number;
	emojiExist?: string;
};

function EmojiPickerComp(props: EmojiPickerOptions) {
	const { reactionMessageDispatch, setReactionRightState, setReactionBottomState, setReactionPlaceActive, setUserReactionPanelState } =
		useChatReaction();
	const { setReferenceMessage } = useReference();
	const { setEmojiSuggestion } = useEmojiSuggestion();
	const { setSubPanelActive, subPanelActive } = useGifsStickersEmoji();
	const handleEmojiSelect = async (emojiData: EmojiClickData, event: MouseEvent) => {
		if (props.emojiAction === EmojiPlaces.EMOJI_REACTION || props.emojiAction === EmojiPlaces.EMOJI_REACTION_BOTTOM) {
			await reactionMessageDispatch(
				'',
				props.mode ?? ChannelStreamMode.STREAM_MODE_CHANNEL,
				props.messageEmoji?.id ?? '',
				emojiData.emoji,
				1,
				props.messageEmoji?.sender_id ?? '',
				false,
			);
			event.stopPropagation();
			setReactionRightState(false);
			setReactionBottomState(false);
			setReactionPlaceActive(EmojiPlaces.EMOJI_REACTION_NONE);
			setReferenceMessage(null);
			setUserReactionPanelState(false);
		} else if (props.emojiAction === EmojiPlaces.EMOJI_EDITOR) {
			setEmojiSuggestion(emojiData.emoji);
			event.stopPropagation();
			setReactionPlaceActive(EmojiPlaces.EMOJI_REACTION_NONE);
			setSubPanelActive(SubPanelName.NONE);
		}
	};
	const emojiRef = useRef<HTMLDivElement>(null);
	const parentDiv = emojiRef?.current?.parentElement; // Lấy thẻ div cha
	const parentWidth = parentDiv?.offsetWidth; // Lấy chiều rộng của div cha
	const parentHeight = parentDiv?.offsetHeight; // Lấy chiều cao của div cha
	console.log(parentWidth);
	return (
		<div onClick={(event) => event.stopPropagation()} className="z-20" ref={emojiRef}>
			<EmojiPicker
				suggestedEmojisMode={SuggestionMode.FREQUENT}
				onEmojiClick={handleEmojiSelect}
				width={parentWidth}
				theme={Theme.DARK}
				height={458}
				emojiStyle={EmojiStyle.NATIVE}
				autoFocusSearch={subPanelActive === SubPanelName.EMOJI}
			/>
		</div>
	);
}

export default EmojiPickerComp;
