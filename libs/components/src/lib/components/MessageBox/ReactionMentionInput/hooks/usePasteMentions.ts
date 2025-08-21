import { getStore, selectAllRolesClan, selectRolesClanEntities } from '@mezon/store';
import {
  ChannelMembersEntity,
  MEZON_MENTIONS_COPY_KEY,
  RequestInput,
  generateMentionItems,
  getMarkupInsertIndex,
  insertStringAt,
  parsePastedMentionData,
  transformTextWithMentions
} from '@mezon/utils';
import { useCallback } from 'react';

import { getCurrentChatData } from '@mezon/core';
import processMention from '../processMention';

interface UsePasteMentionsProps {
  draftRequest?: RequestInput | null;
  updateDraft: (draft: RequestInput) => void;
  editorRef: React.RefObject<HTMLDivElement>;
  membersOfChild?: ChannelMembersEntity[] | null;
  membersOfParent?: ChannelMembersEntity[] | null;
}

export const usePasteMentions = ({ draftRequest, updateDraft, editorRef, membersOfChild, membersOfParent }: UsePasteMentionsProps) => {
  const onPasteMentions = useCallback(
    (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
      const pastedData = event.clipboardData.getData(MEZON_MENTIONS_COPY_KEY);

      if (!pastedData) return;

      const parsedData = parsePastedMentionData(pastedData);

      if (!parsedData) return;
      const { currentChatUsersEntities } = getCurrentChatData();

      const { message: pastedContent, startIndex, endIndex } = parsedData;
      const currentInputValueLength = (draftRequest?.valueTextInput ?? '').length;
      // const currentFocusIndex = editorRef.current?.selectionStart as number;
      const currentFocusIndex = 0;
      const store = getStore();
      const clanRolesEntities = selectRolesClanEntities(store.getState());

      const transformedText =
        pastedContent?.content?.t && pastedContent?.mentions
          ? transformTextWithMentions(
            pastedContent.content.t?.slice(startIndex, endIndex),
            pastedContent.mentions,
            currentChatUsersEntities,
            clanRolesEntities
          )
          : pastedContent?.content?.t || '';

      const mentionRaw = generateMentionItems(
        pastedContent?.mentions || [],
        transformedText,
        currentChatUsersEntities,
        currentInputValueLength
      );

      const rolesClan = selectAllRolesClan(store.getState());

      const { mentionList } = processMention(
        [...mentionRaw],
        rolesClan,
        membersOfChild as ChannelMembersEntity[],
        membersOfParent as ChannelMembersEntity[],
        ''
      );

      const transformedTextInsertIndex = getMarkupInsertIndex(currentFocusIndex, mentionList, currentChatUsersEntities, clanRolesEntities);

      updateDraft({
        valueTextInput: insertStringAt(draftRequest?.valueTextInput || '', transformedText || '', transformedTextInsertIndex),
        content: insertStringAt(draftRequest?.content || '', pastedContent?.content?.t?.slice(startIndex, endIndex) || '', currentFocusIndex),
      });


      event.preventDefault();
    },
    [draftRequest, editorRef, updateDraft, membersOfChild, membersOfParent]
  );

  return onPasteMentions;
};
