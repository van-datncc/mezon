import {
	ChannelMessageOpt,
	ChatWelcome,
	MessageContextMenuProps,
	MessageWithUser,
	UnreadMessageBreak,
	useMessageContextMenu
} from '@mezon/components';
import { useSeenMessagePool } from '@mezon/core';
import {
	selectChannelDraftMessage,
	selectCurrentUserId,
	selectIdMessageRefEdit,
	selectMessageEntityById,
	selectOpenEditMessageState,
	useAppSelector
} from '@mezon/store';
import { TypeMessage } from '@mezon/utils';
import { isSameDay } from 'date-fns';
import OnBoardWelcome from 'libs/components/src/lib/components/ChatWelcome/OnBoardWelcome';
import { ChannelStreamMode } from 'mezon-js';
import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';

export type MessageProps = {
	channelId: string;
	messageId: string;
	previousMessageId: string;
	nextMessageId?: string;
	mode: number;
	isHighlight?: boolean;
	channelLabel: string;
	avatarDM?: string;
	userName?: string;
	isLastSeen?: boolean;
	index: number;
	checkMessageTargetToMoved?: boolean;
	messageReplyHighlight?: boolean;
};

export type MessageRef = {
	scrollIntoView: (options?: ScrollIntoViewOptions) => void;
	messageId: string;
	index: number;
};

type ChannelMessageComponent = React.FC<MessageProps> & {
	Skeleton?: () => JSX.Element;
};

export const ChannelMessage: ChannelMessageComponent = ({
	messageId,
	channelId,
	mode,
	channelLabel,
	isHighlight,
	avatarDM,
	userName,
	isLastSeen,
	previousMessageId,
	nextMessageId,
	checkMessageTargetToMoved,
	messageReplyHighlight
}: Readonly<MessageProps>) => {
	const message = useSelector((state) => selectMessageEntityById(state, channelId, messageId));
	const previousMessage = useSelector((state) => selectMessageEntityById(state, channelId, previousMessageId));
	const { markMessageAsSeen } = useSeenMessagePool();
	const openEditMessageState = useSelector(selectOpenEditMessageState);
	const idMessageRefEdit = useSelector(selectIdMessageRefEdit);
	const { showMessageContextMenu } = useMessageContextMenu();
	const channelDraftMessage = useAppSelector((state) => selectChannelDraftMessage(state, channelId));
	const messageRef = useRef<HTMLDivElement | null>(null);
	const currentUserId = useSelector(selectCurrentUserId);

	const isMyMessage = currentUserId && currentUserId === message?.sender_id;

	const isEditing = channelDraftMessage?.message_id === messageId ? openEditMessageState : openEditMessageState && idMessageRefEdit === messageId;

	const isSameUser = message?.user?.id === previousMessage?.user?.id;
	const isTimeGreaterThan60Minutes = useMemo(() => {
		if (message?.create_time && previousMessage?.create_time) {
			return Date.parse(message.create_time) - Date.parse(previousMessage.create_time) < 60 * 60 * 1000;
		}
		return false;
	}, [message?.create_time, previousMessage?.create_time]);

	const isDifferentDay = useMemo(() => {
		if (message?.create_time && previousMessage?.create_time) {
			return !isSameDay(new Date(message.create_time), new Date(previousMessage.create_time));
		}
		return false;
	}, [message?.create_time, previousMessage?.create_time]);

	const isCombine = isSameUser && isTimeGreaterThan60Minutes;

	const handleContextMenu = useCallback(
		(event: React.MouseEvent<HTMLElement>, props?: Partial<MessageContextMenuProps>) => {
			showMessageContextMenu(event, messageId, mode, props);
		},
		[showMessageContextMenu, messageId, mode]
	);

	const mess = (() => {
		if (typeof message.content === 'object' && typeof (message.content as Record<string, unknown>).id === 'string') {
			return message.content;
		}
		return message;
	})();

	const popup = useCallback(() => {
		return <ChannelMessageOpt message={message} handleContextMenu={handleContextMenu} isCombine={isCombine} mode={mode} />;
	}, [message, handleContextMenu, isCombine, mode]);

	useEffect(() => {
		markMessageAsSeen(message);
	}, [messageId]);

	return (
		<>
			{message.code === TypeMessage.Indicator && mode === ChannelStreamMode.STREAM_MODE_CHANNEL && (
				<div className="pb-10">
					<OnBoardWelcome nextMessageId={nextMessageId} />
				</div>
			)}
			{message.isFirst && <ChatWelcome key={messageId} name={channelLabel} avatarDM={avatarDM} userName={userName} mode={mode} />}

			{!message.isFirst && (
				<div ref={messageRef} className={`fullBoxText relative group ${!isCombine || mess.references?.[0]?.message_ref_id ? 'pt-3' : ''}`}>
					<MessageWithUser
						allowDisplayShortProfile={true}
						message={mess}
						mode={mode}
						isEditing={isEditing}
						isHighlight={isHighlight}
						popup={popup}
						onContextMenu={handleContextMenu}
						isCombine={isCombine}
						showDivider={isDifferentDay}
						checkMessageTargetToMoved={checkMessageTargetToMoved}
						messageReplyHighlight={messageReplyHighlight}
					/>
				</div>
			)}

			{!isMyMessage && isLastSeen && <UnreadMessageBreak />}
		</>
	);
};

export const MemorizedChannelMessage = memo(ChannelMessage);
