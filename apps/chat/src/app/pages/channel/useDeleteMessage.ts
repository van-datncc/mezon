import { useState, useCallback } from 'react';
import { useDeleteMessage } from '@mezon/core';

export const useDeleteMessageHook = (channelId: string, channelLabel: string, mode: number) => {
  const { DeleteSendMessage } = useDeleteMessage({ channelId: channelId || '', channelLabel: channelLabel || '', mode });
  const [deleteMessage, setDeleteMessage] = useState(false);

  const handleDeleteMessage = useCallback(() => {
    setDeleteMessage(true);
  }, []);

  return {
    deleteMessage,
    setDeleteMessage,
    handleDeleteMessage,
    DeleteSendMessage
  };
};
