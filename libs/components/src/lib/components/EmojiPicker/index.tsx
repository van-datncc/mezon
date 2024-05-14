import { useChatReaction, useEmojiSuggestion, useGifsStickersEmoji, useReference } from '@mezon/core';
import { EmojiPlaces, IEmoji, IMessageWithUser, SubPanelName } from '@mezon/utils';
import { ChannelStreamMode } from 'mezon-js';
import { useState } from 'react';
import { Icons } from '../../components';

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
	const [emojiHoverNative, setEmojiHoverNative] = useState<string>('');
	const [emojiHoverShortCode, setEmojiHoverShortCode] = useState<string>('');

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

	const handleOnHover = (emojiHover: IEmoji) => {
		setEmojiHoverNative(emojiHover.emoji);
		setEmojiHoverShortCode(emojiHover.shortname);
	};

	return (
		<div className="flex max-h-full flex-row w-full md:w-[500px]">
			<div className="w-[60%] md:w-[10%] md:max-w-[10%] flex flex-col gap-y-2 max-w-[90%]  md:ml-2 bg-[#1E1F22] mb-2 pt-2 pl-1 md:items-start">
				<div className="w-9 h-9  flex flex-row justify-center items-center hover:bg-[#41434A] hover:rounded-md">
					<Icons.ClockHistory defaultSize="w-7 h-7" />
				</div>

				<hr className="px-2 h-1 w-full pr-1 "></hr>
				<div className="w-9 h-9  flex flex-row justify-center items-center hover:bg-[#41434A] hover:rounded-md">
					<Icons.Smile defaultSize="w-7 h-7" />
				</div>
			</div>
			<div className="w-auto h-auto flex flex-col gap-y-1">
				{
					<div className="grid grid-cols-12 gap-[0.1rem] max-h-[352px] overflow-y-scroll hide-scrollbar">
						{emojis.map((item, index) => (
							<button
								key={index}
								className="text-xl emoji-button border rounded-md border-[#363A53] hover:bg-[#41434A] hover:rounded-md m-1 w-8 h-8"
								onClick={() => handleEmojiSelect(item.emoji)}
								onMouseEnter={() => handleOnHover(item)}
							>
								{item.emoji}
							</button>
						))}
					</div>
				}
				<div className="w-full min-h-12 bg-[#232428] mb-2 flex flex-row items-center pl-1 gap-x-1">
					<span className="text-3xl"> {emojiHoverNative}</span>
					{emojiHoverShortCode}
				</div>
			</div>
		</div>
	);
}

export default EmojiCustomPanel;
