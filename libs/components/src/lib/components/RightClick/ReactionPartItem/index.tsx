import { useAuth, useChatReaction } from '@mezon/core';
import { selectCurrentChannelId } from '@mezon/store';
import { RightClickPos, getSrcEmoji } from '@mezon/utils';
import useDataEmojiSvg from 'libs/core/src/lib/chat/hooks/useDataEmojiSvg';
import { rightClickAction, selectMessageIdRightClicked, selectModeActive } from 'libs/store/src/lib/rightClick/rightClick.slice';
import { memo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface IReactionItem {
	emojiShortCode: string;
}

const ReactionItem: React.FC<IReactionItem> = ({ emojiShortCode }) => {
	const { emojiListPNG } = useDataEmojiSvg();
	const { reactionMessageDispatch } = useChatReaction();
	const getUrl = getSrcEmoji(emojiShortCode, emojiListPNG ?? []);
	const getModeActive = useSelector(selectModeActive);
	const currentChannelId = useSelector(selectCurrentChannelId);
	const getMessageIdRightClicked = useSelector(selectMessageIdRightClicked);
	const userId = useAuth();
	const dispatch = useDispatch();

	const handleClickEmoji = useCallback(async () => {
		await reactionMessageDispatch(
			'',
			getModeActive,
			currentChannelId ?? '',
			getMessageIdRightClicked,
			emojiShortCode,
			1,
			userId.userId ?? '',
			false,
		);
		dispatch(rightClickAction.setPosClickActive(RightClickPos.NONE));
	}, [emojiShortCode]);

	return (
		<div
			onClick={handleClickEmoji}
			className="w-10 h-10  rounded-full flex justify-center items-center
			dark:hover:bg-[#232428] dark:bg-[#1E1F22] 
			bg-[#E3E5E8] hover:bg-[#EBEDEF] cursor-pointer"
		>
			<img src={getUrl} className="w-5 h-5"></img>
		</div>
	);
};

export default memo(ReactionItem);
