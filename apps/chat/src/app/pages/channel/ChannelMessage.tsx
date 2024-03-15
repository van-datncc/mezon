import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { EmojiPicker, Icons, MessageWithUser, ReactedOutsideOptional, UnreadMessageBreak } from '@mezon/components';
import { ChatContext, useChatMessage } from '@mezon/core';
import { selectMemberByUserId } from '@mezon/store';
import { EmojiPlaces, IMessageWithUser } from '@mezon/utils';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

type MessageProps = {
	message: IMessageWithUser;
	preMessage?: IMessageWithUser;
	lastSeen?: boolean;
	myUser?: string;
};

export function ChannelMessage(props: MessageProps) {
	const { message, lastSeen, preMessage, myUser } = props;
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

	const { isOpenEmojiReacted, setIsOpenEmojiReacted, setIsOpenEmojiMessBox } = useContext(ChatContext);
	const [isOpenReactEmoji, setIsOpenReactEmoji] = useState(false);
	const [emojiPicker, setEmojiPicker] = useState<string>('');
	const [reactionOutside, setReactionOutside] = useState<ReactedOutsideOptional>();
	function EmojiReaction() {
		const handleEmojiSelect = (emoji: any) => {
			setEmojiPicker(emoji.native);
			//TODO: check if already react this emoji
			setReactionOutside({ id: '', emoji: emoji.native, messageId: mess.id });
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
	const { isOpenReply, setMessageRef, setIsOpenReply, messageRef, setIsOpenEdit, isOpenEdit } = useContext(ChatContext);

	const handleClickReply = () => {
		setIsOpenReply(true);
		setIsOpenEdit(false);
		setMessageRef(mess);
	};

	const handleClickEdit = () => {
		setIsOpenEdit(true);
		setIsOpenReply(false);
		setMessageRef(mess);
	};

	const handleCancelEdit = () => {
		setIsOpenEdit(false);
	};

	const { emojiPlaceActive, setEmojiPlaceActive, widthEmojiBar, isOpenEmojiReactedBottom, setIsOpenEmojiReactedBottom } = useContext(ChatContext);
	const handleClickReact = (event: React.MouseEvent<HTMLDivElement>) => {
		setEmojiPlaceActive(EmojiPlaces.EMOJI_REACTION);
		setIsOpenEmojiReactedBottom(false);
		setIsOpenEmojiMessBox(false);
		setIsOpenEmojiReacted(true);
		setMessageRef(mess);
		event.stopPropagation();
	};

	return (
		<div className="fullBoxText relative group hover:bg-gray-950/[.07]">
			<MessageWithUser message={mess as IMessageWithUser} preMessage={messPre as IMessageWithUser} user={user} />
			{lastSeen && <UnreadMessageBreak />}

			<div
				className={`chooseForText z-10 top-[-18px] absolute h-8 p-0.5 rounded-md right-4 w-24 block bg-bgSecondary
				 ${(isOpenEmojiReacted && mess.id === messageRef?.id) || (isOpenEmojiReactedBottom && mess.id === messageRef?.id) || (isOpenEdit && mess.id === messageRef?.id) ? '' : 'hidden group-hover:block'} `}
			>
				<div className="iconHover flex justify-between">
					<div onClick={handleClickReact} className="h-full p-1 cursor-pointer">
						<Icons.Smile defaultFill={`${isOpenEmojiReacted && mess.id === messageRef?.id ? '#FFFFFF' : '#AEAEAE'}`} />
					</div>

					{myUser === message.sender_id ? (
						<button onClick={handleClickEdit} className="h-full p-1 cursor-pointer">
							<Icons.PenEdit defaultFill={isOpenEdit && mess.id === messageRef?.id ? '#FFFFFF' : '#AEAEAE'} />
						</button>
					) : (
						<button onClick={handleClickReply} className="h-full px-1 pb-[2px] rotate-180">
							<Icons.Reply defaultFill={isOpenReply ? '#FFFFFF' : '#AEAEAE'} />
						</button>
					)}
					<button className="h-full p-1 cursor-pointer">
						<Icons.ThreeDot />
					</button>
				</div>

				{isOpenEmojiReacted && mess.id === messageRef?.id && (
					<div className="w-fit absolute left-[-20rem] top-[-23rem] right-0">
						<div className="scale-75 transform mb-0 z-10">
							<EmojiPicker messageEmoji={mess} emojiAction={EmojiPlaces.EMOJI_REACTION} />
						</div>
					</div>
				)}
			</div>
			{isOpenEdit && mess.id === messageRef?.id && (
				<div className="inputEdit relative left-[66px] top-[-30px]">
					<input type="text" defaultValue={mess.content.t} className="w-[83%] h-10 bg-black rounded pl-4" />
					<p className="absolute -bottom-4 text-xs">
						Change content
						<span className="text-blue-700 cursor-pointer" onClick={handleCancelEdit}>
							{' '}
							exit
						</span>
					</p>
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
