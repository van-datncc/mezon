import { ILinkOnMessage, IMarkdownOnMessage } from '@mezon/utils';
import { useEffect, useState } from 'react';

const useProcessedContent = (inputText: string) => {
	const [emojiList, setEmojiList] = useState<any>([]);
	const [linkList, setLinkList] = useState<any>([]);
	const [markdownList, setMarkdownList] = useState<any>([]);

	useEffect(() => {
		const processInput = () => {
			setEmojiList(checkAfterMarker(inputText, findColons(inputText)));
			setLinkList(checkAfterMarker(inputText, findLinks(inputText)));
			setMarkdownList(checkAfterMarker(inputText, findBackticks(inputText)));
		};

		processInput();
	}, [inputText]);
	return { emojiList, linkList, markdownList, inputText };
};

export default useProcessedContent;

const findLinks = (inputString: string): ILinkOnMessage[] => {
	const result: ILinkOnMessage[] = [];
	const httpPrefix = 'http';
	const minLength = httpPrefix.length;

	let i = 0;

	while (i < inputString.length) {
		if (inputString.startsWith(httpPrefix, i)) {
			const startIndex = i;
			i += minLength;

			// Find the end of the link
			while (i < inputString.length && ![' ', '\n', '\r', '\t'].includes(inputString[i])) {
				i++;
			}

			const endIndex = i;

			// Ensure the link is not preceded or followed by a colon or backtick
			if (
				(startIndex === 0 || ![':', '`'].includes(inputString[startIndex - 1])) &&
				(endIndex === inputString.length || ![':', '`'].includes(inputString[endIndex]))
			) {
				result.push({
					link: inputString.substring(startIndex, endIndex),
					startIndex,
					endIndex,
				});
			}
		} else {
			i++;
		}
	}
	return result;
};

const findColons = (inputString: string) => {
	const result = [];
	let i = 0;

	while (i < inputString.length) {
		if (inputString[i] === ':') {
			const startIndex = i;
			i++;
			let shortname = '';

			while (i < inputString.length && inputString[i] !== ':') {
				shortname += inputString[i];
				i++;
			}

			if (i < inputString.length && inputString[i] === ':') {
				const endIndex = i + 1;
				result.push({
					shortname: `:${shortname}:`,
					startIndex: startIndex,
					endIndex: endIndex,
				});
				i++;
			}
		} else {
			i++;
		}
	}

	return result;
};

const findBackticks = (inputString: string) => {
	const singleBacktick = '`';
	const tripleBacktick = '```';

	const classifyBackticks = (expr: string) => {
		const sections: IMarkdownOnMessage[] = [];

		const isTripleBacktick = (str: string, index: number) => {
			return str.substring(index, index + tripleBacktick.length) === tripleBacktick;
		};

		const isSingleBacktick = (str: string, index: number) => {
			return str[index] === singleBacktick;
		};

		const containsDoubleBackticks = (str: string) => {
			return str.includes('``');
		};

		let i = 0;
		while (i < expr.length) {
			if (isTripleBacktick(expr, i)) {
				const startIndex = i;
				i += tripleBacktick.length;
				let markdown = '';

				while (i < expr.length && !isTripleBacktick(expr, i)) {
					markdown += expr[i];
					i++;
				}

				if (i < expr.length && isTripleBacktick(expr, i)) {
					i += tripleBacktick.length;
					const endIndex = i;
					sections.push({ type: 'triple', markdown: `\`\`\`${markdown}\`\`\``, startIndex, endIndex });
				}
			} else if (isSingleBacktick(expr, i)) {
				const startIndex = i;
				let markdown = '';
				i++;

				while (i < expr.length && !isSingleBacktick(expr, i)) {
					markdown += expr[i];
					i++;
				}

				if (i < expr.length) {
					i++;
					const endIndex = i;
					if (!containsDoubleBackticks(markdown) && markdown !== '') {
						sections.push({ type: 'single', markdown: `\`${markdown}\``, startIndex, endIndex });
					}
				}
			} else {
				i++;
			}
		}

		return sections;
	};

	return classifyBackticks(inputString);
};

const checkAfterMarker = (inputText: string, sections: any) => {
	const validSections = [];

	for (const section of sections) {
		const { endIndex } = section;
		const nextChar = inputText[endIndex ?? -1];

		// Check if the next character is not a backtick
		if (nextChar !== '`') {
			validSections.push(section);
		}
	}

	return validSections;
};
