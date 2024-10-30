import { ELoadMoreDirection, IBeforeRenderCb } from '@mezon/chat-scroll';
import { MessageContextMenuProvider } from '@mezon/components';
import { useAuth } from '@mezon/core';
import {
	messagesActions,
	pinMessageActions,
	selectAllChannelMemberIds,
	selectAllRoleIds,
	selectDataReferences,
	selectHasMoreBottomByChannelId,
	selectHasMoreMessageByChannelId,
	selectIdMessageToJump,
	selectIsJumpingToPresent,
	selectIsMessageIdExist,
	selectIsViewingOlderMessagesByChannelId,
	selectJumpPinMessageId,
	selectLastMessageByChannelId,
	selectLastMessageIdByChannelId,
	selectMessageIdsByChannelId,
	selectMessageIsLoading,
	selectMessageNotified,
	selectTheme,
	selectUnreadMessageIdByChannelId,
	useAppDispatch,
	useAppSelector
} from '@mezon/store';
import { Direction_Mode } from '@mezon/utils';
import { useVirtualizer } from '@tanstack/react-virtual';
import classNames from 'classnames';
import { ChannelType } from 'mezon-js';
import { memo, useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { ChannelMessage, MemorizedChannelMessage } from './ChannelMessage';

const SCROLL_THRESHOLD = 100; // 500px

type ChannelMessagesProps = {
	clanId: string;
	channelId: string;
	type: ChannelType;
	channelLabel?: string;
	avatarDM?: string;
	mode: number;
	userName?: string;
	userIdsFromThreadBox?: string[];
	isThreadBox?: boolean;
};

function ChannelMessages({
	clanId,
	channelId,
	channelLabel,
	avatarDM,
	userName,
	mode,
	userIdsFromThreadBox,
	isThreadBox = false
}: ChannelMessagesProps) {
	const appearanceTheme = useSelector(selectTheme);
	const messages = useAppSelector((state) => selectMessageIdsByChannelId(state, channelId));
	const chatRef = useRef<HTMLDivElement | null>(null);
	const idMessageNotified = useSelector(selectMessageNotified);
	const idMessageToJump = useSelector(selectIdMessageToJump);
	const isJumpingToPresent = useSelector(selectIsJumpingToPresent(channelId));
	const isViewOlderMessage = useSelector(selectIsViewingOlderMessagesByChannelId(channelId));
	const isMessageExist = useSelector(selectIsMessageIdExist(channelId, idMessageToJump));
	const isFetching = useSelector(selectMessageIsLoading);
	const hasMoreTop = useSelector(selectHasMoreMessageByChannelId(channelId));
	const hasMoreBottom = useSelector(selectHasMoreBottomByChannelId(channelId));
	const lastMessage = useAppSelector((state) => selectLastMessageByChannelId(state, channelId));
	const { userId } = useAuth();
	const getMemberIds = useAppSelector((state) => selectAllChannelMemberIds(state, channelId as string));
	const allUserIdsInChannel = isThreadBox ? userIdsFromThreadBox : getMemberIds;
	const allRolesInClan = useSelector(selectAllRoleIds);
	const jumpPinMessageId = useSelector(selectJumpPinMessageId);
	const isPinMessageExist = useSelector(selectIsMessageIdExist(channelId, jumpPinMessageId));
	const dataReferences = useSelector(selectDataReferences(channelId ?? ''));
	const lastMessageId = useAppSelector((state) => selectLastMessageIdByChannelId(state, channelId as string));
	const lastMessageUnreadId = useAppSelector((state) => selectUnreadMessageIdByChannelId(state, channelId as string));
	const dispatch = useAppDispatch();
	const loadMoreMessage = useCallback(
		async (direction: ELoadMoreDirection, cb?: IBeforeRenderCb) => {
			if (isFetching) {
				return;
			}

			if (direction === ELoadMoreDirection.bottom && !hasMoreBottom) {
				return;
			}

			if (direction === ELoadMoreDirection.top && !hasMoreTop) {
				return;
			}

			if (typeof cb === 'function') {
				cb();
			}

			if (direction === ELoadMoreDirection.bottom) {
				await dispatch(messagesActions.loadMoreMessage({ clanId, channelId, direction: Direction_Mode.AFTER_TIMESTAMP }));
				return true;
			}

			await dispatch(messagesActions.loadMoreMessage({ clanId, channelId, direction: Direction_Mode.BEFORE_TIMESTAMP }));

			return true;
		},
		[dispatch, clanId, channelId, hasMoreTop, hasMoreBottom, isFetching]
	);

	const getChatScrollBottomOffset = useCallback(() => {
		const element = chatRef.current;
		if (!element) {
			return 0;
		}
		return Math.abs(element?.scrollHeight - element?.clientHeight - element?.scrollTop);
	}, []);

	const cacheLastChannelId = useRef<string | null>(null);
	useLayoutEffect(() => {
		if (chatRef.current && messages?.length && lastMessage?.channel_id && cacheLastChannelId.current !== lastMessage?.channel_id) {
			chatRef.current.scrollTop = chatRef.current.scrollHeight;
		}
	});

	const lastMsgTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (messages.length && lastMessage && cacheLastChannelId.current !== lastMessage?.channel_id) {
			if (lastMsgTimeoutRef.current) {
				clearTimeout(lastMsgTimeoutRef.current);
				lastMsgTimeoutRef.current = null;
			}
			lastMsgTimeoutRef.current = setTimeout(() => {
				cacheLastChannelId.current = lastMessage?.channel_id as string;
			}, 100);
		}

		return () => {
			if (lastMsgTimeoutRef.current) {
				clearTimeout(lastMsgTimeoutRef.current);
				lastMsgTimeoutRef.current = null;
			}
		};
	}, [messages, lastMessage]);

	const scrollTimeoutId = useRef<NodeJS.Timeout | null>(null);
	const cachedMessageLength = useRef<number>(0);
	const currentScrollDirection = useRef<ELoadMoreDirection | null>(null);
	const rowVirtualizer = useVirtualizer({
		count: messages.length,
		getScrollElement: () => chatRef.current,
		estimateSize: () => 50,
		overscan: 5,
		onChange: (instance) => {
			scrollTimeoutId.current && clearTimeout(scrollTimeoutId.current);
			scrollTimeoutId.current = setTimeout(() => {
				switch (instance.scrollDirection) {
					case 'backward':
						if (Number(instance?.scrollOffset) < SCROLL_THRESHOLD && instance.scrollDirection === 'backward') {
							currentScrollDirection.current = ELoadMoreDirection.top;
							cachedMessageLength.current = messages.length;
							loadMoreMessage(ELoadMoreDirection.top);
							return;
						}

						break;
					case 'forward':
						{
							const scrollElement = instance.scrollElement;
							if (!scrollElement) {
								return;
							}
							const isAtBottom =
								Math.abs(scrollElement?.scrollHeight - scrollElement?.clientHeight - scrollElement?.scrollTop) <= SCROLL_THRESHOLD;
							if (isAtBottom) {
								currentScrollDirection.current = ELoadMoreDirection.bottom;
								cachedMessageLength.current = messages.length;
								loadMoreMessage(ELoadMoreDirection.bottom);
							}
						}
						break;
				}
			}, 100);
		}
	});

	useEffect(() => {
		if (isFetching || currentScrollDirection.current === null) {
			return;
		}

		// 200 is the cache's size
		if (messages.length === 200) {
			rowVirtualizer.scrollToIndex(currentScrollDirection.current === ELoadMoreDirection.bottom ? 150 : 50, { align: 'end' });
			currentScrollDirection.current = null;
		}
		if (cachedMessageLength.current > 0 && messages.length > cachedMessageLength.current) {
			const index = messages.length - cachedMessageLength.current;
			rowVirtualizer.scrollToIndex(index, { align: 'center' });
			currentScrollDirection.current = null;
			cachedMessageLength.current = messages.length;
		}
	}, [messages, rowVirtualizer, isFetching]);

	const scrollToLastMessage = useCallback(() => {
		return new Promise((rs) => {
			const index = messages.length - 1;

			index >= 0 && rowVirtualizer.scrollToIndex(index, { align: 'start', behavior: 'auto' });
			rs(true);
		});
	}, [messages, rowVirtualizer]);

	useEffect(() => {
		if (dataReferences && getChatScrollBottomOffset() <= 61) {
			scrollToLastMessage();
		}
	}, [dataReferences, lastMessage, scrollToLastMessage, getChatScrollBottomOffset]);

	// Jump to ,message from pin and reply, notification...
	const timerRef = useRef<number | null>(null);
	useEffect(() => {
		const handleScrollToIndex = (messageId: string) => {
			const index = messages.findIndex((item) => item === messageId);
			if (index >= 0) {
				rowVirtualizer.scrollToIndex(index, { align: 'start', behavior: 'auto' });
			}
		};

		if (timerRef.current) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}

		if (jumpPinMessageId && isPinMessageExist) {
			handleScrollToIndex(jumpPinMessageId);
			timerRef.current = window.setTimeout(() => {
				dispatch(pinMessageActions.setJumpPinMessageId(null));
			}, 1000);
		} else if (idMessageToJump && isMessageExist && jumpPinMessageId === null) {
			handleScrollToIndex(idMessageToJump);
			timerRef.current = window.setTimeout(() => {
				dispatch(messagesActions.setIdMessageToJump(null));
			}, 1000);
		}

		return () => {
			if (timerRef.current) {
				clearTimeout(timerRef.current);
				timerRef.current = null;
			}
		};
	}, [dispatch, jumpPinMessageId, isPinMessageExist, idMessageToJump, isMessageExist, messages, rowVirtualizer]);

	// Jump to present when user is jumping to present
	useEffect(() => {
		if (isJumpingToPresent) {
			scrollToLastMessage().then(() => {
				dispatch(messagesActions.setIsJumpingToPresent({ channelId, status: false }));
			});
		}
	}, [dispatch, isJumpingToPresent, channelId, scrollToLastMessage]);

	// Handle scroll to bottom when user on the bottom and received new message
	useEffect(() => {
		if (rowVirtualizer.isScrolling) {
			return;
		}

		if (isViewOlderMessage) {
			return;
		}
		if (userId === lastMessage?.sender_id) {
			return;
		}
	}, [lastMessage, userId, isViewOlderMessage, scrollToLastMessage, getChatScrollBottomOffset, rowVirtualizer.isScrolling]);

	return (
		<MessageContextMenuProvider allUserIdsInChannel={allUserIdsInChannel as string[]} allRolesInClan={allRolesInClan}>
			<div className={classNames(['w-full h-full', '[&_*]:overflow-anchor-none', 'relative'])}>
				<div
					ref={chatRef}
					id="scrollLoading"
					className={classNames([
						'absolute top-0 left-0 bottom-0 right-0',
						'overflow-y-scroll overflow-x-hidden',
						'dark:bg-bgPrimary bg-bgLightPrimary',
						{
							customScrollLightMode: appearanceTheme === 'light'
						}
					])}
				>
					<div
						style={{
							height: `${rowVirtualizer.getTotalSize()}px`,
							width: '100%',
							position: 'relative'
						}}
					>
						{rowVirtualizer.getVirtualItems().map((virtualRow) => {
							const messageId = messages[virtualRow.index];
							const checkMessageTargetToMoved = idMessageToJump === messageId && messageId !== lastMessageId;
							const messageReplyHighlight = (dataReferences?.message_ref_id && dataReferences?.message_ref_id === messageId) || false;

							return (
								<div
									key={virtualRow.index}
									style={{
										position: 'absolute',
										top: 0,
										left: 0,
										width: '100%',
										height: `${virtualRow.size}px`,
										transform: `translateY(${virtualRow.start}px)`
									}}
								>
									<div key={virtualRow.key} data-index={virtualRow.index} ref={rowVirtualizer.measureElement}>
										<MemorizedChannelMessage
											index={virtualRow.index}
											avatarDM={avatarDM}
											userName={userName}
											key={messageId}
											messageId={messageId}
											previousMessageId={messages[virtualRow.index - 1]}
											channelId={channelId}
											isHighlight={messageId === idMessageNotified}
											mode={mode}
											channelLabel={channelLabel ?? ''}
											isLastSeen={Boolean(messageId === lastMessageUnreadId && messageId !== lastMessageId)}
											checkMessageTargetToMoved={checkMessageTargetToMoved}
											messageReplyHighlight={messageReplyHighlight}
										/>
									</div>
								</div>
							);
						})}
					</div>
					<div className="h-[20px] w-[1px] pointer-events-none"></div>
				</div>
			</div>
		</MessageContextMenuProvider>
	);
}

ChannelMessages.Skeleton = () => {
	if (ChannelMessage.Skeleton) {
		return (
			<>
				{/* <ChannelMessage.Skeleton />
				<ChannelMessage.Skeleton />
				<ChannelMessage.Skeleton />
				<ChannelMessage.Skeleton />
				<ChannelMessage.Skeleton />
				<ChannelMessage.Skeleton /> */}
			</>
		);
	}
};

const MemoizedChannelMessages = memo(ChannelMessages) as unknown as typeof ChannelMessages & { Skeleton: typeof ChannelMessages.Skeleton };

export default MemoizedChannelMessages;
