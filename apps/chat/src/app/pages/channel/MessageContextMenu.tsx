import { useMemo } from 'react';

import 'react-contexify/ReactContexify.css';
import DynamicContextMenu from './DynamicContextMenu';
import { messagesActions, referencesActions, selectMessageByMessageId, useAppDispatch } from '@mezon/store';
import { ContextMenuItem, EPermission, MenuBuilder } from '@mezon/utils';
import { useSelector } from 'react-redux';
import { useAuth, useClanRestriction } from '@mezon/core';

type MessageContextMenuProps = {
    id: string;
    messageId: string;
    imgTarget?: boolean | HTMLImageElement | null;
}




function MessageContextMenu({ id, imgTarget, messageId }: MessageContextMenuProps) {
  const dispatch = useAppDispatch();
  const message = useSelector(selectMessageByMessageId(messageId));
  const { userId } = useAuth()

  const [isAllowPinMessage] = useClanRestriction([EPermission.manageChannel])

  const isSender = useMemo(() => {
    return message?.sender_id === userId;
  }, [message.sender_id, userId]);

  const couldDelete = useMemo(() => {
    return isSender;
  }, [isSender]);


  const items = useMemo<ContextMenuItem[]>(() => {
    const builder = new MenuBuilder();

    builder.addMenuItem('addReaction', 'Add Reaction');

    builder.addMenuItem('reply', 'Reply');
    builder.addMenuItem('createThread', 'Create Thread');
    builder.addMenuItem('copyText', 'Copy Text');
    builder.addMenuItem('apps', 'Apps');
    builder.addMenuItem('markUnread', 'Mark Unread');
    builder.addMenuItem('copyMessageLink', 'Copy Message Link');
    builder.addMenuItem('forwardMessage', 'Forward Message');
    builder.addSeparator();

    builder.when(isAllowPinMessage, (builder) => {
      builder.addMenuItem('pinMessage', 'Pin Message');
      builder.addMenuItem('unPinMessage', 'Unpin Message');
      builder.addSeparator();
    });

    builder.when(isSender, (builder) => {
      builder.addMenuItem('editMessage', 'Edit Message', () => {
        dispatch(referencesActions.setOpenReplyMessageState(false));
        dispatch(referencesActions.setOpenEditMessageState(true));
        dispatch(messagesActions.setOpenOptionMessageState(false));
        dispatch(referencesActions.setIdReferenceMessageEdit(messageId));
      });
    })

    builder.when(couldDelete, (builder) => {
      builder.addMenuItem('deleteMessage', 'Delete Message');
    });

    // builder.addMenuItem('removeReaction', 'Remove Reactions');
    // builder.addMenuItem('removeAllReactions', 'Remove All Reactions');
    // builder.addSeparator();

    // builder.addMenuItem('reportMessage', 'Report Message');
    // builder.addSeparator();

    // builder.addMenuItem('viewReactions', 'View Reactions');
    // builder.addSeparator();

    builder.when(!!imgTarget, (builder) => {
      builder.addMenuItem('copyImage', 'Copy Image');
      builder.addMenuItem('saveImage', 'Save Image');
    });


    return builder.build();
  }, [dispatch, messageId, imgTarget, isSender, couldDelete, isAllowPinMessage]);

  return (
    <DynamicContextMenu menuId={id} items={items} />
  );
}

export default MessageContextMenu;