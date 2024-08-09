import { ChannelsEntity } from '@mezon/store-mobile';
import { ApiMessageAttachment } from 'mezon-js/dist/api.gen';
import { STORAGE_KEY_TEMPORARY_ATTACHMENT } from '../../constant';
import { load, save } from '../storage';
import {
	IEmojiOnMessage,
	IHashtagOnMessage,
	ILinkOnMessage, ILinkVoiceRoomOnMessage,
	IMarkdownOnMessage,
	IMentionOnMessage
} from '@mezon/utils';

export function abbreviateText(filename: string) {
	// Split the filename and extension
	const parts = filename.split('.');
	const extension = parts.pop();
	let baseName = parts.join('.');

	// Split the base name into parts by underscores or spaces
	const baseNameParts = baseName.split(/[_\s]+/);

	// Abbreviate the parts according to the examples given
	if (baseNameParts.length > 2) {
		baseName = baseNameParts[0] + '...' + baseNameParts[baseNameParts.length - 1];
	} else if (baseNameParts.length == 2) {
		baseName = baseNameParts[0] + '...' + baseNameParts[1];
	}

	// Recombine the base name and extension
	return baseName + '.' + extension;
}

export function getAttachmentUnique(attachments: ApiMessageAttachment[]) {
	return Object.values(
		attachments.reduce((acc: any, cur: any) => {
			if (!acc[cur.filename] || cur.size) {
				acc[cur.filename] = cur;
			}
			return acc;
		}, {}),
	);
}

export const getChannelById = (channelHashtagId: string, channelsEntities?: Record<string, ChannelsEntity>) => {
	if (!channelsEntities) return;
	return channelsEntities[channelHashtagId];
};

export const convertToPlainTextHashtag = (text: string) => {
	const hashtagPattern = /\{\#\}\[(.*?)\]\(\d+\)/g;
	text = text.replace(hashtagPattern, (match, p1) => `#${p1}`);
	const mentionPattern = /\{\@\}\[(.*?)\]\(\d+\)/g;
	text = text.replace(mentionPattern, (match, p1) => `@${p1}`);

	return text;
};

export const codeBlockRegex = /^```[\s\S]*```$/;
export const codeBlockRegexGlobal = /```[\s\S]*?```/g;
export const markdownDefaultUrlRegex = /^\[.*?\]\(https?:\/\/[^\s]+\)$/;
export const splitBlockCodeRegex =
	/(```[\s\S]*?```)|(https?:\/\/[^\s]+)|(<#\d+>)|(@[\w.]+)|(\w+)|(\s+)|(\[.*?\]\(https?:\/\/[^\s]+\))|(:[a-zA-Z0-9_]+:)/g;
export const urlRegex = /(https?:\/\/[^\s]+)/g;

export const pushAttachmentToCache = (attachment: any, channelId: string | number) => {
	const allCachedAttachment = load(STORAGE_KEY_TEMPORARY_ATTACHMENT) || {};

	if (Array.isArray(attachment)) {
		save(STORAGE_KEY_TEMPORARY_ATTACHMENT, {
			...allCachedAttachment,
			[channelId]: attachment,
		});
	} else {
		const currentAttachment = allCachedAttachment[channelId] || [];
		currentAttachment.push(attachment);

		save(STORAGE_KEY_TEMPORARY_ATTACHMENT, {
			...allCachedAttachment,
			[channelId]: currentAttachment,
		});
	}
};

type MessageElementToken = IMentionOnMessage | IHashtagOnMessage | IEmojiOnMessage | ILinkOnMessage | IMarkdownOnMessage | ILinkVoiceRoomOnMessage;

export const isMentionOnMessage = (element: MessageElementToken): element is IMentionOnMessage => (element as IMentionOnMessage).username !== undefined || (element as IMentionOnMessage).rolename !== undefined;

export const isHashtagOnMessage = (element: MessageElementToken): element is IHashtagOnMessage => (element as IHashtagOnMessage).channelid !== undefined;

export const isEmojiOnMessage = (element: MessageElementToken): element is IEmojiOnMessage => (element as IEmojiOnMessage).shortname !== undefined;

export const isLinkOnMessage = (element: MessageElementToken): element is ILinkOnMessage => (element as ILinkOnMessage).lk !== undefined;

export const isMarkdownOnMessage = (element: MessageElementToken): element is IMarkdownOnMessage => (element as IMarkdownOnMessage).mk !== undefined;

export const isLinkVoiceRoomOnMessage = (element: MessageElementToken): element is ILinkVoiceRoomOnMessage =>
	(element as ILinkVoiceRoomOnMessage).vk !== undefined;
