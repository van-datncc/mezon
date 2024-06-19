import { GifStickerEmojiPopup, ReactionBottom, UserReactionPanel } from '@mezon/components';
import { useChatReaction, useReference } from '@mezon/core';
import { EmojiDataOptionals, IMessageWithUser } from '@mezon/utils';
import { Fragment, useEffect, useRef, useState } from 'react';
import ItemEmoji from './ItemEmoji';

type MessageReactionProps = {
	message: IMessageWithUser;
	currentChannelId: string;
	mode: number;
};

// TODO: refactor component for message lines
const MessageReaction: React.FC<MessageReactionProps> = ({ currentChannelId, message, mode }) => {
	const {
		reactionBottomState,
		reactionBottomStateResponsive,
		convertReactionToMatchInterface,
	} = useChatReaction();

	const getReactionsByChannelId = (data: EmojiDataOptionals[], mesId: string) => {
		return data.filter((item: any) => item.message_id === mesId && item.channel_id === currentChannelId);
	};

	const dataReaction = getReactionsByChannelId(convertReactionToMatchInterface, message.id);

	const { idMessageRefReaction, setIdReferenceMessageReaction } = useReference();

	const checkMessageToMatchMessageRef = (message: IMessageWithUser) => {
		if (message.id === idMessageRefReaction) {
			return true;
		} else {
			return false;
		}
	};

	// For user reaction panel
	const [emojiShowUserReaction, setEmojiShowUserReaction] = useState<EmojiDataOptionals>();
	const checkEmojiToMatchWithEmojiHover = (emoji: EmojiDataOptionals) => {
		if (emoji.emoji === emojiShowUserReaction?.emoji) {
			return true;
		} else {
			return false;
		}
	};
	// Check position sender panel && emoji panel

	const contentDiv = useRef<HTMLDivElement | null>(null);
	const [hoverEmoji, setHoverEmoji] = useState<EmojiDataOptionals | null>();
	const [showSenderPanelIn1s, setShowSenderPanelIn1s] = useState(true);
	const emojiIndexMap: { [key: string]: number } = {};

	dataReaction &&
		dataReaction.forEach((emoji: EmojiDataOptionals, index: number) => {
			if (emoji.emoji !== undefined) {
				emojiIndexMap[emoji.emoji] = index;
			}
		});

	// work in mobile
	useEffect(() => {
		if (showSenderPanelIn1s) {
			const timer = setTimeout(() => {
				setShowSenderPanelIn1s(false);
			}, 3000);
			return () => clearTimeout(timer);
		}
	}, [showSenderPanelIn1s]);

	const smileButtonRef = useRef<HTMLDivElement | null>(null);
	const [showIconSmile, setShowIconSmile] = useState<boolean>(false);

	return (
		<div className="relative pl-3">
			{checkMessageToMatchMessageRef(message) && reactionBottomState && reactionBottomStateResponsive && (
				<div className={`w-fit md:hidden z-30 absolute bottom-0 block`}>
					<div className="scale-75 transform mb-0 z-20">
						<GifStickerEmojiPopup messageEmojiId={message.id} mode={mode} />
					</div>
				</div>
			)}

			<div ref={contentDiv} className="flex  gap-2  ml-14">
				{showSenderPanelIn1s && (
					<div className="hidden max-sm:block max-sm:-top-[0] absolute">
						{hoverEmoji &&
							checkMessageToMatchMessageRef(message) &&
							checkEmojiToMatchWithEmojiHover(hoverEmoji) &&
							emojiShowUserReaction && <UserReactionPanel emojiShowPanel={emojiShowUserReaction} mode={mode} />}
					</div>
				)}

				<div
					className=" w-fit flex flex-wrap gap-2 whitespace-pre-wrap"
					onMouseEnter={() => setShowIconSmile(true)}
					onMouseLeave={() => setShowIconSmile(false)}
				>
					{dataReaction?.map((emoji: EmojiDataOptionals, index: number) => {
						return (
							<Fragment key={`${index + message.id}`}>
								<ItemEmoji mode={mode} emoji={emoji}/>
							</Fragment>
						);
					})}
					{dataReaction.length > 0 && (
						<div className="w-6 h-6  justify-center flex flex-row items-center cursor-pointer relative">
							{showIconSmile && <ReactionBottom smileButtonRef={smileButtonRef} />}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default MessageReaction;
