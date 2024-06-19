import { useAuth, useChatReaction, useEmojiSuggestion } from '@mezon/core';
import { EmojiDataOptionals, SenderInfoOptionals, calculateTotalCount, getSrcEmoji } from '@mezon/utils';
import { useEffect, useRef, useState } from 'react';
import UserReactionPanel from './UserReactionPanel';

type EmojiItemProps = {
	emoji: EmojiDataOptionals;
	mode: number;
	refWrapEmoji?: React.RefObject<HTMLDivElement>;
};

function ItemEmoji({ emoji, mode, refWrapEmoji }: EmojiItemProps) {
	const userId = useAuth();
	const { reactionMessageDispatch, userReactionPanelState, setUserReactionPanelState } = useChatReaction();
	const { emojiListPNG } = useEmojiSuggestion();
	const getUrlItem = getSrcEmoji(emoji.emoji ?? '', emojiListPNG);
	const count = calculateTotalCount(emoji.senders);
	const userSenderCount = emoji.senders.find((sender: SenderInfoOptionals) => sender.sender_id === userId.userId)?.count;
	const emojiItemRef = useRef<HTMLDivElement | null>(null);
	const userPanelRef = useRef<HTMLDivElement | null>(null);

	async function reactOnExistEmoji(
		id: string,
		mode: number,
		messageId: string,
		emoji: string,
		count: number,
		message_sender_id: string,
		action_delete: boolean,
	) {
		await reactionMessageDispatch(id, mode ?? 2, messageId ?? '', emoji ?? '', 1, message_sender_id ?? '', false);
	}

	const [emojiShowPanel, setEmojiShowPanel] = useState<EmojiDataOptionals | null>();

	const [topUserPanel, setTopUserPanel] = useState<any>();
	const [bottomUserPanel, setBottomUserPanel] = useState<any>();
	const [leftUserPanel, setLeftUserPanel] = useState<any>();
	const [rightUserPanel, setRightUserPanel] = useState<any>();

	const [arrowTop, setArrowTop] = useState<boolean>(false);
	const [arrowBottom, setArrowBottom] = useState<boolean>(false);
	const [isRightLimit, setIsRightLimit] = useState<boolean>(false);

	const onHoverEnter = () => {
		setEmojiShowPanel(emoji);
		setUserReactionPanelState(true);
	};

	const onHoverLeave = () => {
		setUserReactionPanelState(false);
		setArrowBottom(false);
		setArrowTop(false);
		setIsRightLimit(false);
	};

	useEffect(() => {
		if (!userReactionPanelState) {
			setEmojiShowPanel(null);
		}
	}, [userReactionPanelState]);

	useEffect(() => {
		if (emojiShowPanel && emojiItemRef.current && userPanelRef) {
			const screenWidth = window.innerWidth;
			const userPanelWidth = userPanelRef.current?.getBoundingClientRect().width;
			const userPanelHeight = userPanelRef.current?.getBoundingClientRect().height;
			const emojiWidth = emojiItemRef.current.getBoundingClientRect().width;
			const emojiHeight = emojiItemRef.current.getBoundingClientRect().height;
			const disLeftEmojiToLeftScreen = emojiItemRef.current.getBoundingClientRect().left;
			const disCenterEmojiToRightScreen = screenWidth - disLeftEmojiToLeftScreen - emojiWidth / 2;
			const disTopEmojiToTopScreen = emojiItemRef.current?.getBoundingClientRect().top;

			if (disCenterEmojiToRightScreen > userPanelWidth! / 2 && disTopEmojiToTopScreen > userPanelHeight!) {
				setRightUserPanel(disCenterEmojiToRightScreen - userPanelWidth! / 2);
				setTopUserPanel(disTopEmojiToTopScreen - userPanelHeight! - 15);
				setLeftUserPanel('auto');
				setBottomUserPanel('auto');
				setArrowBottom(true);
				setArrowTop(false);
				setIsRightLimit(false);
			} else if (disCenterEmojiToRightScreen > userPanelWidth! / 2 && disTopEmojiToTopScreen < userPanelHeight!) {
				setRightUserPanel(disCenterEmojiToRightScreen - userPanelWidth! / 2);
				setTopUserPanel(disTopEmojiToTopScreen + emojiHeight + 15);
				setLeftUserPanel('auto');
				setBottomUserPanel('auto');
				setArrowBottom(false);
				setArrowTop(true);
				setIsRightLimit(false);
			} else if (disCenterEmojiToRightScreen < userPanelWidth! / 2 && disTopEmojiToTopScreen > userPanelHeight!) {
				setRightUserPanel(disCenterEmojiToRightScreen - emojiWidth / 2);
				setTopUserPanel(disTopEmojiToTopScreen - userPanelHeight! - 15);
				setLeftUserPanel('auto');
				setBottomUserPanel('auto');
				setArrowBottom(true);
				setArrowTop(false);
				setIsRightLimit(true);
			} else if (disCenterEmojiToRightScreen < userPanelWidth! / 2 && disTopEmojiToTopScreen < userPanelHeight!) {
				setRightUserPanel(disCenterEmojiToRightScreen - emojiWidth / 2);
				setTopUserPanel(disTopEmojiToTopScreen + emojiHeight + 15);
				setLeftUserPanel('auto');
				setBottomUserPanel('auto');
				setArrowBottom(false);
				setArrowTop(true);
				setIsRightLimit(true);
			}
		}
	}, [emojiShowPanel, userPanelRef]);

	return (
		<>
			<div className="flex flex-row gap-1">
				<div
					ref={emojiItemRef}
					onMouseEnter={onHoverEnter}
					onMouseLeave={onHoverLeave}
					className={`rounded-md w-fit min-w-12 gap-3 h-6 flex flex-row z-40
						cursor-pointer justify-center items-center relative
						${userSenderCount! > 0 ? 'dark:bg-[#373A54] bg-gray-200 border-blue-600 border' : 'dark:bg-[#2B2D31] bg-bgLightMode border-[#313338]'}
						`}
					onClick={() => reactOnExistEmoji(emoji.id ?? '', mode, emoji.message_id ?? '', emoji.emoji ?? '', 1, userId.userId ?? '', false)}
				>
					<span className=" absolute left-[5px] ">
						{' '}
						<img src={getUrlItem} className="w-4 h-4"></img>{' '}
					</span>

					<div className="text-[13px] top-[2px] ml-5 absolute justify-center text-center cursor-pointer dark:text-white text-black">
						<p>{count}</p>
					</div>
				</div>
			</div>
			{emojiShowPanel && userReactionPanelState && (
				<div
					ref={userPanelRef}
					className="w-fit h-fit z-50 border border-green-500"
					style={{
						position: 'fixed',
						top: topUserPanel,
						left: leftUserPanel,
						right: rightUserPanel,
						bottom: bottomUserPanel,
					}}
				>
					<UserReactionPanel
						arrowTop={arrowTop}
						arrowBottom={arrowBottom}
						isRightLimit={isRightLimit}
						emojiShowPanel={emojiShowPanel!}
						mode={mode}
					/>
				</div>
			)}
		</>
	);
}

export default ItemEmoji;
