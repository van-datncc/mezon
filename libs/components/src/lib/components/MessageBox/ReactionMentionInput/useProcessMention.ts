import { ETypeMEntion, IEmojiOnMessage, IHashtagOnMessage, IMentionOnMessage, IRoleMention } from '@mezon/utils';
import { MentionItem } from 'react-mentions';

const useProcessMention = (mentionsRaw: MentionItem[], roleList: IRoleMention[]) => {
	const mentions: IMentionOnMessage[] = [];
	const hashtags: IHashtagOnMessage[] = [];
	const emojis: IEmojiOnMessage[] = [];
	mentionsRaw.forEach((item) => {
		const { id, display, plainTextIndex, childIndex } = item;
		const s = plainTextIndex;
		const e = plainTextIndex + display.length;
		const isRole = roleList.some((role) => role.roleId === id);

		if (childIndex === ETypeMEntion.MENTION) {
			if (isRole) {
				mentions.push({
					role_id: id,
					// rolename: display,
					s,
					e,
				});
			} else {
				mentions.push({
					user_id: id,
					// username: display,
					s,
					e,
				});
			}
		} else if (childIndex === ETypeMEntion.HASHTAG) {
			hashtags.push({
				channelid: id,
				// channellabel: display,
				s,
				e,
			});
		} else if (childIndex === ETypeMEntion.EMOJI) {
			emojis.push({
				emojiid: id,
				// shortname: display,
				s,
				e,
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
