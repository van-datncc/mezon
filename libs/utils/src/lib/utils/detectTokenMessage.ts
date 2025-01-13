import { EBacktickType, ILinkOnMessage, ILinkVoiceRoomOnMessage, IMarkdownOnMessage } from '../types';

export const processTripleBacktick = (input: string): IMarkdownOnMessage[] => {
	if (!input) return [];
	const backtick = '```';
	const firstStart = input.indexOf(backtick);
	const lastEnd = input.lastIndexOf(backtick);
	if (firstStart === -1 || lastEnd === -1 || firstStart === lastEnd) {
		return [];
	}
	const contentBetween = input.slice(firstStart + backtick.length, lastEnd).trim();
	if (!contentBetween) {
		return [];
	}

	return [{ s: firstStart, e: lastEnd + backtick.length, type: EBacktickType.TRIPLE }];
};
const processLinks = (inputString: string, markdowns: IMarkdownOnMessage[]) => {
	const links: ILinkOnMessage[] = [];
	const voiceRooms: ILinkVoiceRoomOnMessage[] = [];
	let i = 0;

	while (i < inputString.length) {
		if (inputString.startsWith('http://', i) || inputString.startsWith('https://', i)) {
			const startindex = i;
			i += inputString.startsWith('https://', i) ? 'https://'.length : 'http://'.length;

			// Move until the end of the link
			while (i < inputString.length && ![' ', '\n', '\r', '\t'].includes(inputString[i])) {
				i++;
			}

			const endindex = i;
			const link = inputString.substring(startindex, endindex);

			// Check if the link is within any markdown range and adjust the endindex if needed
			let adjustedEndindex = endindex; // Keep track of adjusted endindex
			const isInsideMarkdown = markdowns.some((markdown) => {
				if (markdown.s !== undefined && markdown.e !== undefined) {
					// Check if the link starts and ends within the markdown range
					if (startindex > markdown.s && endindex < markdown.e) {
						if (markdown.type === EBacktickType.SINGLE) {
							adjustedEndindex = endindex - 1; // Adjust for single backtick
						} else if (markdown.type === EBacktickType.TRIPLE) {
							adjustedEndindex = endindex - 3; // Adjust for triple backtick
						}
						return true;
					}
				}
				return false;
			});

			// Only consider the link if it is not inside a markdown block
			if (!isInsideMarkdown) {
				if (link.startsWith('https://meet.google.com/')) {
					voiceRooms.push({
						s: startindex,
						e: adjustedEndindex
					});
				} else {
					links.push({
						s: startindex,
						e: adjustedEndindex
					});
				}
			}
		} else {
			i++;
		}
	}

	return { links, voiceRooms };
};

const processSingleBacktick = (inputString: string) => {
	const singleBacktick: IMarkdownOnMessage[] = [];

	let i = 0;
	while (i < inputString.length) {
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
					singleBacktick.push({ type: EBacktickType.SINGLE, s: startindex, e: endindex });
				}
				i++;
			}
		} else {
			i++;
		}
	}

	return singleBacktick;
};

export const processText = (inputString: string) => {
	const singleBacktick = processSingleBacktick(inputString);
	const tripleBacktick = processTripleBacktick(inputString);
	const markdowns: IMarkdownOnMessage[] = [...singleBacktick, ...tripleBacktick];

	const links = processLinks(inputString, markdowns).links;
	const voiceRooms = processLinks(inputString, markdowns).voiceRooms;

	// const links = checkLinkOnBacktick(linksRaw, markdowns);
	// const voiceRooms = checkLinkOnBacktick(voiceRoomsRaw, markdowns);

	return { links, voiceRooms, markdowns };
};
