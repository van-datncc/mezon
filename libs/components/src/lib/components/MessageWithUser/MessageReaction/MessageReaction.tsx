import { GifStickerEmojiPopup, ReactionBottom } from '@mezon/components';
import {
	reactionActions,
	selectComputedReactionsByMessageId,
	selectIdMessageRefReaction,
	selectIsMessageHasReaction,
	selectReactionBottomState,
	selectReactionBottomStateResponsive,
} from '@mezon/store';
import {
	EmojiDataOptionals,
	IMessageWithUser,
	SenderInfoOptionals,
	calculateTotalCount,
	convertReactionDataFromMessage,
	updateEmojiReactionData,
} from '@mezon/utils';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ItemEmoji from './ItemEmoji';
import React from 'react';

type MessageReactionProps = {
	message: IMessageWithUser;
	mode: number;
};

function useMessageReaction(messageId: string) {
	const computedReactions = useSelector(selectComputedReactionsByMessageId(messageId));

	return computedReactions;
}

const MessageReaction: React.FC<MessageReactionProps> = ({ message, mode }) => {
	const smileButtonRef = useRef<HTMLDivElement | null>(null);
	const [showIconSmile, setShowIconSmile] = useState<boolean>(false);
	const reactionBottomState = useSelector(selectReactionBottomState);
	const reactionBottomStateResponsive = useSelector(selectReactionBottomStateResponsive);
	const idMessageRefReaction = useSelector(selectIdMessageRefReaction);

	const messageReactions = useMessageReaction(message.id)
	const checkHasEmoji = useSelector(selectIsMessageHasReaction(message.id))

	const isMessageMatched = message.id === idMessageRefReaction;

	console.log('messageReactions', messageReactions);

	return (
		<div className="relative pl-3">
			{isMessageMatched && reactionBottomState && reactionBottomStateResponsive && (
				<div className="w-fit md:hidden z-30 absolute bottom-0 block">
					<div className="scale-75 transform mb-0 z-20">
						<GifStickerEmojiPopup messageEmojiId={message.id} mode={mode} />
					</div>
				</div>
			)}

			<div className="flex gap-2 ml-14">
				<div
					className="w-fit flex flex-wrap gap-2 whitespace-pre-wrap"
					onMouseEnter={() => setShowIconSmile(true)}
					onMouseLeave={() => setShowIconSmile(false)}
				>
					{messageReactions.map((emoji, index) => (
						<ItemEmoji key={`${index}-${message.id}`} message={message} mode={mode} emoji={emoji} />
					))}
					{checkHasEmoji && (
						<div className="w-6 h-6 flex justify-center items-center cursor-pointer relative">
							{showIconSmile && <ReactionBottom messageIdRefReaction={message.id} smileButtonRef={smileButtonRef} />}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default React.memo(MessageReaction);
