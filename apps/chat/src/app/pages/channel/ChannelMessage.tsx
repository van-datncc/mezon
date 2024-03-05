import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { MessageWithUser, UnreadMessageBreak } from '@mezon/components';
import { useChatMessage } from '@mezon/core';
import { IMessageWithUser } from '@mezon/utils';
import { useEffect, useMemo, useState } from 'react';
import { ApiMessageAttachment, ApiMessageMention, ApiMessageRef } from 'vendors/mezon-js/packages/mezon-js/dist/api.gen';

type MessageProps = {
	message: IMessageWithUser;
	preMessage?: IMessageWithUser;
	lastSeen?: boolean;
};

export function ChannelMessage(props: MessageProps) {
	const { message, lastSeen, preMessage } = props;
	const { markMessageAsSeen } = useChatMessage(message.id);
	useEffect(() => {
		markMessageAsSeen(message);
	}, [markMessageAsSeen, message]);

	// TODO: recheck this

	const mess = useMemo(() => {
		return message;
	}, [message]);

	const messPre = useMemo(() => {
		return preMessage;
	}, [preMessage]);

	const mentions = useMemo(() => {
		return message.mentions as any;
	}, [message.mentions]);

	const attachments = useMemo(() => {
		return message.attachments as any;
	}, [message.attachments]);

	const references = useMemo(() => {
		return message.references as any;
	}, [message.references]);

	const [isOpenReactEmoji, setIsOpenReactEmoji] = useState(false);
	function EmojiReaction() {
		const handleEmojiSelect = (emoji: any) => {
			console.log(emoji.native);
			setIsOpenReactEmoji(false);
		};
		return <Picker data={data} onEmojiSelect={handleEmojiSelect} />;
	}

	return (
		<div className="relative group">
			<MessageWithUser
				message={mess as IMessageWithUser}
				preMessage={messPre as IMessageWithUser}
				mentions={mentions as ApiMessageMention[]}
				attachments={attachments as ApiMessageAttachment[]}
				references={references as ApiMessageRef[]}
			/>
			{lastSeen && <UnreadMessageBreak />}
			{/* <div className="z-20 absolute top-[0] p-0.5 rounded-md right-4 w-24 flex flex-row bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:bg-slate-800">
				<button
					className="h-full p-1 group"
					onClick={() => {
						setIsOpenReactEmoji(!isOpenReactEmoji);
					}}
				>
					<Icons.Smile />
				</button>
			</div> */}
			{isOpenReactEmoji && (
				<div className="absolute right-32 bottom-0">
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
