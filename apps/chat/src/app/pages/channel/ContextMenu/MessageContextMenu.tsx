import { useCallback, useLayoutEffect, useMemo, useState } from 'react';

import { Icons } from '@mezon/components';
import { useAuth, useClanRestriction, useDeleteMessage, useReference, useThreads } from '@mezon/core';
import {
	directActions,
	gifsStickerEmojiActions,
	pinMessageActions,
	reactionActions,
	referencesActions,
	selectAllDirectMessages,
	selectCurrentChannel,
	selectMessageByMessageId,
	selectPinMessageByChannelId,
	selectReactionOnMessageList,
	threadsActions,
	useAppDispatch,
} from '@mezon/store';
import {
	ContextMenuItem,
	EPermission,
	MenuBuilder,
	SubPanelName,
	handleCopyImage,
	handleCopyLink,
	handleOpenLink,
	handleSaveImage,
} from '@mezon/utils';
import { setSelectedMessage, toggleIsShowPopupForwardTrue } from 'libs/store/src/lib/forwardMessage/forwardMessage.slice';
import { ChannelStreamMode } from 'mezon-js';
import 'react-contexify/ReactContexify.css';
import { useSelector } from 'react-redux';
import DynamicContextMenu from './DynamicContextMenu';

type MessageContextMenuProps = {
	id: string;
	messageId: string;
	elementTarget?: boolean | HTMLElement | null;
	activeMode: number | undefined;
};

function MessageContextMenu({ id, elementTarget, messageId, activeMode }: MessageContextMenuProps) {
	const { setOpenThreadMessageState } = useReference();
	const dmGroupChatList = useSelector(selectAllDirectMessages);
	const currentChannel = useSelector(selectCurrentChannel);
	const reactionRealtimeList = useSelector(selectReactionOnMessageList);
	const listPinMessages = useSelector(selectPinMessageByChannelId(currentChannel?.id));
	const message = useSelector(selectMessageByMessageId(messageId));
	const dispatch = useAppDispatch();
	const { userId } = useAuth();
	const checkMessageInRealtimeList = useCallback((arrayMessageIdReaction: string[], messageId: string) => {
		return arrayMessageIdReaction.includes(messageId);
	}, []);
	const messageHasReaction = useMemo(() => {
		return message?.reactions && message?.reactions?.length > 0 ? true : false;
	}, [message?.reactions?.length]);
	const [checkAdmintrator, { isClanCreator }] = useClanRestriction([EPermission.administrator]);
	const checkSenderMessage = useMemo(() => {
		return message?.sender_id === userId;
	}, [message?.sender_id, userId]);

	const checkMessageHasText = useMemo(() => {
		return message?.content.t !== '';
	}, [message?.content.t]);

	const checkMessageHasReaction = useCallback(() => {
		const checkRealtime = checkMessageInRealtimeList(reactionRealtimeList, message?.id);
		if (!messageHasReaction && !checkRealtime) {
			return false;
		} else {
			return true;
		}
	}, [messageHasReaction, reactionRealtimeList, checkMessageInRealtimeList]);

	const checkMessageInPinneList = listPinMessages.some((pinMessage) => pinMessage.message_id === messageId);
	const [pinMessage] = useClanRestriction([EPermission.manageChannel]);
	const [delMessage] = useClanRestriction([EPermission.manageChannel]);
	const [removeReaction] = useClanRestriction([EPermission.manageChannel]);

	const [createThread] = useClanRestriction([EPermission.manageChannel]);
	const [isAllowDelMessage] = useClanRestriction([EPermission.deleteMessage]);
	const [isAllowCreateThread] = useClanRestriction([EPermission.manageThread]);
	//
	const [enableDelMessageItem, setEnableDelMessageItem] = useState<boolean>(false);
	const [enableEditMessageItem, setEnableEditMessageItem] = useState<boolean>(false);
	const [enableSpeakMessageItem, setEnableSpeakMessageItem] = useState<boolean>(false);
	const [enableCreateThreadItem, setEnableCreateThreadItem] = useState<boolean>(false);
	const [enableViewReactionItem, setEnableViewReactionItem] = useState<boolean>(false);
	const [enableRemoveOneReactionItem, setEnableRemoveOneReactionItem] = useState<boolean>(false);
	const [enableRemoveAllReactionItem, setEnableRemoveAllReactionsItem] = useState<boolean>(false);
	const [enableReportMessageItem, setEnableReportMessageItem] = useState<boolean>(false);
	const [enableCopyLinkItem, setEnableCopyLinkItem] = useState<boolean>(false);
	const [enableOpenLinkItem, setEnableOpenLinkItem] = useState<boolean>(false);
	const [enableCopyImageItem, setEnableCopyImageItem] = useState<boolean>(false);
	const [enableSaveImageItem, setEnableSaveImageItem] = useState<boolean>(false);

	const [urlImage, setUrlImage] = useState<string>('');

	// add action
	const { deleteSendMessage } = useDeleteMessage({
		channelId: currentChannel?.id || '',
		mode: activeMode ?? ChannelStreamMode.STREAM_MODE_CHANNEL,
	});

	const handleReplyMessage = () => {
		dispatch(referencesActions.setOpenReplyMessageState(true));
		dispatch(referencesActions.setIdReferenceMessageReply(message.id));
		dispatch(referencesActions.setIdMessageToJump(''));
		dispatch(gifsStickerEmojiActions.setSubPanelActive(SubPanelName.NONE));
	};

	const handleEditMessage = () => {
		dispatch(referencesActions.setOpenReplyMessageState(false));
		dispatch(reactionActions.setReactionRightState(false));
		dispatch(referencesActions.setOpenEditMessageState(true));
		dispatch(referencesActions.setIdReferenceMessageEdit(message.id));
		dispatch(referencesActions.setIdMessageToJump(''));
	};

	const handleForwardMessage = () => {
		if (dmGroupChatList.length === 0) {
			dispatch(directActions.fetchDirectMessage({}));
		}
		dispatch(toggleIsShowPopupForwardTrue());
		dispatch(setSelectedMessage(message));
	};

	const handlePinMessage = () => {
		dispatch(pinMessageActions.setChannelPinMessage({ channel_id: message?.channel_id, message_id: message?.id }));
	};

	const handleUnPinMessage = () => {
		dispatch(pinMessageActions.deleteChannelPinMessage({ channel_id: message?.channel_id, message_id: message?.id }));
	};

	const { setIsShowCreateThread, setValueThread } = useThreads();

	const handleCreateThread = () => {
		setIsShowCreateThread(true);
		setOpenThreadMessageState(true);
		dispatch(threadsActions.setOpenThreadMessageState(true));
		setValueThread(message);
	};

	// 1. allow view reaction
	useLayoutEffect(() => {
		setEnableViewReactionItem(checkMessageHasReaction());
	}, [checkMessageHasReaction()]);

	// 2. allow edit/report message
	useLayoutEffect(() => {
		setEnableEditMessageItem(checkSenderMessage);
		setEnableReportMessageItem(!checkSenderMessage);
	}, [checkSenderMessage]);

	// 3. allow pin/unpin message
	const pinMessageStatus = useMemo(() => {
		if (!checkMessageInPinneList) {
			if (pinMessage || isClanCreator || checkAdmintrator) {
				return true;
			}
		} else if (checkMessageInPinneList) {
			if (pinMessage || isClanCreator || checkAdmintrator) {
				return false;
			}
		} else {
			return undefined;
		}
	}, [pinMessage, isClanCreator, checkAdmintrator, checkMessageInPinneList, message]);

	// 5. allow speak message
	useLayoutEffect(() => {
		setEnableSpeakMessageItem(checkMessageHasText);
	}, [checkMessageHasText]);

	// 6. allow remove one/all reaction
	useLayoutEffect(() => {
		if (
			(isClanCreator && checkMessageHasReaction()) ||
			(checkAdmintrator && checkMessageHasReaction()) ||
			(removeReaction && checkMessageHasReaction())
		) {
			setEnableRemoveOneReactionItem(true);
			setEnableRemoveAllReactionsItem(true);
		} else {
			setEnableRemoveOneReactionItem(false);
			setEnableRemoveAllReactionsItem(false);
		}
	}, [isClanCreator, checkAdmintrator, checkMessageHasReaction(), removeReaction]);

	// 8. allow thread item
	useLayoutEffect(() => {
		if (createThread || isAllowCreateThread || !isClanCreator || checkAdmintrator) {
			setEnableCreateThreadItem(true);
		} else {
			setEnableCreateThreadItem(false);
		}
	}, [createThread, isAllowCreateThread, isClanCreator, checkAdmintrator]);

	// 10. allow delete message
	useLayoutEffect(() => {
		if (delMessage || isAllowDelMessage || checkSenderMessage || isClanCreator || checkAdmintrator) {
			setEnableDelMessageItem(true);
		} else {
			setEnableDelMessageItem(false);
		}
	}, [delMessage, isAllowDelMessage, checkSenderMessage, isClanCreator, checkAdmintrator]);

	// 11. allow image

	useLayoutEffect(() => {
		const checkImageHTML = elementTarget instanceof HTMLImageElement;
		if (checkImageHTML) {
			const imgSrc = elementTarget.src;
			setUrlImage(imgSrc);
			setEnableCopyLinkItem(true);
			setEnableOpenLinkItem(true);
			setEnableCopyImageItem(true);
			setEnableSaveImageItem(true);
		} else {
			setEnableCopyLinkItem(false);
			setEnableOpenLinkItem(false);
			setEnableCopyImageItem(false);
			setEnableSaveImageItem(false);
		}
	}, [elementTarget]);

	const items = useMemo<ContextMenuItem[]>(() => {
		const builder = new MenuBuilder();

		builder.addMenuItem(
			'addReaction', // id
			'Add Reaction', // lable
			() => console.log('add reaction'),
			<Icons.RightArrowRightClick />,
		);

		builder.when(enableViewReactionItem, (builder) => {
			builder.addMenuItem(
				'viewReaction',
				'View Reaction',
				() => console.log('view reaction'),
				<Icons.ViewReactionRightClick defaultSize="w-4 h-4" />,
			);
		});

		builder.when(enableEditMessageItem, (builder) => {
			builder.addMenuItem(
				'editMessage',
				'Edit Message',

				async () => {
					try {
						await handleEditMessage();
					} catch (error) {
						console.error('Failed to edit message', error);
					}
				},

				<Icons.EditMessageRightClick defaultSize="w-4 h-4" />,
			);
		});

		builder.when(pinMessageStatus, (builder) => {
			builder.addMenuItem('pinMessage', 'Pin Message', () => handlePinMessage(), <Icons.PinMessageRightClick defaultSize="w-4 h-4" />);
		});
		builder.when(!pinMessageStatus, (builder) => {
			builder.addMenuItem('unPinMessage', 'Unpin Message', () => handleUnPinMessage(), <Icons.PinMessageRightClick defaultSize="w-4 h-4" />);
		});

		builder.addMenuItem(
			'reply',
			'Reply',
			() => handleReplyMessage(),

			<Icons.ReplyRightClick defaultSize="w-4 h-4" />,
		);

		builder.when(enableCreateThreadItem, (builder) => {
			builder.addMenuItem('createThread', 'Create Thread', () => handleCreateThread(), <Icons.ThreadIconRightClick defaultSize="w-4 h-4" />);
		});

		builder.addMenuItem(
			'copyText',
			'Copy Text',
			async () => {
				try {
					await handleCopyLink(message?.content?.t ?? '');
				} catch (error) {
					console.error('Failed to copy text', error);
				}
			},
			<Icons.CopyTextRightClick />,
		);
		builder.addMenuItem('apps', 'Apps', () => console.log('apps'), <Icons.RightArrowRightClick defaultSize="w-4 h-4" />);
		builder.addMenuItem('markUnread', 'Mark Unread', () => console.log('apps'), <Icons.UnreadRightClick defaultSize="w-4 h-4" />);
		builder.addMenuItem(
			'copyMessageLink',
			'Copy Message Link',
			() => console.log('apps'),
			<Icons.CopyMessageLinkRightClick defaultSize="w-4 h-4" />,
		);
		builder.addMenuItem('forwardMessage', 'Forward Message', () => handleForwardMessage(), <Icons.ForwardRightClick defaultSize="w-4 h-4" />);

		builder.when(enableSpeakMessageItem, (builder) => {
			builder.addMenuItem(
				'speakMessage',
				'Speak Message',
				() => {
					console.log('speak Message');
				},
				<Icons.SpeakMessageRightClick defaultSize="w-4 h-4" />,
			);
		});

		builder.when(enableRemoveOneReactionItem, (builder) => {
			builder.addMenuItem(
				'removeReactions',
				'Remove Reactions',
				() => {
					console.log('remove reaction');
				},
				<Icons.RightArrowRightClick defaultSize="w-4 h-4" />,
			);
		});
		builder.when(enableRemoveAllReactionItem, (builder) => {
			builder.addMenuItem('removeAllReactions', 'Remove All Reactions', () => {
				console.log('remove all reaction');
			});
		});

		builder.when(enableDelMessageItem, (builder) => {
			builder.addMenuItem(
				'deleteMessage',
				'Delete Message',
				async () => {
					try {
						await deleteSendMessage(message.id);
					} catch (error) {
						console.error('Failed to delete message', error);
					}
				},
				<Icons.DeleteMessageRightClick defaultSize="w-4 h-4" />,
			);
		});

		builder.when(enableReportMessageItem, (builder) => {
			builder.addMenuItem(
				'reportMessage',
				'Report Message',
				() => {
					console.log('report message');
				},
				<Icons.ReportMessageRightClick defaultSize="w-4 h-4" />,
			);
		});

		builder.when(enableCopyLinkItem, (builder) => {
			builder.addMenuItem('copyLink', 'Copy Link', async () => {
				try {
					await handleCopyLink(urlImage ?? '');
				} catch (error) {
					console.error('Failed to copy link:', error);
				}
			});
		});

		builder.when(enableOpenLinkItem, (builder) => {
			builder.addMenuItem('openLink', 'Open Link', async () => {
				try {
					await handleOpenLink(urlImage ?? '');
				} catch (error) {
					console.error('Failed to copy image:', error);
				}
			});
		});

		builder.when(enableCopyImageItem, (builder) => {
			builder.addMenuItem('copyImage', 'Copy Image', async () => {
				try {
					await handleCopyImage(urlImage ?? '');
				} catch (error) {
					console.error('Failed to copy image:', error);
				}
			});
		});

		builder.when(enableSaveImageItem, (builder) => {
			builder.addMenuItem('saveImage', 'Save Image', async () => {
				try {
					await handleSaveImage(urlImage ?? '');
				} catch (error) {
					console.error('Failed to save image:', error);
				}
			});
		});

		return builder.build();
	}, [
		dispatch,
		messageId,
		enableViewReactionItem,
		enableEditMessageItem,
		enableCreateThreadItem,
		enableSpeakMessageItem,
		enableRemoveOneReactionItem,
		enableRemoveAllReactionItem,
		enableDelMessageItem,
		enableReportMessageItem,
		enableCopyLinkItem,
		enableOpenLinkItem,
		enableCopyImageItem,
		enableSaveImageItem,
		pinMessageStatus,
	]);

	return <DynamicContextMenu menuId={id} items={items} messageId={message.id} mode={activeMode} />;
}

export default MessageContextMenu;
