import { EBacktickType, IMarkdownOnMessage } from '../types';

export enum ApiMessageEntityTypes {
	Bold = 'MessageEntityBold',
	BotCommand = 'MessageEntityBotCommand',
	Cashtag = 'MessageEntityCashtag',
	Code = 'MessageEntityCode',
	Email = 'MessageEntityEmail',
	Italic = 'MessageEntityItalic',
	Phone = 'MessageEntityPhone',
	Pre = 'MessageEntityPre',
	Strike = 'MessageEntityStrike',
	TextUrl = 'MessageEntityTextUrl',
	Url = 'MessageEntityUrl',
	Underline = 'MessageEntityUnderline',
	Spoiler = 'MessageEntitySpoiler',
	Unknown = 'MessageEntityUnknown'
}

export type ApiMessageEntityDefault = {
	type: Exclude<`${ApiMessageEntityTypes}`, `${ApiMessageEntityTypes.Pre}` | `${ApiMessageEntityTypes.TextUrl}`>;
	offset: number;
	length: number;
};

export type ApiMessageEntityPre = {
	type: ApiMessageEntityTypes.Pre;
	offset: number;
	length: number;
	language?: string;
};

export type ApiMessageEntityTextUrl = {
	type: ApiMessageEntityTypes.TextUrl;
	offset: number;
	length: number;
	url: string;
};

export type ApiMessageEntity = ApiMessageEntityDefault | ApiMessageEntityPre | ApiMessageEntityTextUrl;

export interface ApiFormattedText {
	text: string;
	entities?: ApiMessageEntity[];
}

export const ENTITY_CLASS_BY_NODE_NAME: Record<string, ApiMessageEntityTypes> = {
	B: ApiMessageEntityTypes.Bold,
	STRONG: ApiMessageEntityTypes.Bold,
	I: ApiMessageEntityTypes.Italic,
	EM: ApiMessageEntityTypes.Italic,
	INS: ApiMessageEntityTypes.Underline,
	U: ApiMessageEntityTypes.Underline,
	S: ApiMessageEntityTypes.Strike,
	STRIKE: ApiMessageEntityTypes.Strike,
	DEL: ApiMessageEntityTypes.Strike,
	CODE: ApiMessageEntityTypes.Code,
	PRE: ApiMessageEntityTypes.Pre
};

const MAX_TAG_DEEPNESS = 3;

export function parseHtmlAsFormattedText(html: string): ApiFormattedText {
	const fragment = document.createElement('div');
	fragment.innerHTML = parseMarkdown(parseMarkdownLinks(html));
	fixImageContent(fragment);
	const text = fragment.innerText.trim().replace(/\u200b+/g, '');
	const trimShift = fragment.innerText.indexOf(text[0]);
	let textIndex = -trimShift;
	let recursionDeepness = 0;
	const entities: ApiMessageEntity[] = [];

	function addEntity(node: ChildNode) {
		if (node.nodeType === Node.COMMENT_NODE) return;
		const { index, entity } = getEntityDataFromNode(node, text, textIndex);

		if (entity) {
			textIndex = index;
			entities.push(entity);
		} else if (node.textContent) {
			// Skip newlines on the beginning
			if (index === 0 && node.textContent.trim() === '') {
				return;
			}
			textIndex += node.textContent.length;
		}

		if (node.hasChildNodes() && recursionDeepness <= MAX_TAG_DEEPNESS) {
			recursionDeepness += 1;
			Array.from(node.childNodes).forEach(addEntity);
		}
	}

	Array.from(fragment.childNodes).forEach((node) => {
		recursionDeepness = 1;
		addEntity(node);
	});

	return {
		text,
		entities: entities.length ? entities : undefined
	};
}

export function fixImageContent(fragment: HTMLDivElement) {
	fragment.querySelectorAll('img').forEach((node) => {
		if (node.dataset.documentId) {
			// Custom Emoji
			node.textContent = (node as HTMLImageElement).alt || '';
		} else {
			// Regular emoji with image fallback
			node.replaceWith(node.alt || '');
		}
	});
}

function parseMarkdown(html: string) {
	let parsedHtml = html.slice(0);

	// Strip redundant nbsp's
	parsedHtml = parsedHtml.replace(/&nbsp;/g, ' ');

	// Replace <div><br></div> with newline (new line in Safari)
	parsedHtml = parsedHtml.replace(/<div><br([^>]*)?><\/div>/g, '\n');
	// Replace <br> with newline
	parsedHtml = parsedHtml.replace(/<br([^>]*)?>/g, '\n');

	// Strip redundant <div> tags
	parsedHtml = parsedHtml.replace(/<\/div>(\s*)<div>/g, '\n');
	parsedHtml = parsedHtml.replace(/<div>/g, '\n');
	parsedHtml = parsedHtml.replace(/<\/div>/g, '');

	// Pre
	parsedHtml = parsedHtml.replace(/^`{3}(.*?)[\n\r](.*?[\n\r]?)`{3}/gms, '<pre data-language="$1">$2</pre>');
	parsedHtml = parsedHtml.replace(/^`{3}[\n\r]?(.*?)[\n\r]?`{3}/gms, '<pre>$1</pre>');
	parsedHtml = parsedHtml.replace(/[`]{3}([^`]+)[`]{3}/g, '<pre>$1</pre>');

	// Code
	parsedHtml = parsedHtml.replace(/(?!<(code|pre)[^<]*|<\/)[`]{1}([^`\n]+)[`]{1}(?![^<]*<\/(code|pre)>)/g, '<code>$2</code>');

	// Custom Emoji markdown tag
	// if (!IS_EMOJI_SUPPORTED) {
	// 	// Prepare alt text for custom emoji
	// 	parsedHtml = parsedHtml.replace(/\[<img[^>]+alt="([^"]+)"[^>]*>]/gm, '[$1]');
	// }
	parsedHtml = parsedHtml.replace(
		/(?!<(?:code|pre)[^<]*|<\/)\[([^\]\n]+)\]\(customEmoji:(\d+)\)(?![^<]*<\/(?:code|pre)>)/g,
		'<img alt="$1" data-document-id="$2">'
	);

	// Other simple markdown
	parsedHtml = parsedHtml.replace(/(?!<(code|pre)[^<]*|<\/)[*]{2}([^*\n]+)[*]{2}(?![^<]*<\/(code|pre)>)/g, '<b>$2</b>');
	parsedHtml = parsedHtml.replace(/(?!<(code|pre)[^<]*|<\/)[_]{2}([^_\n]+)[_]{2}(?![^<]*<\/(code|pre)>)/g, '<i>$2</i>');
	parsedHtml = parsedHtml.replace(/(?!<(code|pre)[^<]*|<\/)[~]{2}([^~\n]+)[~]{2}(?![^<]*<\/(code|pre)>)/g, '<s>$2</s>');
	parsedHtml = parsedHtml.replace(
		/(?!<(code|pre)[^<]*|<\/)[|]{2}([^|\n]+)[|]{2}(?![^<]*<\/(code|pre)>)/g,
		`<span data-entity-type="${ApiMessageEntityTypes.Spoiler}">$2</span>`
	);

	return parsedHtml;
}

const LINK_TEMPLATE = /(?<!<a\s+href="[^"]*">[^<]*)(https?:\/\/(?:www\.)?([a-zA-Z0-9][a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(?:\/[^#\s<]+)?)(?![^<]*<\/a>)/g;

function parseMarkdownLinks(html: string) {
	const isCodeBlock = html.startsWith('```') && html.endsWith('```');
	const isInlineCode = html.startsWith('`') && html.endsWith('`');

	if (isCodeBlock || isInlineCode) {
		return html;
	}

	return html.replace(LINK_TEMPLATE, (url) => `<a href="${url}" target="_blank">${url}</a>`);
}
function getEntityDataFromNode(node: ChildNode, rawText: string, textIndex: number): { index: number; entity?: any } {
	const type = getEntityTypeFromNode(node);

	if (!type || !node.textContent) {
		return {
			index: textIndex,
			entity: undefined
		};
	}

	const rawIndex = rawText.indexOf(node.textContent, textIndex);
	// In some cases, last text entity ends with a newline (which gets trimmed from `rawText`).
	// In this case, `rawIndex` would return `-1`, so we use `textIndex` instead.
	const index = rawIndex >= 0 ? rawIndex : textIndex;
	const offset = rawText.substring(0, index).length;
	const { length } = rawText.substring(index, index + node.textContent.length);

	if (type === ApiMessageEntityTypes.TextUrl) {
		return {
			index,
			entity: {
				type,
				offset,
				length,
				url: (node as HTMLAnchorElement).href
			}
		};
	}

	if (type === ApiMessageEntityTypes.Pre) {
		return {
			index,
			entity: {
				type,
				offset,
				length,
				language: (node as HTMLPreElement).dataset.language
			}
		};
	}

	return {
		index,
		entity: {
			type,
			offset,
			length
		}
	};
}

function getEntityTypeFromNode(node: ChildNode): ApiMessageEntityTypes | undefined {
	if (node instanceof HTMLElement && node.dataset.entityType) {
		return node.dataset.entityType as ApiMessageEntityTypes;
	}

	if (ENTITY_CLASS_BY_NODE_NAME[node.nodeName]) {
		return ENTITY_CLASS_BY_NODE_NAME[node.nodeName];
	}

	if (node.nodeName === 'A') {
		const anchor = node as HTMLAnchorElement;
		if (anchor.dataset.entityType === ApiMessageEntityTypes.Url) {
			return ApiMessageEntityTypes.Url;
		}
		if (anchor.href.startsWith('mailto:')) {
			return ApiMessageEntityTypes.Email;
		}
		if (anchor.href.startsWith('tel:')) {
			return ApiMessageEntityTypes.Phone;
		}
		if (anchor.href !== anchor.textContent) {
			return ApiMessageEntityTypes.TextUrl;
		}

		return ApiMessageEntityTypes.Url;
	}

	if (node.nodeName === 'SPAN') {
		return (node as HTMLElement).dataset.entityType as any;
	}

	return undefined;
}

const ENTITY_TYPE_TO_BACKTICK_MAP = {
	[ApiMessageEntityTypes.Code]: EBacktickType.CODE,
	[ApiMessageEntityTypes.Pre]: EBacktickType.PRE,
	[ApiMessageEntityTypes.Bold]: EBacktickType.BOLD
};

export const processMarkdownEntities = (text: string | undefined, entities: ApiMessageEntity[] | undefined): IMarkdownOnMessage[] => {
	if (!entities) return [];

	return entities
		.map((entity) => {
			if (entity.type === ApiMessageEntityTypes.Url) {
				const link = text?.substring(entity.offset, entity.offset + entity.length);
				return {
					type: link?.startsWith('https://meet.google.com/') ? EBacktickType.VOICE_LINK : EBacktickType.LINK,
					e: entity.offset + entity.length,
					s: entity.offset
				};
			}

			const backtickType = (ENTITY_TYPE_TO_BACKTICK_MAP as any)[entity.type];
			if (!backtickType) return null;

			return {
				type: backtickType,
				e: entity.offset + entity.length,
				s: entity.offset
			};
		})
		.filter(Boolean) as IMarkdownOnMessage[];
};
