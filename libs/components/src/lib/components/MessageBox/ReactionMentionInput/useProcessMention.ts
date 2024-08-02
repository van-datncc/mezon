import { selectAllRolesClan } from '@mezon/store';
import { ETypeMention, IEmojiOnMessage, IHashtagOnMessage, IMentionOnMessage, UserMentionsOpt } from '@mezon/utils';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

interface IRoleMention {
	roleId: string;
	roleName: string;
}

const useProcessMention = (text: string) => {
	const [mentionList, setMentionList] = useState<IMentionOnMessage[]>([]);
	const [hashtagList, setHashtagList] = useState<IHashtagOnMessage[]>([]);
	const [emojiList, setEmojiList] = useState<IEmojiOnMessage[]>([]);
	const [simplifiedMentionList, setSimplifiedMentionList] = useState<UserMentionsOpt[]>([]);

	const rolesInClan = useSelector(selectAllRolesClan);
	const roleList = rolesInClan.map((item) => ({
		roleId: item.id ?? '',
		roleName: item.title ?? '',
	}));

	function doesIdExist(id: string, roles: IRoleMention[]): boolean {
		return roles.some((role) => role.roleId === id);
	}

	useEffect(() => {
		const mentions: IMentionOnMessage[] = [];
		const hashtags: IHashtagOnMessage[] = [];
		const emojis: IEmojiOnMessage[] = [];

		const mentionPrefix = '@[';
		const hashtagPrefix = '#[';
		const emojiPrefix = '[:'; // Emoji prefix
		const emojiSuffix = ']';

		let index = 0;

		while (index < text.length) {
			if (text.startsWith(mentionPrefix, index)) {
				let startindex = index;
				index += mentionPrefix.length;

				// Extract username
				const usernameEnd = text.indexOf(']', index);
				const username = `@${text.substring(index, usernameEnd)}`;
				index = usernameEnd + 1;

				// Extract userId
				const userIdStart = text.indexOf('(', index) + 1;
				const userIdEnd = text.indexOf(')', userIdStart);
				const userid = text.substring(userIdStart, userIdEnd);
				index = userIdEnd + 1;

				mentions.push({
					userid,
					username,
					startindex,
					endindex: index,
				});
			} else if (text.startsWith(hashtagPrefix, index)) {
				let startindex = index;
				index += hashtagPrefix.length;

				// Extract channelLabel
				const labelEnd = text.indexOf(']', index);
				const channellabel = `#${text.substring(index, labelEnd)}`;
				index = labelEnd + 1;

				// Extract channelId
				const channelIdStart = text.indexOf('(', index) + 1;
				const channelIdEnd = text.indexOf(')', channelIdStart);
				const channelid = text.substring(channelIdStart, channelIdEnd);
				index = channelIdEnd + 1;

				hashtags.push({
					channelid,
					channellabel,
					startindex,
					endindex: index,
				});
			} else if (text.startsWith(emojiPrefix, index)) {
				let startindex = index;
				index += emojiPrefix.length;

				// Extract emoji
				const emojiEnd = text.indexOf(emojiSuffix, index);
				const shortname = text.substring(index, emojiEnd);
				index = emojiEnd + emojiSuffix.length;

				emojis.push({
					shortname,
					startindex,
					endindex: index,
				});
			} else {
				index++;
			}
		}

		setMentionList(mentions);
		setHashtagList(hashtags);
		setEmojiList(emojis);

		const simplifiedList = mentions.map((mention) => {
			const isRole = doesIdExist(mention.userid ?? '', roleList ?? []);
			if (isRole) {
				const role = roleList.find((role) => role.roleId === mention.userid);
				return {
					type: ETypeMention.ROLE,
					role_id: role?.roleId,
					rolename: `@${role?.roleName}`,
				};
			} else {
				return {
					type: ETypeMention.USER,
					user_id: mention.userid,
					username: mention.username,
				};
			}
		});
		setSimplifiedMentionList(simplifiedList);
	}, [text]);

	return { mentionList, simplifiedMentionList, hashtagList, emojiList };
};

export default useProcessMention;
