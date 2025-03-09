import { selectComputedReactionsByMessageId } from '@mezon/store';
import { IMessageWithUser } from '@mezon/utils';
import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import ItemEmoji from './ItemEmoji';
import ReactionBottom from './ReactionBottom';

type MessageReactionProps = {
	message: IMessageWithUser;
	mode: number;
};

const MessageReaction: React.FC<MessageReactionProps> = ({ message, mode }) => {
	const smileButtonRef = useRef<HTMLDivElement | null>(null);
	const [showIconSmile, setShowIconSmile] = useState<boolean>(false);
	const messageReactions = useSelector(selectComputedReactionsByMessageId(message.channel_id, message.id));

	return (
		<div
			className="w-fit flex flex-wrap gap-2 whitespace-pre-wrap"
			onMouseEnter={() => setShowIconSmile(true)}
			onMouseLeave={() => setShowIconSmile(false)}
		>
			{messageReactions.map((emoji, index) => (
				<ItemEmoji key={`${index}-${message.id}`} message={message} mode={mode} emoji={emoji} />
			))}
			{showIconSmile && (
				<div className="w-6 h-6 flex justify-center items-center cursor-pointer relative">
					<ReactionBottom messageIdRefReaction={message.id} smileButtonRef={smileButtonRef} />
				</div>
			)}
		</div>
	);
};

export default React.memo(MessageReaction);
