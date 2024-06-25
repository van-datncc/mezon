import React, { useEffect, useMemo, useRef } from 'react';
import { MentionsInput, Mention } from 'react-mentions';
import { useSelector } from 'react-redux';
import { useEscapeKey, useEmojiSuggestion, useChannels } from '@mezon/core';
import lightMentionsInputStyle from './LightRmentionInputStyle';
import darkMentionsInputStyle from './RmentionInputStyle';
import mentionStyle from './RmentionStyle';
import SuggestItem from 'libs/components/src/lib/components/MessageBox/ReactionMentionInput/SuggestItem';
import { useEditMessage } from './useEditMessage';
import { selectTheme } from '@mezon/store';
import { IMessageWithUser } from '@mezon/utils';

type MessageInputProps = {
  messageId: string;
  channelId: string;
  mode: number;
  channelLabel: string;
  message: IMessageWithUser;
};

type ChannelsMentionProps = {
	id: string;
	display: string;
	subText: string;
};

const convertToPlainTextHashtag = (text: string) => {
	const regex = /([@#])\[(.*?)\]\((.*?)\)/g;
	const result = text.replace(regex, (match, symbol, p1, p2) => {
		return symbol === '#' ? `<#${p2}>` : `@${p1}`;
	});
	return result;
};

const replaceChannelIdsWithDisplay = (text: string, listInput: ChannelsMentionProps[]) => {
    const regex = /<#[0-9]{19}\b>/g;
    const replacedText = text.replace(regex, (match) => {
        const channelId = match.substring(2, match.length - 1);
        const channel = listInput.find((item) => item.id === channelId);
        return channel ? `#[${channel.display}](${channelId})` : match;
    });

    return replacedText;
};

const MessageInput: React.FC<MessageInputProps> = ({ messageId, channelId, mode, channelLabel, message }) => {
  const {
    openEditMessageState,
    idMessageRefEdit,
    editMessage,
    setEditMessage,
    content,
    setContent,
    handleCancelEdit,
    handleSend
  } = useEditMessage(channelId, channelLabel, mode, message);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const appearanceTheme = useSelector(selectTheme);

  const { listChannels } = useChannels();

  const listChannelsMention = useMemo(
    () =>
      listChannels.map((item) => {
        return {
          id: item?.channel_id ?? '',
          display: item?.channel_label ?? '',
          subText: item?.category_name ?? '',
        };
      }),
    [listChannels]
  );

  useEffect(() => {
    if (editMessage) {
        const convertedHashtag = convertToPlainTextHashtag(editMessage);
        const replacedText = replaceChannelIdsWithDisplay(convertedHashtag, listChannelsMention);
        setEditMessage(replacedText);
        setContent(convertedHashtag);
    }
}, [editMessage, listChannelsMention]);

  useEffect(() => {
    if (openEditMessageState && message.id === idMessageRefEdit) {
      textareaRef.current?.focus();
    }
  }, [openEditMessageState, message.id, idMessageRefEdit]);

  const handleFocus = () => {
    if (textareaRef.current) {
      const length = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(length, length);
    }
  };

  const { emojis } = useEmojiSuggestion();
  const neverMatchingRegex = /($a)/;
  const queryEmojis = (query: string, callback: (data: any[]) => void) => {
    if (query.length === 0) return;
    const matches = emojis
      .filter((emoji) => emoji.shortname && emoji.shortname.indexOf(query.toLowerCase()) > -1)
      .slice(0, 20)
      .map((emojiDisplay) => ({ id: emojiDisplay?.shortname, display: emojiDisplay?.shortname }));
    callback(matches);
  };

  useEscapeKey(handleCancelEdit);

  const onSend = (e: React.KeyboardEvent<Element>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      if (editMessage?.trim() === '') {
        handleCancelEdit();
        return;
      }
      if (content) {
        handleSend(content, message.id);
        handleCancelEdit();
      }
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      handleCancelEdit();
    }
  };

  const handleSave = () => {
    if (content) {
      handleSend(content, message.id);
      handleCancelEdit();
    }
  };

  return (
    <div className="inputEdit relative top-[-25px]">
      <MentionsInput
        onFocus={handleFocus}
        inputRef={textareaRef}
        value={editMessage}
        className={`w-full dark:bg-black bg-white border border-[#bebebe] dark:border-none rounded p-[10px] dark:text-white text-black customScrollLightMode ${appearanceTheme === 'light' && 'lightModeScrollBarMention'}`}
        onKeyDown={onSend}
        onChange={(e, newValue) => {
          setEditMessage(newValue);
        }}
        rows={editMessage?.split('\n').length}
        forceSuggestionsAboveCursor={true}
        style={appearanceTheme === 'light' ? lightMentionsInputStyle : darkMentionsInputStyle}
      >
        <Mention
          appendSpaceOnAdd={true}
          data={[] /* Replace with actual mention list */}
          trigger="@"
          displayTransform={(id: any, display: any) => `@${display}`}
          renderSuggestion={(suggestion) => <SuggestItem name={suggestion.display ?? ''} avatarUrl={(suggestion as any).avatarUrl} subText="" />}
          className="dark:bg-[#3B416B] bg-bgLightModeButton"
          style={mentionStyle}
        />
        <Mention
          markup="#[__display__](__id__)"
          appendSpaceOnAdd={true}
          data={[] /* Replace with actual channel mention list */}
          trigger="#"
          displayTransform={(id: any, display: any) => `#${display}`}
          style={mentionStyle}
          renderSuggestion={(suggestion) => (
            <SuggestItem name={suggestion.display ?? ''} symbol="#" subText={(suggestion as any).subText} />
          )}
          className="dark:bg-[#3B416B] bg-bgLightModeButton"
        />
        <Mention
          trigger=":"
          markup="__id__"
          regex={neverMatchingRegex}
          data={queryEmojis}
          renderSuggestion={(suggestion) => <SuggestItem name={suggestion.display ?? ''} symbol={(suggestion as any).emoji} />}
          className="dark:bg-[#3B416B] bg-bgLightModeButton"
          appendSpaceOnAdd={true}
        />
      </MentionsInput>
      <div className="text-xs flex">
        <p className="pr-[3px]">escape to</p>
        <p className="pr-[3px] text-[#3297ff]" style={{ cursor: 'pointer' }} onClick={handleCancelEdit}>
          cancel
        </p>
        <p className="pr-[3px]">• enter to</p>
        <p className="text-[#3297ff]" style={{ cursor: 'pointer' }} onClick={handleSave}>
          save
        </p>
      </div>
    </div>
  );
};

export default React.memo(MessageInput);
