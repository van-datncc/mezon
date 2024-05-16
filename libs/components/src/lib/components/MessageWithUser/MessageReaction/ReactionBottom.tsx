import { GifStickerEmojiPopup, Icons } from '@mezon/components';
import { useChatReaction, useReference } from '@mezon/core';
import { EmojiPlaces, IMessageWithUser } from '@mezon/utils';
import { ChannelStreamMode } from 'mezon-js';
import { useState } from 'react';

type ReactionBottomProps = {
	message: IMessageWithUser;
	moveToTop: boolean;
	smileButtonRef: React.RefObject<HTMLDivElement>;
};

const ReactionBottom = ({ message, smileButtonRef, moveToTop }: ReactionBottomProps) => {
	const {
		setReactionRightState,
		setReactionPlaceActive,
		setReactionBottomState,
		setUserReactionPanelState,
		reactionPlaceActive,
		setReactionBottomStateResponsive,
		reactionBottomStateResponsive,
	} = useChatReaction();
	const { setReferenceMessage, referenceMessage } = useReference();

	const handleClickOpenEmojiBottom = (event: React.MouseEvent<HTMLDivElement>) => {
		checkMessageMatched(message);
		setReactionRightState(false);
		setReferenceMessage(message);
		setReactionPlaceActive(EmojiPlaces.EMOJI_REACTION_BOTTOM);
		setReactionBottomState(false);
		event.stopPropagation();
		setHighLightColor('#FFFFFF');
		setReactionBottomState(true);
		setUserReactionPanelState(false);
		setReactionBottomStateResponsive(true);
	};

	const checkMessageMatched = (message: IMessageWithUser) => {
		return message.id === referenceMessage?.id;
	};

	const [highlightColor, setHighLightColor] = useState('#AEAEAE');
	const setColorForIconSmile = (message: IMessageWithUser) => {
		if (checkMessageMatched(message)) {
			return '#AEAEAE';
		} else if (highlightColor !== '#AEAEAE') {
			return highlightColor;
		}
	};

	const handleHoverSmileButton = () => {
		setUserReactionPanelState(false);
		// setReferenceMessage(null);
	};
	const [isFixed, setIsFixed] = useState(false);

	return (
		<>
			{message.id === referenceMessage?.id && (
				<div
					onMouseEnter={handleHoverSmileButton}
					onClick={handleClickOpenEmojiBottom}
					className="absolute w-8  h-4 pl-2 left-[100%] duration-100"
					ref={smileButtonRef}
				>
					<Icons.Smile defaultSize="w-4 h-4" defaultFill={setColorForIconSmile(message)} />
					{reactionPlaceActive === EmojiPlaces.EMOJI_REACTION_BOTTOM && checkMessageMatched(message) && (
						<div
							className={`hidden md:block w-fit ${isFixed ? 'fixed' : 'absolute'} ${moveToTop ? 'right-[-2rem] bottom-[-1rem]' : 'left-[-2rem] bottom-[-5rem]'}  z-20`}
						>
							<div className="scale-75 transform mb-0 z-10">
								<GifStickerEmojiPopup
									messageEmoji={message}
									mode={ChannelStreamMode.STREAM_MODE_CHANNEL}
									emojiAction={EmojiPlaces.EMOJI_REACTION_BOTTOM}
								/>
							</div>
						</div>
					)}
				</div>
			)}
		</>
	);
};

export default ReactionBottom;
