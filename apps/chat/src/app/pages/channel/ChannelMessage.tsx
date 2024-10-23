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
import React, {
	ForwardRefExoticComponent,
	PropsWithoutRef,
	ReactNode,
	RefAttributes,
	memo,
	useCallback,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef
} from 'react';
import { useSelector } from 'react-redux';

export type MessageProps = {
	channelId: string;
	messageId: string;
	previousMessageId: string;
	mode: number;
	isHighlight?: boolean;
	channelLabel: string;
	avatarDM?: string;
	userName?: string;
	isLastSeen?: boolean;
};

export type MessageRef = {
	scrollIntoView: (options?: ScrollIntoViewOptions) => void;
	messageId: string;
};

type ChannelMessageComponent = ForwardRefExoticComponent<PropsWithoutRef<MessageProps> & RefAttributes<MessageRef>> & {
	Skeleton?: () => ReactNode;
};

export const ChannelMessage: ChannelMessageComponent = React.forwardRef<MessageRef, MessageProps>(
	({ messageId, channelId, mode, channelLabel, isHighlight, avatarDM, userName, isLastSeen, previousMessageId }: Readonly<MessageProps>, ref) => {
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

		const isEditing =
			channelDraftMessage?.message_id === messageId ? openEditMessageState : openEditMessageState && idMessageRefEdit === messageId;

		const isSameUser = message?.user?.id === previousMessage?.user?.id;
		const isTimeGreaterThan60Minutes = useMemo(() => {
			if (message?.create_time && previousMessage?.create_time) {
				return Date.parse(message.create_time) - Date.parse(previousMessage.create_time) < 60 * 60 * 1000;
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
		const popup = useMemo(() => {
			return <ChannelMessageOpt message={message} handleContextMenu={handleContextMenu} isCombine={isCombine} />;
		}, [message, handleContextMenu, isCombine]);

		useImperativeHandle(
			ref,
			() => ({
				scrollIntoView: (options?: ScrollIntoViewOptions) => messageRef.current?.scrollIntoView(options),
				messageId: messageId
			}),
			[messageRef]
		);

		useEffect(() => {
			markMessageAsSeen(message);
		}, [messageId]);

		return (
			<>
				{message.isFirst && <ChatWelcome key={messageId} name={channelLabel} avatarDM={avatarDM} userName={userName} mode={mode} />}

				{!message.isFirst && (
					<div ref={messageRef} className="fullBoxText relative group">
						<MessageWithUser
							allowDisplayShortProfile={true}
							message={mess}
							mode={mode}
							isEditing={isEditing}
							isHighlight={isHighlight}
							popup={popup}
							onContextMenu={handleContextMenu}
							isCombine={isCombine}
						/>
					</div>
				)}

				{!isMyMessage && isLastSeen && <UnreadMessageBreak />}
			</>
		);
	}
);

export const MemorizedChannelMessage = memo(ChannelMessage);
