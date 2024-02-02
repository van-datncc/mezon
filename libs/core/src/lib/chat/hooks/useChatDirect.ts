import { useMemo } from 'react';
import {
  selectAllDirectMessages, selectAllFriends,
} from '@mezon/store';
import { useSelector } from 'react-redux';

// @deprecated

export function useChatDirect() {
  const friends = useSelector(selectAllFriends)
  const listDM = useSelector(selectAllDirectMessages);
  //sendMessage Direct Actions

  return useMemo(
    () => ({
      friends,
      listDM
    }),
    [
      friends,
      listDM
    ],
  );
}
