import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { MessageWithUser, ReactedOutsideOptional, UnreadMessageBreak, Icons } from '@mezon/components';
import { ChatContext, useChatMessage } from '@mezon/core';
import { selectMemberByUserId } from '@mezon/store';
import { IMessageWithUser } from '@mezon/utils';
import { useContext, useEffect, useMemo, useState } from 'react';
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

	const [isOpenReactEmoji, setIsOpenReactEmoji] = useState(false);
	const [emojiPicker, setEmojiPicker] = useState<string>('');
	const [reactionOutside, setReactionOutside] = useState<ReactedOutsideOptional>();
	function EmojiReaction() {
		const handleEmojiSelect = (emoji: any) => {
			setEmojiPicker(emoji.native);
			setReactionOutside({ emoji: emoji.native, messageId: mess.id });
			setIsOpenReactEmoji(false);
		};
		return (
			<Picker
				data={data}
				onEmojiSelect={handleEmojiSelect}
				theme="dark"
				onClickOutside={() => {
					setIsOpenReactEmoji(false);
				}}
			/>
		);
	}
	const { isOpenReply, setMessageRef, setIsOpenReply, messageRef } = useContext(ChatContext);

	const handleClickReply = () => {
		setIsOpenReply(true);
		setMessageRef(mess);
	};

	const handleClickReact = () => {
		setIsOpenReactEmoji(!isOpenReactEmoji);
		setMessageRef(mess);
	};

	useEffect(() => {
		if (messageRef?.id !== mess.id) {
			return setIsOpenReactEmoji(false);
		}
	}, [messageRef?.id, mess.id, setIsOpenReactEmoji, setMessageRef, isOpenReply, isOpenReactEmoji]);

	return (
		<div className="relative group hover:bg-gray-950/[.07]">
			<MessageWithUser
				reactionOutsideProps={reactionOutside}
				message={mess as IMessageWithUser}
				preMessage={messPre as IMessageWithUser}
				user={user}
			/>
			{lastSeen && <UnreadMessageBreak />}
			<div
				className={`z-10 top-[-18px] absolute h-[30px] p-0.5 rounded-md right-4 w-24 flex flex-row bg-bgSecondary ${isOpenReactEmoji ? 'block' : 'hidden'} group-hover:block`}
			>
				<button
					className="h-full p-1 group"
					onClick={(event) => {
						event.stopPropagation();
						handleClickReact();
					}}
				>
					<Icons.Smile defaultFill={isOpenReactEmoji ? '#FFFFFF' : '#AEAEAE'} />
				</button>
				<button onClick={handleClickReply} className="rotate-180">
					<Icons.Reply defaultFill={isOpenReply ? '#FFFFFF' : '#AEAEAE'} />
				</button>
			</div>
			{isOpenReactEmoji && (
				<div className="absolute right-32 bottom-0 z-50">
					<EmojiReaction />
				</div>
			)}
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
