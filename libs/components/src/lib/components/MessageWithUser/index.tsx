import { useAuth, useChatMessages, useNotification, useRightClick } from '@mezon/core';
import {
	MessagesEntity,
	reactionActions,
	selectCurrentChannelId,
	selectIdMessageRefReaction,
	selectIdMessageRefReply,
	selectIdMessageToJump,
	selectOpenReplyMessageState,
	selectReactionRightState,
} from '@mezon/store';
import { IChannelMember, RightClickPos } from '@mezon/utils';
import classNames from 'classnames';
import {
	rightClickAction,
	selectMessageIdRightClicked,
	selectPosClickingActive,
	selectVisibleStatus,
} from 'libs/store/src/lib/rightClick/rightClick.slice';
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { useHover } from 'usehooks-ts';
import * as Icons from '../Icons/index';
import ChannelMessageOpt from '../Message/ChannelMessageOpt';
import ContextMenu from '../RightClick/ContextMenu';
import MessageAttachment from './MessageAttachment';
import MessageAvatar from './MessageAvatar';
import MessageContent from './MessageContent';
import MessageHead from './MessageHead';
import MessageReaction from './MessageReaction/MessageReaction';
import MessageReply from './MessageReply';
import { useMessageParser } from './useMessageParser';

export type ReactedOutsideOptional = {
	id: string;
	emoji?: string;
	messageId: string;
};

export type MessageWithUserProps = {
	message: MessagesEntity;
	user?: IChannelMember | null;
	isMessNotifyMention?: boolean;
	mode: number;
	isMention?: boolean;
};

function MessageWithUser({ message, user, isMessNotifyMention, mode, isMention }: Readonly<MessageWithUserProps>) {
	const dispatch = useDispatch();
	const currentChannelId = useSelector(selectCurrentChannelId);
	const { messageDate } = useMessageParser(message);
	const openReplyMessageState = useSelector(selectOpenReplyMessageState);
	const idMessageRefReply = useSelector(selectIdMessageRefReply);
	const idMessageToJump = useSelector(selectIdMessageToJump);
	const { lastMessageId } = useChatMessages({ channelId: currentChannelId ?? '' });
	const { idMessageNotifed, setMessageNotifedId } = useNotification();
	const containerRef = useRef<HTMLDivElement>(null);
	const isHover = useHover(containerRef);
	const userLogin = useAuth();
	const isCombine = !message.isStartedMessageGroup;
	const attachments = useMemo(() => message.attachments, [message.attachments]);
	const checkReplied = idMessageRefReply === message.id && openReplyMessageState && message.id !== lastMessageId;
	const checkMessageTargetToMoved = idMessageToJump === message.id && message.id !== lastMessageId;
	const hasIncludeMention = message.content.t?.includes('@here') || message.content.t?.includes(`@${userLogin.userProfile?.user?.username}`);
	const checkReferences = message.references?.length !== 0;
	const [checkMessageReply, setCheckMessageReply] = useState(false);
	const [checkMessageToMove, setCheckMessageToMove] = useState(false);
	const [checkMessageIncludeMention, setCheckMessageIncludeMention] = useState<boolean | undefined>(false);
	const [checkMessageHasReply, setCheckMessageHasReply] = useState<boolean>(false);
	const [classNameHighlightParentDiv, setClassNameHighlightParentDiv] = useState<string>('');
	const [classNameHighlightChildDiv, setClassNameHighlightChildDiv] = useState<string>('');
	const [classNameNotification, setClassNameNotification] = useState<string>('');
	const { setRightClickXy } = useRightClick();
	const { setMessageRightClick } = useRightClick();
	const getMessageIdRightClicked = useSelector(selectMessageIdRightClicked);
	const visibleOpt = useSelector(selectVisibleStatus);

	const shouldShowDateDivider = useMemo(() => {
		return message.isStartedMessageOfTheDay && !isMessNotifyMention;
	}, [message.isStartedMessageOfTheDay, isMessNotifyMention]);

	const messageDividerClass = classNames(
		'flex flex-row w-full px-4 items-center pt-3 text-zinc-400 text-[12px] font-[600] dark:bg-transparent bg-transparent',
	);

	const isHeadfull = useMemo(() => {
		return isCombine && !checkReferences;
	}, [isCombine, checkReferences]);

	const containerClass = classNames('relative', 'message-container', {
		'mt-3': !isCombine || checkReferences,
		'is-sending': message.isSending,
		'is-error': message.isError,
		[classNameNotification]: classNameNotification,
	});

	const parentDivClass = classNames(
		'flex h-15 flex-col w-auto px-3',
		{ 'mt-0': isMention },
		{ 'pt-[2px]': !isCombine },
		{ [classNameHighlightParentDiv]: hasIncludeMention || checkReplied || checkMessageTargetToMoved },
		{ 'dark:group-hover:bg-bgPrimary1 group-hover:bg-[#EAB3081A]': !hasIncludeMention && !checkReplied && !checkMessageTargetToMoved },
	);

	const childDivClass = classNames(
		'absolute w-0.5 h-full left-0',
		{ [classNameHighlightChildDiv]: hasIncludeMention || checkReplied || checkMessageTargetToMoved },
		{ 'dark:group-hover:bg-bgPrimary1 group-hover:bg-[#EAB3081A]': !hasIncludeMention && !checkReplied && !checkMessageTargetToMoved },
	);

	const messageContentClass = classNames('flex flex-col whitespace-pre-wrap text-base w-full cursor-text');

	const posClickActive = useSelector(selectPosClickingActive);

	const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
		dispatch(rightClickAction.setPosClickActive(RightClickPos.MESSAGE_ON_CHANNEL));
		setRightClickXy({ x: event.pageX, y: event.pageY });
		setMessageRightClick(message.id);
	};

	const handleCloseMenu = () => {
		if (message.id === getMessageIdRightClicked) {
			setMessageRightClick('');
		}
		dispatch(rightClickAction.setVisibleOpt(false));
		dispatch(rightClickAction.setPosClickActive(RightClickPos.NONE));
	};

	useEffect(() => {
		let resetTimeoutId: NodeJS.Timeout | null = null;

		if (idMessageNotifed === message.id) {
			setClassNameNotification('bg-[#383B47]');
			resetTimeoutId = setTimeout(() => {
				setClassNameNotification('');
				setMessageNotifedId('');
			}, 2000);
		}
		return () => {
			if (resetTimeoutId) {
				clearTimeout(resetTimeoutId);
			}
		};
	}, [idMessageNotifed, message.id, setMessageNotifedId]);

	useEffect(() => {
		if (checkMessageReply || checkMessageToMove) {
			setClassNameHighlightParentDiv('dark:bg-[#383B47]');
			setClassNameHighlightChildDiv('dark:bg-blue-500');
		} else if (checkMessageIncludeMention) {
			setClassNameHighlightParentDiv('dark:bg-[#403D38]');
			setClassNameHighlightChildDiv('dark:bg-[#F0B132]');
		}
	}, [checkMessageReply, checkMessageToMove, checkMessageIncludeMention]);

	useEffect(() => {
		setCheckMessageReply(checkReplied);
		setCheckMessageToMove(checkMessageTargetToMoved);
		setCheckMessageIncludeMention(hasIncludeMention ?? undefined);
	}, [checkReplied, checkMessageTargetToMoved, hasIncludeMention, idMessageToJump]);

	useLayoutEffect(() => {
		if (message.references && message.references?.length > 0) {
			setCheckMessageHasReply(true);
		} else {
			setCheckMessageHasReply(false);
		}
	}, [message.references]);



	return (
		<>
			{shouldShowDateDivider && (
				<div className={messageDividerClass}>
					<div className="w-full border-b-[1px] dark:border-borderDivider border-borderDividerLight opacity-50 text-center"></div>
					<span className="text-center px-3 whitespace-nowrap">{messageDate}</span>
					<div className="w-full border-b-[1px] dark:border-borderDivider border-borderDividerLight opacity-50 text-center"></div>
				</div>
			)}
			<div className={containerClass} ref={containerRef}>
				<div className="relative rounded-sm overflow-visible" onContextMenu={handleContextMenu} onClick={handleCloseMenu}>
					<div className={childDivClass}></div>
					<div className={parentDivClass}>
						{checkMessageHasReply && <MessageReply message={message} />}
						<div className="justify-start gap-4 inline-flex w-full relative h-fit overflow-visible pr-12">
							<MessageAvatar user={user} message={message} isCombine={isCombine} />
							<div className="w-full relative h-full">
								{isHeadfull && <MessageHead message={message} user={user} isCombine={isCombine} />}
								<div className="justify-start items-center inline-flex w-full h-full pt-[2px] textChat">
									<div className={messageContentClass} style={{ wordBreak: 'break-word' }}>
										<MessageContent
											message={message}
											user={user}
											isCombine={isCombine}
											isSending={message.isSending}
											isError={message.isError}
										/>
									</div>
								</div>
								<MessageAttachment attachments={attachments} />
							</div>
						</div>
						{message && !isMessNotifyMention && (
							<div
								className={classNames('absolute top-[100] right-2 flex-row items-center gap-x-1 text-xs text-gray-600', {
									hidden: isCombine,
								})}
							>
								<Icons.Sent />
							</div>
						)}
					</div>
					
				</div>
				{(isHover || (visibleOpt && message.id === getMessageIdRightClicked)) && <ChannelMessageOpt message={message} />}
				{posClickActive === RightClickPos.MESSAGE_ON_CHANNEL && message.id === getMessageIdRightClicked && <ContextMenu urlData={''} />}
				<MessageReaction message={message} mode={mode} />
			</div>
		</>
	);
}

MessageWithUser.Skeleton = () => {
	return (
		<div className="flex py-0.5 min-w-min mx-3 h-15 mt-3 hover:bg-gray-950/[.07] overflow-x-hidden cursor-pointer flex-shrink-1">
			<Skeleton circle={true} width={38} height={38} />
		</div>
	);
};

export default MessageWithUser;
