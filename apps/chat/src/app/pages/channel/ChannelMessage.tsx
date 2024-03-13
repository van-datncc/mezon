import { EmojiPicker, Icons, MessageWithUser, UnreadMessageBreak } from '@mezon/components';
import { ChatContext, useChatMessage } from '@mezon/core';
import { selectMemberByUserId } from '@mezon/store';
import { EmojiPlaces, IMessageWithUser } from '@mezon/utils';
import { useContext, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';

type MessageProps = {
	message: IMessageWithUser;
	preMessage?: IMessageWithUser;
	lastSeen?: boolean;
};

export function ChannelMessage(props: MessageProps) {
	const { message, lastSeen, preMessage } = props;
	const { markMessageAsSeen } = useChatMessage(message.id);
	const user = useSelector(selectMemberByUserId(message.sender_id));

	useEffect(() => {
		markMessageAsSeen(message);
	}, [markMessageAsSeen, message]);

	// TODO: recheck this

	const mess = useMemo(() => {
		if (typeof message.content === 'object' && typeof (message.content as any).id === 'string') {
			return message.content;
		}
		return message;
	}, [message]);

	const messPre = useMemo(() => {
		if (preMessage && typeof preMessage.content === 'object' && typeof (preMessage.content as any).id === 'string') {
			return preMessage.content;
		}
		return preMessage;
	}, [preMessage]);

	const { isOpenReply, setMessageRef, setIsOpenReply, messageRef, isOpenEmojiReacted, setIsOpenEmojiReacted } = useContext(ChatContext);
	const handleClickReply = () => {
		setIsOpenReply(true);
		setMessageRef(mess);
	};
	const { emojiPlaceActive, setEmojiPlaceActive, widthEmojiBar } = useContext(ChatContext);
	console.log('widthEmojiBar', widthEmojiBar);

	const handleClickReact = (event: React.MouseEvent<HTMLDivElement>) => {
		setEmojiPlaceActive(EmojiPlaces.EMOJI_REACTION);
		setIsOpenEmojiReacted(true);
		setMessageRef(mess);
		event.stopPropagation();
	};

	return (
		<div className="relative group hover:bg-gray-950/[.07] border">
			<MessageWithUser message={mess as IMessageWithUser} preMessage={messPre as IMessageWithUser} user={user} />
			{lastSeen && <UnreadMessageBreak />}
			<div
				className={`z-10 top-[-18px] absolute h-[30px] p-0.5 rounded-md right-4 w-24 flex flex-row bg-bgSecondary ${isOpenEmojiReacted && mess.id === messageRef?.id ? 'block' : 'hidden'} group-hover:block`}
			>
				<div onClick={handleClickReact} className="h-full p-1 group">
					<EmojiPicker emojiAction={EmojiPlaces.EMOJI_REACTION} messageEmoji={mess} />
				</div>

				<button onClick={handleClickReply} className="rotate-180 absolute left-8 top-1.5">
					<Icons.Reply defaultFill={isOpenReply ? '#FFFFFF' : '#AEAEAE'} />
				</button>
			</div>

			{/* {emojiPlaceActive === EmojiPlaces.EMOJI_REACTION_BOTTOM && mess.id === messageRef?.id && (
				<div className="h-full p-1 group absolute">
					<EmojiPicker emojiAction={EmojiPlaces.EMOJI_REACTION_BOTTOM} messageEmoji={mess} />
				</div>
			)} */}
		</div>
	);
}

ChannelMessage.Skeleton = () => {
	return (
		<div>
			<MessageWithUser.Skeleton />
		</div>
	);
};
