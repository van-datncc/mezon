import { useCallback, useLayoutEffect, useMemo, useState } from 'react';

import { Icons } from '@mezon/components';
import { useAuth, useClanRestriction } from '@mezon/core';
import {
	selectCurrentChannelId,
	selectMessageByMessageId,
	selectPinMessageByChannelId,
	selectReactionOnMessageList,
	useAppDispatch,
} from '@mezon/store';
import { ContextMenuItem, EPermission, MenuBuilder } from '@mezon/utils';
import 'react-contexify/ReactContexify.css';
import { useSelector } from 'react-redux';
import DynamicContextMenu from './DynamicContextMenu';

type MessageContextMenuProps = {
	id: string;
	messageId: string;
	imgTarget?: boolean | HTMLImageElement | null;
};

function MessageContextMenu({ id, imgTarget, messageId }: MessageContextMenuProps) {
	const currentChannelId = useSelector(selectCurrentChannelId);
	const reactionRealtimeList = useSelector(selectReactionOnMessageList);
	const listPinMessages = useSelector(selectPinMessageByChannelId(currentChannelId));
	const message = useSelector(selectMessageByMessageId(messageId));
	const dispatch = useAppDispatch();
	const { userId } = useAuth();
	const checkMessageInRealtimeList = useCallback((arrayMessageIdReaction: string[], messageId: string) => {
		return arrayMessageIdReaction.includes(messageId);
	}, []);
	const messageHasReaction = useMemo(() => {
		return message.reactions && message?.reactions?.length > 0 ? true : false;
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
	const [enablePinMessageItem, setEnablePinMessageItem] = useState<boolean>(false);
	const [enableUnPinMessageItem, setEnableUnPinMessageItem] = useState<boolean>(false);
	const [enableCreateThreadItem, setEnableCreateThreadItem] = useState<boolean>(false);
	const [enableViewReactionItem, setEnableViewReactionItem] = useState<boolean>(false);
	const [enableRemoveOneReactionItem, setEnableRemoveOneReactionItem] = useState<boolean>(false);
	const [enableRemoveAllReactionItem, setEnableRemoveAllReactionsItem] = useState<boolean>(false);
	const [enableReportMessageItem, setEnableReportMessageItem] = useState<boolean>(false);
	const [enableCopyLinkItem, setEnableCopyLinkItem] = useState<boolean>(false);
	const [enableOpenLinkItem, setEnableOpenLinkItem] = useState<boolean>(false);
	const [enableCopyImageItem, setEnableCopyImageItem] = useState<boolean>(false);
	const [enableSaveImageItem, setEnableSaveImageItem] = useState<boolean>(false);

	// 1. allow view reaction
	useLayoutEffect(() => {
		setEnableViewReactionItem(checkMessageHasReaction());
	}, [checkMessageHasReaction()]);

	// 2. allow edit/report message
	useLayoutEffect(() => {
		setEnableEditMessageItem(checkSenderMessage);
		setEnableReportMessageItem(!checkSenderMessage);
	}, [checkSenderMessage]);

	// 3. allow pin message
	useLayoutEffect(() => {
		if (!pinMessage && !isClanCreator && !checkAdmintrator) {
			setEnablePinMessageItem(false);
		}
	}, [pinMessage, isClanCreator, checkAdmintrator]);

	// 4. allow unpin message
	useLayoutEffect(() => {
		if ((checkMessageInPinneList && isClanCreator) || (checkMessageInPinneList && pinMessage)) {
			setEnablePinMessageItem(false);
			setEnableUnPinMessageItem(true);
		}
	}, [checkMessageInPinneList, isClanCreator, pinMessage]);

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
		if (!!imgTarget) {
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
	}, [imgTarget]);

	const items = useMemo<ContextMenuItem[]>(() => {
		const builder = new MenuBuilder();

		builder.addMenuItem(
			'addReaction', // id
			'Add Reaction', // lable
			() => console.log('add reaction'), // callback
			<Icons.RightArrowRightClick />, // icon
			null, // sub menu
			false, // has sub menu?
			false, // disable ?
		);

		builder.when(enableViewReactionItem, (builder) => {
			builder.addMenuItem(
				'viewReaction',
				'View Reaction',
				() => console.log('view reaction'), // callback
				<Icons.ViewReactionRightClick />, // icon
				null, // sub menu
				false, // has sub menu?
				false, // disable ?);
			);
		});

		builder.when(enableEditMessageItem, (builder) => {
			builder.addMenuItem(
				'editMessage',
				'Edit Message',
				() => console.log('edit reaction'), // callback
				<Icons.EditMessageRightClick />, // icon
				null, // sub menu
				false, // has sub menu?
				false, // disable ?););
			);
		});

		builder.when(enablePinMessageItem, (builder) => {
			builder.addMenuItem(
				'pinMessage',
				'Pin Message',
				() => console.log('pin message'), // callback
				<Icons.PinMessageRightClick />, // icon
				null, // sub menu
				false, // has sub menu?
				false, // disable
			);
		});
		builder.when(enableUnPinMessageItem, (builder) => {
			builder.addMenuItem(
				'unPinMessage',
				'Unpin Message',
				() => console.log('unpin message'), // callback
				<Icons.PinMessageRightClick />, // icon
				null, // sub menu
				false, // has sub menu?
				false, // disable);
			);
		});

		builder.addMenuItem('reply', 'Reply', () => console.log('reply'), <Icons.Reply />);

		builder.when(enableCreateThreadItem, (builder) => {
			builder.addMenuItem(
				'createThread',
				'Create Thread',
				() => console.log('create thread'), // callback
				<Icons.ThreadIconRightClick />, // icon
				null, // sub menu
				false, // has sub menu?
				false, // disable););
			);
		});

		builder.addMenuItem('copyText', 'Copy Text', () => console.log('copy text'), <Icons.CopyTextRightClick />);
		builder.addMenuItem('apps', 'Apps', () => console.log('apps'), <Icons.RightArrowRightClick />);
		builder.addMenuItem('markUnread', 'Mark Unread', () => console.log('apps'), <Icons.UnreadRightClick />);
		builder.addMenuItem('copyMessageLink', 'Copy Message Link', () => console.log('apps'), <Icons.CopyMessageLinkRightClick />);
		builder.addMenuItem('forwardMessage', 'Forward Message', () => console.log('apps'), <Icons.ForwardRightClick />);

		builder.when(enableSpeakMessageItem, (builder) => {
			builder.addMenuItem(
				'speakMessage',
				'Speak Message',
				() => {
					console.log('speak Message');
				},
				<Icons.SpeakMessageRightClick />,
			);
		});

		builder.when(enableRemoveOneReactionItem, (builder) => {
			builder.addMenuItem(
				'removeReactions',
				'Remove Reactions',
				() => {
					console.log('remove reaction');
				},
				<Icons.RightArrowRightClick />,
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
				() => {
					console.log('delete message');
				},
				<Icons.DeleteMessageRightClick />,
			);
		});
		builder.when(enableReportMessageItem, (builder) => {
			builder.addMenuItem(
				'reportMessage',
				'Report Message',
				() => {
					console.log('report message');
				},
				<Icons.ReportMessageRightClick />,
			);
		});

		builder.when(enableCopyLinkItem, (builder) => {
			builder.addMenuItem('copyLink', 'Copy Link', () => {
				console.log('copy link');
			});
		});

		builder.when(enableOpenLinkItem, (builder) => {
			builder.addMenuItem('openLink', 'Open Link', () => {
				console.log('open link');
			});
		});

		builder.when(enableCopyImageItem, (builder) => {
			builder.addMenuItem('copyImage', 'Copy Image', () => {
				console.log('copy image');
			});
		});

		builder.when(enableSaveImageItem, (builder) => {
			builder.addMenuItem('saveImage', 'Save Image', () => {
				console.log('save image');
			});
		});

		return builder.build();
	}, [
		dispatch,
		messageId,
		imgTarget,
		enableViewReactionItem,
		enableEditMessageItem,
		enablePinMessageItem,
		enableUnPinMessageItem,
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
	]);

	return <DynamicContextMenu menuId={id} items={items} />;
}

export default MessageContextMenu;
