import { selectAllRolesClan } from '@mezon/store';
import { ETypeMEntion, getRoleList, IEmojiOnMessage, IHashtagOnMessage, IMentionOnMessage, UserMentionsOpt } from '@mezon/utils';
import { useEffect, useState } from 'react';
import { MentionItem } from 'react-mentions';
import { useSelector } from 'react-redux';

interface IRoleMention {
	roleId: string;
	roleName: string;
}

const useProcessMention = (text: string, mentionsRaw: MentionItem[]) => {
	const [mentionList, setMentionList] = useState<IMentionOnMessage[]>([]);
	const [hashtagList, setHashtagList] = useState<IHashtagOnMessage[]>([]);
	const [emojiList, setEmojiList] = useState<IEmojiOnMessage[]>([]);
	const [simplifiedMentionList, setSimplifiedMentionList] = useState<UserMentionsOpt[]>([]);

	const rolesInClan = useSelector(selectAllRolesClan);
	const roleList = getRoleList(rolesInClan);

	function doesIdExist(id: string, roles: IRoleMention[]): boolean {
		return roles.some((role) => role.roleId === id);
	}

	useEffect(() => {
		const mentions: IMentionOnMessage[] = [];
		const hashtags: IHashtagOnMessage[] = [];
		const emojis: IEmojiOnMessage[] = [];

		mentionsRaw.forEach((item) => {
			const { id, display, plainTextIndex, childIndex } = item;
			const startindex = plainTextIndex;
			const endindex = plainTextIndex + display.length;

			if (childIndex === ETypeMEntion.MENTION) {
				// Mention
				mentions.push({
					userid: id,
					username: display,
					startindex,
					endindex,
				});
			} else if (childIndex === ETypeMEntion.HASHTAG) {
				// Hashtag
				hashtags.push({
					channelid: id,
					channellabel: display,
					startindex,
					endindex,
				});
			} else if (childIndex === ETypeMEntion.EMOJI) {
				// Emoji
				emojis.push({
					shortname: display,
					startindex,
					endindex,
				});
			}
		});

		setMentionList(mentions);
		setHashtagList(hashtags);
		setEmojiList(emojis);

		const simplifiedList = mentions.map((mention) => {
			const isRole = doesIdExist(mention.userid ?? '', roleList ?? []);
			if (isRole) {
				const role = roleList.find((role) => role.roleId === mention.userid);
				return {
					role_id: role?.roleId,
					rolename: role?.roleName,
				};
			} else {
				return {
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
