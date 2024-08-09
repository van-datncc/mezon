import { getSrcEmoji } from '@mezon/utils';

type IEmojiMarkup = {
	isMessageReply: boolean;
	shortname: string;
	emojiid: string;
};
export const EmojiMarkup = ({ isMessageReply, shortname, emojiid }: IEmojiMarkup) => {
	const srcEmoji = getSrcEmoji(emojiid);

	if (!srcEmoji) {
		return shortname;
	}
	return isMessageReply ? `![${shortname}](${srcEmoji})` : `[:${shortname}](${srcEmoji})`;
};
