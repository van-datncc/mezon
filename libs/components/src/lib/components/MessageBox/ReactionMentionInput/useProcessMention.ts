import { selectAllEmojiSuggestion } from '@mezon/store';
import { ETypeMEntion, getEmojiId, IEmojiOnMessage, IHashtagOnMessage, IMentionOnMessage, IRoleMention } from '@mezon/utils';
import { MentionItem } from 'react-mentions';
import { useSelector } from 'react-redux';

const useProcessMention = (text: string, mentionsRaw: MentionItem[], roleList: IRoleMention[]) => {
	const mentions: IMentionOnMessage[] = [];
	const hashtags: IHashtagOnMessage[] = [];
	const emojis: IEmojiOnMessage[] = [];

	const emojiListPNG = useSelector(selectAllEmojiSuggestion);

	mentionsRaw.forEach((item) => {
		const { id, display, plainTextIndex, childIndex } = item;
		const startindex = plainTextIndex;
		const endindex = plainTextIndex + display.length;

		if (childIndex === ETypeMEntion.MENTION) {
			mentions.push({
				userid: id,
				username: display,
				startindex,
				endindex,
			});
		} else if (childIndex === ETypeMEntion.HASHTAG) {
			hashtags.push({
				channelid: id,
				channellabel: display,
				startindex,
				endindex,
			});
		} else if (childIndex === ETypeMEntion.EMOJI) {
			emojis.push({
				emojiid: getEmojiId(display, emojiListPNG),
				shortname: display,
				startindex,
				endindex,
			});
		}
	});

	return {
		mentionList: mentions,
		hashtagList: hashtags,
		emojiList: emojis,
	};
};

export default useProcessMention;
