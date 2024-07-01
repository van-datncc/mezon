import { useAppParams, useAuth, useChatReaction } from '@mezon/core';
import { selectCurrentChannelId, selectDirectById, selectDmGroupCurrentId } from '@mezon/store';
import { getSrcEmoji } from '@mezon/utils';
import useDataEmojiSvg from 'libs/core/src/lib/chat/hooks/useDataEmojiSvg';
import { ChannelStreamMode } from 'mezon-js';
import { memo, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

interface IReactionItem {
	emojiShortCode: string;
	activeMode: number | undefined;
	messageId: string;
}

const ReactionItem: React.FC<IReactionItem> = ({ emojiShortCode, activeMode, messageId }) => {
	const { directId } = useAppParams();
	const [channelID, setChannelID] = useState('');
	const direct = useSelector(selectDirectById(directId || ''));
	const currentChannelId = useSelector(selectCurrentChannelId);
	const currentDmGroupId = useSelector(selectDmGroupCurrentId);

	console.log(currentDmGroupId);
	console.log(currentChannelId);

	const { emojiListPNG } = useDataEmojiSvg();
	const { reactionMessageDispatch } = useChatReaction();
	const getUrl = getSrcEmoji(emojiShortCode, emojiListPNG ?? []);
	const userId = useAuth();

	useEffect(() => {
		console.log(currentDmGroupId);
		console.log(currentChannelId);
		if (currentDmGroupId !== '') {
			return setChannelID(currentDmGroupId ?? '');
		} else {
			return setChannelID(currentChannelId ?? '');
		}
	}, [currentDmGroupId, currentChannelId, messageId, activeMode]);

	const handleClickEmoji = useCallback(async () => {
		await reactionMessageDispatch(
			'',
			activeMode ?? ChannelStreamMode.STREAM_MODE_CHANNEL,
			channelID && channelID,
			messageId,
			emojiShortCode,
			1,
			userId.userId ?? '',
			false,
		);
	}, [emojiShortCode, activeMode, messageId, channelID]);

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
