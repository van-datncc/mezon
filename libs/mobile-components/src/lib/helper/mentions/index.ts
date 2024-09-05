import { ChannelsEntity, HashtagDmEntity } from '@mezon/store-mobile';
import { ChannelStreamMode } from 'mezon-js';

export const convertMentionsToText = (text: string) => {
	if (!text) {
		return '';
	}
	const mentionPattern = /{@}\[([^\]]+)\]\(\d+\)|{#}\[([^\]]+)\]\((\d+)\)|\{:\}\[([^\]]+)\]\(([^)]+)\)/g;

	return text?.replace(mentionPattern, (match, userMention, hashtagMention, hashtagId, tagValue) => {
		if (userMention) {
			return `@[${userMention}]`;
		} else if (hashtagMention && hashtagId) {
			return `<#${hashtagMention}>`;
		} else if (tagValue) {
			return `${tagValue}`;
		} else {
			return match;
		}
	});
};
export const convertMentionsToData = (text: string) => {
	const mentionPattern = /({@}|{#})\[([^\]]+)\]\((\d+)\)/g;
	const result = [];
	let match;
	while ((match = mentionPattern.exec(text)) !== null) {
		const prefix = match[1];
		const mention = match[2];
		const id = match[3];
		result.push({
			id: id,
			display: `${prefix === '{@}' ? '@' : '#'}${mention}`
		});
	}
	return result;
};

export const getChannelHashtag = (hashtagDmEntities: HashtagDmEntity[], channelsEntities: ChannelsEntity[], mode: number, channelLabel: string) => {
	if ([ChannelStreamMode.STREAM_MODE_DM].includes(mode)) {
		return hashtagDmEntities?.find((item) => item?.channel_label === channelLabel);
	} else {
		return channelsEntities?.find((item) => item?.channel_label === channelLabel);
	}
};
