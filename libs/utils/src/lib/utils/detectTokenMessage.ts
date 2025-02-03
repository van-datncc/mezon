import {
	EBacktickType,
	IEmojiOnMessage,
	IHashtagOnMessage,
	ILinkOnMessage,
	ILinkVoiceRoomOnMessage,
	IMarkdownOnMessage,
	IMentionOnMessage,
	IMessageSendPayload,
	INewPosMarkdown
} from '../types';
import { parseHtmlAsFormattedText, processMarkdownEntities } from './parseHtmlAsFormattedText';
export const processSingleBacktick = (inputString: string, excludeRange: { start: number; end: number }) => {
	const result: IMarkdownOnMessage[] = [];
	let i = 0;

	while (i < inputString.length) {
		if (i >= excludeRange.start && i < excludeRange.end) {
			i = excludeRange.end;
			continue;
		}

		if (inputString[i] === '`') {
			const startindex = i;
			i++;
			let markdown = '';
			while (i < inputString.length && inputString[i] !== '`') {
				markdown += inputString[i];
				i++;
			}
			if (i < inputString.length && inputString[i] === '`') {
				const endindex = i + 1;
				const nextChar = inputString[endindex];
				if (!markdown.includes('``') && markdown.trim().length > 0 && nextChar !== '`') {
					result.push({ type: EBacktickType.SINGLE, s: startindex, e: endindex });
				}
				i++;
			}
		} else {
			i++;
		}
	}

	return result;
};

export const processBacktick = (input: string): { tripleBackticks: IMarkdownOnMessage[]; singleBackticks: IMarkdownOnMessage[] } => {
	if (!input) return { tripleBackticks: [], singleBackticks: [] };
	const backtick = '```';
	const singleBacktick = '`';
	const firstStart = input.indexOf(backtick);
	const lastEnd = input.lastIndexOf(backtick);

	const tripleBackticks: IMarkdownOnMessage[] = [];
	const singleBackticks: IMarkdownOnMessage[] = [];

	const singleStart = input.indexOf(singleBacktick);
	const singleEnd = input.lastIndexOf(singleBacktick);

	if (singleStart !== -1 && singleEnd !== -1 && singleStart < firstStart && lastEnd + backtick.length < singleEnd) {
		singleBackticks.push({ s: singleStart, e: singleEnd + 1, type: EBacktickType.SINGLE });
	} else if (firstStart !== -1 && lastEnd !== -1 && firstStart !== lastEnd) {
		const contentBetween = input.slice(firstStart + backtick.length, lastEnd).trim();
		if (contentBetween) {
			tripleBackticks.push({ s: firstStart, e: lastEnd + backtick.length, type: EBacktickType.TRIPLE });
		}
		const singles = processSingleBacktick(input, { start: firstStart, end: lastEnd + backtick.length });
		singleBackticks.push(...singles);
	} else {
		const singles = processSingleBacktick(input, { start: 0, end: 0 });
		singleBackticks.push(...singles);
	}

	return { tripleBackticks, singleBackticks };
};

const processLinks = (inputString: string, markdowns: IMarkdownOnMessage[]) => {
	const links: ILinkOnMessage[] = [];
	const voiceRooms: ILinkVoiceRoomOnMessage[] = [];

	const isOutsideMarkdown = (start: number, end: number): boolean => {
		return !markdowns.some((markdown) => {
			if (markdown.s !== undefined && markdown.e !== undefined) {
				return start >= markdown.s && end <= markdown.e;
			}
			return false;
		});
	};

	let i = 0;

	while (i < inputString.length) {
		if (inputString.startsWith('http://', i) || inputString.startsWith('https://', i)) {
			const startindex = i;
			i += inputString.startsWith('https://', i) ? 'https://'.length : 'http://'.length;

			while (i < inputString.length && ![' ', '\n', '\r', '\t'].includes(inputString[i])) {
				i++;
			}

			const endindex = i;
			const link = inputString.substring(startindex, endindex);
			if (isOutsideMarkdown(startindex, endindex)) {
				if (link.startsWith('https://meet.google.com/')) {
					voiceRooms.push({
						s: startindex,
						e: endindex
					});
				} else {
					links.push({
						s: startindex,
						e: endindex
					});
				}
			}
		} else {
			i++;
		}
	}
	return { links, voiceRooms };
};

export const processText = (inputString: string) => {
	if (!inputString) return { links: [], voiceRooms: [], markdowns: [] };

	const { tripleBackticks, singleBackticks } = processBacktick(inputString);
	const markdowns: IMarkdownOnMessage[] = [...singleBackticks, ...tripleBackticks];
	const { links, voiceRooms } = processLinks(inputString, markdowns);

	return { links, voiceRooms, markdowns };
};
///////////////////////////////
export const prepareProcessedContent = (processedContentDraft: IMessageSendPayload) => {
	const { text, entities } = parseHtmlAsFormattedText(processedContentDraft.t ?? '');
	const mk: IMarkdownOnMessage[] = processMarkdownEntities(text, entities);

	return {
		...processedContentDraft,
		t: text,
		mk
	};
};
// to get markdown will be add prefix include: code/pre/boldtext
export const getMarkdownPrefixItems = (draftContent: IMarkdownOnMessage[]) => {
	return (
		draftContent
			?.filter((item) => item.type === EBacktickType.PRE || item.type === EBacktickType.CODE || item.type === EBacktickType.BOLD)
			.sort((a, b) => (a.s ?? 0) - (b.s ?? 0)) ?? []
	);
};

// to add `/``` or ** to token markdown
export const addMarkdownPrefix = (markdownItems: IMarkdownOnMessage[], plaintext: string): INewPosMarkdown[] => {
	return markdownItems.map(({ type, s, e }) => {
		let value = plaintext?.slice(s, e);
		let markerNumber = 0;

		switch (type) {
			case EBacktickType.CODE: // Inline code
				value = `\`${value}\``;
				markerNumber = 2;
				break;
			case EBacktickType.PRE: // Code block
				value = `\`\`\`${value}\`\`\``;
				markerNumber = 6;
				break;
			case EBacktickType.BOLD: // Bold text
				value = `**${value}**`;
				markerNumber = 4;
				break;
		}

		return { type, value, s, e, markerNumber };
	});
};
// to calculator new position of token markdown after added frefix
export const updateMarkdownPositions = (prefixItems: INewPosMarkdown[]) => {
	let previousNe = 0;
	let accumulatedMarker = 0;

	return prefixItems.map((item, index) => {
		let ns, ne;

		if (index === 0) {
			ns = item.s ?? 0;
			ne = (item.e ?? 0) + (item.markerNumber ?? 0);
		} else {
			ns = previousNe + ((item.s ?? 0) - (prefixItems[index - 1].e ?? 0));
			ne = ns + ((item.e ?? 0) - (item.s ?? 0)) + (item.markerNumber ?? 0);
		}

		accumulatedMarker += item.markerNumber ?? 0;
		previousNe = ne;

		return { ...item, ns, ne, accumulatedMarkerTotal: accumulatedMarker };
	});
};

// get the new plaintext with token added prefix
export const generateNewPlaintext = (updatedItems: INewPosMarkdown[], plaintext: string) => {
	let newPlaintext = '';
	let lastIndex: number | undefined = 0;
	updatedItems?.forEach(({ value, s, e }) => {
		newPlaintext += plaintext && plaintext?.slice(lastIndex, s) + value;
		lastIndex = e;
	});

	newPlaintext += plaintext?.slice(lastIndex);

	return newPlaintext;
};
// reduce position of token when remove the prefix
export const adjustTokenPositions = (tokens: IMentionOnMessage[] | IHashtagOnMessage[] | IEmojiOnMessage[], markers: INewPosMarkdown[]) => {
	//filter to get tokens outside markdown
	const filteredTokens = tokens.filter(
		(token) => !markers.some((marker) => (token.s ?? 0) >= (marker.ns ?? 0) && (token.e ?? 0) <= (marker.ne ?? 0))
	);

	const combined = [...filteredTokens, ...markers].sort((a, b) => (a.s ?? 0) - (b.s ?? 0));
	let lastAccumulated = 0;
	return combined.map((item) => {
		if ('markerNumber' in item) {
			lastAccumulated = item.accumulatedMarkerTotal ?? lastAccumulated;
			return item;
		} else {
			const adjustedS = (item.s ?? 0) - lastAccumulated;
			const adjustedE = (item.e ?? 0) - lastAccumulated;

			return {
				...item,
				s: adjustedS,
				e: adjustedE
			};
		}
	});
};
