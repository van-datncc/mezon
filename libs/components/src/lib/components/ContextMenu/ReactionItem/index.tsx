import { useAppParams, useAuth, useChatReaction } from '@mezon/core';
import { selectClanView, selectClickedOnTopicStatus, selectCurrentChannel, selectMessageByMessageId, useAppSelector } from '@mezon/store';
import { getSrcEmoji, isPublicChannel } from '@mezon/utils';
import { memo, useCallback } from 'react';
import { useSelector } from 'react-redux';

interface IReactionItem {
	emojiShortCode: string;
	emojiId: string;
	activeMode: number | undefined;
	messageId: string;
	isOption: boolean;
	isAddReactionPanel?: boolean;
}

const ReactionItem: React.FC<IReactionItem> = ({ emojiShortCode, emojiId, activeMode, messageId, isOption, isAddReactionPanel }) => {
	const { directId } = useAppParams();

	const { reactionMessageDispatch } = useChatReaction();
	const getUrl = getSrcEmoji(emojiId);
	const userId = useAuth();
	const isFocusTopicBox = useSelector(selectClickedOnTopicStatus);

	const isClanView = useSelector(selectClanView);
	const currentChannel = useSelector(selectCurrentChannel);
	const currentMessage = useAppSelector((state) => selectMessageByMessageId(state, currentChannel?.channel_id, messageId || ''));
	const handleClickEmoji = useCallback(async () => {
		await reactionMessageDispatch(
			'',
			messageId,
			emojiId,
			emojiShortCode,
			1,
			userId.userId ?? '',
			false,
			isPublicChannel(currentChannel),
			currentMessage?.topic_id,
			isFocusTopicBox,
			currentMessage?.channel_id
		);
	}, [
		reactionMessageDispatch,
		messageId,
		emojiId,
		emojiShortCode,
		userId.userId,
		currentChannel,
		currentMessage?.topic_id,
		isFocusTopicBox,
		currentMessage?.channel_id
	]);

	return (
		<div
			onClick={handleClickEmoji}
			className={
				isOption
					? 'h-full p-1 cursor-pointer hover:bg-[#E3E5E8] dark:hover:bg-[#232428] rounded-sm transform hover:scale-110 transition-transform duration-100'
					: `${isAddReactionPanel ? 'w-5' : 'w-10 h-10 rounded-full flex justify-center items-center dark:hover:bg-[#232428] dark:bg-[#1E1F22] bg-[#E3E5E8] hover:bg-[#EBEDEF] '} cursor-pointer`
			}
		>
			<img src={getUrl} draggable="false" className="w-5 h-5" alt="emoji" />
		</div>
	);
};

export default memo(ReactionItem);
