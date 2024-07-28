import { convertMarkdown, emojiRegex, linkRegex, markdownRegex } from '@mezon/utils';
import { useEffect, useState } from 'react';
import useIsWithinBackticks from './useIsWithinBackticks';

const useProcessedContent = (inputText: string) => {
	const [emojiList, setEmojiList] = useState<any>([]);
	const [linkList, setLinkList] = useState<any>([]);
	const [markdownList, setMarkdownList] = useState<any>([]);
	const isWithinBackticks = useIsWithinBackticks(inputText);

	useEffect(() => {
		const findMatches = (regex: RegExp, processor: Function, checkBackticks = true) => {
			const matches = [];
			let match;
			regex.lastIndex = 0;
			while ((match = regex.exec(inputText)) !== null) {
				if (!checkBackticks || !isWithinBackticks(match.index)) {
					matches.push(processor(match));
				}
			}
			return matches;
		};

		const emojiProcessor = (match: any) => ({
			type: 'emoji',
			shortname: match[0],
			startIndex: match.index,
			endIndex: match.index + match[0].length,
		});

		const linkProcessor = (match: any) => ({
			type: 'link',
			link: match[0],
			startIndex: match.index,
			endIndex: match.index + match[0].length,
		});

		const markdownProcessor = (match: any) => {
			const startsWithTripleBackticks = match[0].startsWith('```');
			const endsWithTripleBackticks = match[0].endsWith('```');
			const convertedMarkdown = startsWithTripleBackticks && endsWithTripleBackticks ? convertMarkdown(match[0]) : match[0];
			return {
				type: 'markdown',
				markdown: convertedMarkdown,
				startIndex: match.index,
				endIndex: match.index + match[0].length,
			};
		};

		const newEmojiList = findMatches(emojiRegex, emojiProcessor);
		const newLinkList = findMatches(linkRegex, linkProcessor);
		const newMarkdownList = findMatches(markdownRegex, markdownProcessor, false); // No backticks check for markdown

		setEmojiList(newEmojiList);
		setLinkList(newLinkList);
		setMarkdownList(newMarkdownList);
	}, [inputText]);

	return { emojiList, linkList, markdownList, inputText };
};

export default useProcessedContent;
