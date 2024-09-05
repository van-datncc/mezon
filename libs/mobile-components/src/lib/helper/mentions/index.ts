import { ChannelsEntity, HashtagDmEntity } from '@mezon/store-mobile';
import {
	ETokenMessage,
	IEmojiOnMessage,
	IExtendedMessage,
	IHashtagOnMessage,
	ILinkOnMessage,
	ILinkVoiceRoomOnMessage,
	IMarkdownOnMessage,
	IMentionOnMessage
} from '@mezon/utils';
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

type ElementToken =
	| (IMentionOnMessage & { kindOf: ETokenMessage.MENTIONS })
	| (IHashtagOnMessage & { kindOf: ETokenMessage.HASHTAGS })
	| (IEmojiOnMessage & { kindOf: ETokenMessage.EMOJIS })
	| (ILinkOnMessage & { kindOf: ETokenMessage.LINKS })
	| (IMarkdownOnMessage & { kindOf: ETokenMessage.MARKDOWNS })
	| (ILinkVoiceRoomOnMessage & { kindOf: ETokenMessage.VOICE_LINKS });

export const createFormattedString = (data: IExtendedMessage): string => {
	const { t = '' } = data;
	const elements: ElementToken[] = (Object.keys(data) as (keyof IExtendedMessage)[])
		.flatMap((key) => (Array.isArray(data[key]) ? data[key].map((item) => item && { ...item, kindOf: key }) : []))
		.filter(Boolean) as ElementToken[];
	elements?.sort((a, b) => (a.s ?? 0) - (b.s ?? 0));
	let result = '';
	let lastIndex = 0;

	elements?.forEach((element) => {
		const startindex = element.s ?? lastIndex;
		const endindex = element.e ?? startindex;
		result += t.slice(lastIndex, startindex);
		const contentInElement = t.substring(startindex, endindex);

		switch (element.kindOf) {
			case ETokenMessage.MENTIONS:
				if (element.user_id || element.role_id) {
					const id = element.user_id ?? element.role_id;
					result += `{@}[${contentInElement.slice(1)}](${id})`;
				}
				break;
			case ETokenMessage.HASHTAGS:
				result += `{#}[${contentInElement.slice(1)}](${element.channelid})`;
				break;
			default:
				result += contentInElement;
				break;
		}

		lastIndex = endindex;
	});
	result += t.slice(lastIndex);
	return result;
};
