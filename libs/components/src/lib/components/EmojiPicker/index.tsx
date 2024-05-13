import { useChatReaction, useEmojiSuggestion, useGifsStickersEmoji, useReference } from '@mezon/core';
import { EmojiPlaces, IMessageWithUser, SubPanelName } from '@mezon/utils';
import { ChannelStreamMode } from 'mezon-js';

export type EmojiCustomPanelOptions = {
	messageEmoji?: IMessageWithUser;
	emojiAction?: EmojiPlaces;
	mode?: number;
};

function EmojiCustomPanel(props: EmojiCustomPanelOptions) {
	const { emojis } = useEmojiSuggestion();
	console.log('emojis', emojis);
	const {
		reactionMessageDispatch,
		setReactionRightState,
		setReactionBottomState,
		setReactionPlaceActive,
		setUserReactionPanelState,
		setReactionBottomStateResponsive,
	} = useChatReaction();
	const { setReferenceMessage } = useReference();
	const { setSubPanelActive, subPanelActive } = useGifsStickersEmoji();
	const { setEmojiSuggestion } = useEmojiSuggestion();

	const handleEmojiSelect = async (emojiPicked: string) => {
		if (props.emojiAction === EmojiPlaces.EMOJI_REACTION || props.emojiAction === EmojiPlaces.EMOJI_REACTION_BOTTOM) {
			await reactionMessageDispatch(
				'',
				props.mode ?? ChannelStreamMode.STREAM_MODE_CHANNEL,
				props.messageEmoji?.id ?? '',
				emojiPicked,
				1,
				props.messageEmoji?.sender_id ?? '',
				false,
			);
			// event.stopPropagation();
			setReactionRightState(false);
			setReactionBottomState(false);
			setReactionPlaceActive(EmojiPlaces.EMOJI_REACTION_NONE);
			setReferenceMessage(null);
			setUserReactionPanelState(false);
			setReactionBottomStateResponsive(false);
		} else if (props.emojiAction === EmojiPlaces.EMOJI_EDITOR) {
			setEmojiSuggestion(emojiPicked);
			// event.stopPropagation();
			setReactionPlaceActive(EmojiPlaces.EMOJI_REACTION_NONE);
			setSubPanelActive(SubPanelName.NONE);
		}
	};

	return (
		<div className="flex h-full px-2 w-full md:w-[500px]">
			<div className="w-[60%] md:w-[10%] md:max-w-[10%] flex flex-col px-2 gap-y-2 max-w-[90%] border"></div>
			<div className="w-auto">
				{
					<div className="grid grid-cols-12 max-h-[400px] overflow-y-scroll hide-scrollbar">
						{emojis.map((item, index) => (
							<button
								key={index}
								className="text-xl emoji-button border border-green-900 hover:bg-[#41434A] hover:rounded-sm m-1 w-8 h-8"
								onClick={() => handleEmojiSelect(item.emoji)}
							>
								{item.emoji}
							</button>
						))}
					</div>
				}
			</div>
		</div>
	);
}

export default EmojiCustomPanel;
