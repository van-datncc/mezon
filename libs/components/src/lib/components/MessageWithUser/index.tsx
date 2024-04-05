import { MessageReaction } from '@mezon/components';
import { selectCurrentChannelId, selectReferenceMessage } from '@mezon/store';
import { IChannelMember, IMessageWithUser, TIME_COMBINE, checkSameDay, getTimeDifferenceInSeconds } from '@mezon/utils';
import { useEffect, useMemo, useRef } from 'react';
import Skeleton from 'react-loading-skeleton';
import * as Icons from '../Icons/index';
import MessageAttachment from './MessageAttachment';
import MessageAvatar from './MessageAvatar';
import MessageContent from './MessageContent';
import MessageHead from './MessageHead';
import MessageReply from './MessageReply';
import { useMessageParser } from './useMessageParser';

import { useChatReactionMessage } from '@mezon/core';
import { useSelector } from 'react-redux';

export type ReactedOutsideOptional = {
	id: string;
	emoji?: string;
	messageId: string;
};

export type MessageWithUserProps = {
	message: IMessageWithUser;
	preMessage?: IMessageWithUser;
	user?: IChannelMember | null;
	isMessNotifyMention?: boolean;
	mode: number;
	newMessage?: string;
};

function MessageWithUser({ message, preMessage, user, isMessNotifyMention, mode, newMessage }: MessageWithUserProps) {
	const currentChannelId = useSelector(selectCurrentChannelId);
	const { messageDate } = useMessageParser(message);
	const divMessageWithUser = useRef<HTMLDivElement>(null);
	const { setGrandParentWidthAction } = useChatReactionMessage();
	const refMessage = useSelector(selectReferenceMessage);

	const isCombine = useMemo(() => {
		const timeDiff = getTimeDifferenceInSeconds(preMessage?.create_time as string, message?.create_time as string);
		return (
			timeDiff < TIME_COMBINE &&
			preMessage?.user?.id === message?.user?.id &&
			checkSameDay(preMessage?.create_time as string, message?.create_time as string)
		);
	}, [message, preMessage]);

	const attachments = useMemo(() => {
		return message.attachments;
	}, [message.attachments]);

	const getWidthDivMessageWidth = divMessageWithUser.current?.getBoundingClientRect();
	useEffect(() => {
		if (getWidthDivMessageWidth) {
			setGrandParentWidthAction(getWidthDivMessageWidth?.right);
		}
	}, [getWidthDivMessageWidth]);

	console.log('messs', message);
	return (
		<>
			{!checkSameDay(preMessage?.create_time as string, message?.create_time as string) && !isMessNotifyMention && (
				<div className="flex flex-row w-full px-4 items-center py-3 text-zinc-400 text-[12px] font-[600]">
					<div className="w-full border-b-[1px] border-[#40444b] opacity-50 text-center"></div>
					<span className="text-center px-3 whitespace-nowrap">{messageDate}</span>
					<div className="w-full border-b-[1px] border-[#40444b] opacity-50 text-center"></div>
				</div>
			)}
			<div>
				<div className="bg-[#26262b] rounded-sm ">
					<div className={`flex h-15 flex-col   w-auto py-2 px-3 `}>
						<MessageReply message={message} />
						<div className="justify-start gap-4 inline-flex w-full relative h-fit overflow-visible pr-12" ref={divMessageWithUser}>
							<MessageAvatar user={user} message={message} isCombine={isCombine} isReply={false} />
							<div className="flex-col w-full flex justify-center items-start relative ">
								<MessageHead message={message} user={user} isCombine={isCombine} isReply={false} />
								<div className="justify-start items-center inline-flex w-full textChat">
									<div
										className="flex flex-col gap-1 text-[#CCCCCC] font-['Manrope'] whitespace-pre-wrap text-[15px] w-fit cursor-text"
										style={{ wordBreak: 'break-word' }}
									>
										<MessageContent message={message} user={user} isCombine={isCombine} newMessage={newMessage} />
									</div>
								</div>

								<MessageAttachment attachments={attachments} />
							</div>
						</div>

						<MessageReaction currentChannelId={currentChannelId || ''} message={message} mode={mode} />
						{message && !isMessNotifyMention && (
							<div
								className={`absolute top-[100] right-2 flex-row items-center gap-x-1 text-xs text-gray-600 ${isCombine ? 'hidden' : 'flex'}`}
							>
								<Icons.Sent />
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
}

MessageWithUser.Skeleton = () => {
	return (
		<div className="flex py-0.5 min-w-min mx-3 h-15 mt-3 hover:bg-gray-950/[.07] overflow-x-hidden cursor-pointer  flex-shrink-1">
			<Skeleton circle={true} width={38} height={38} />
		</div>
	);
};

export default MessageWithUser;
