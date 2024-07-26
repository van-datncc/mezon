import { selectAllEmojiSuggestion } from '@mezon/store';
import { getSrcEmoji } from '@mezon/utils';
import { useSelector } from 'react-redux';

type IEmojiMarkup = {
	isMessageReply: boolean;
	shortname: string;
};
export const EmojiMarkup = ({ isMessageReply, shortname }: IEmojiMarkup) => {
	const emojiListPNG = useSelector(selectAllEmojiSuggestion);
	const srcEmoji = getSrcEmoji(shortname, emojiListPNG);

	return isMessageReply ? `![${shortname}](${srcEmoji})` : `[:${shortname}](${srcEmoji})`;
};
