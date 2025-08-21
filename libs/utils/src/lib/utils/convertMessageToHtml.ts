import {
  EBacktickType,
  IEmojiOnMessage,
  IExtendedMessage,
  IHashtagOnMessage,
  IMarkdownOnMessage,
  IMentionOnMessage
} from '../types';


export const convertMessageToHtml = (message: IExtendedMessage): string => {
  const { t: text = '', mentions = [], hg: hashtags = [], ej: emojis = [], mk: markdown = [] } = message;

  if (!text) return '';

  const allEntities: Array<{
    start: number;
    end: number;
    html: string;
    type: string;
  }> = [];

  mentions.forEach((mention: IMentionOnMessage) => {
    let start = mention.s;
    let end = mention.e;

    if (start === undefined && end !== undefined) {
      const beforeEnd = text.substring(0, end);
      const atMatch = beforeEnd.lastIndexOf('@');
      if (atMatch !== -1) {
        start = atMatch;
      }
    }

    if (start !== undefined && end !== undefined) {
      const mentionText = text.substring(start, end);
      const userId = mention.user_id || mention.role_id;

      if (userId) {
        allEntities.push({
          start: start,
          end: end,
          html: `<a class="text-entity-link mention" data-entity-type="MessageEntityMentionName" data-user-id="${userId}" contenteditable="false" dir="auto">${mentionText}</a>`,
          type: 'mention'
        });
      }
    }
  });

  hashtags.forEach((hashtag: IHashtagOnMessage) => {
    if (hashtag.s !== undefined && hashtag.e !== undefined) {
      const hashtagText = text.substring(hashtag.s, hashtag.e);

      if (hashtag.channelid) {
        allEntities.push({
          start: hashtag.s,
          end: hashtag.e,
          html: `<a class="text-entity-link hashtag" data-entity-type="MessageEntityHashtag" data-channel-id="${hashtag.channelid}" contenteditable="false" dir="auto">${hashtagText}</a>`,
          type: 'hashtag'
        });
      }
    }
  });

  emojis.forEach((emoji: IEmojiOnMessage) => {
    if (emoji.s !== undefined && emoji.e !== undefined) {
      const emojiText = text.substring(emoji.s, emoji.e);

      if (emoji.emojiid) {
        allEntities.push({
          start: emoji.s,
          end: emoji.e,
          html: `<span class="text-entity-link emoji" data-entity-type="MessageEntityCustomEmoji" data-emoji-id="${emoji.emojiid}" contenteditable="false">${emojiText}</span>`,
          type: 'emoji'
        });
      }
    }
  });

  markdown.forEach((mark: IMarkdownOnMessage) => {
    if (mark.s !== undefined && mark.e !== undefined) {
      const markdownText = text.substring(mark.s, mark.e);
      let markdownFormatted = '';

      switch (mark.type) {
        case EBacktickType.PRE:
          markdownFormatted = `\`\`\`${markdownText}\`\`\``;
          break;
        case EBacktickType.CODE:
          markdownFormatted = `\`${markdownText}\``;
          break;
        case EBacktickType.BOLD:
          markdownFormatted = `**${markdownText}**`;
          break;
        // case EBacktickType.SINGLE:
        //   markdownFormatted = `*${markdownText}*`;
        //   break;
        case EBacktickType.LINK:
          markdownFormatted = markdownText;
          break;
        default:
          markdownFormatted = markdownText;
          break;
      }

      allEntities.push({
        start: mark.s,
        end: mark.e,
        html: markdownFormatted,
        type: 'markdown'
      });
    }
  });

  allEntities.sort((a, b) => a.start - b.start);

  let result = '';
  let lastIndex = 0;

  allEntities.forEach(entity => {
    result += text.substring(lastIndex, entity.start);
    result += entity.html;
    lastIndex = entity.end;
  });

  result += text.substring(lastIndex);


  return result;
};
