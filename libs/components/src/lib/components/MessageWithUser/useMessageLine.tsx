import { IMessageLine } from '@mezon/utils';
import { useMemo } from 'react';

export function useMessageLine(line: string): IMessageLine {

	const combinedRegex = /(?<!`)((?<=\s|^)(@)\S+(?=\s|$)|<#[^>`\s]+>|:[a-zA-Z0-9_]*:)(?!`)/g;

	const emojiRegex = /^:\b[a-zA-Z0-9]*\b:$/;

	const isOnlyEmoji = useMemo(() => {
		if (!line?.trim()) {
			return false;
		}

		return emojiRegex.test(line);
	}, [line]);

	const matches = useMemo(() => {
		if (line) {
			return line.match(combinedRegex) || [];
		} else {
			return [];
		}
	}, [line]);

	const mentions = useMemo(() => {
		// Check if the line is within ``` or `
		const trimmedLine = line.trim();
		if ((trimmedLine.startsWith('```') && trimmedLine.endsWith('```')) || 
			(trimmedLine.startsWith('`') && trimmedLine.endsWith('`'))) {
			return [
				{
					nonMatchText: line,
					matchedText: '',
					startIndex: 0,
					endIndex: line.length,
				},
			];
		}

		let lastIndex = 0;
		let nonMatchText = line;

		const mentions = matches.map((match, i) => {
			const startIndex = line.indexOf(match, lastIndex);
			const endIndex = startIndex + match.length;
			const matchedText = line.substring(startIndex, endIndex);
			nonMatchText = line.substring(lastIndex, startIndex);
			lastIndex = endIndex;
			return {
				nonMatchText,
				matchedText,
				startIndex,
				endIndex,
			};
		});
		if (mentions.length === 0) {
			// no matches
			return [
				{
					nonMatchText: nonMatchText,
					matchedText: '',
					startIndex: 0,
					endIndex: 0,
				},
			];
		}
		if (lastIndex < line.length) {
			mentions.push({
				nonMatchText: line.substring(lastIndex),
				matchedText: '',
				startIndex: lastIndex,
				endIndex: line.length,
			});
		}
		return mentions;
	}, [line, matches]);

	return {
		mentions,
		isOnlyEmoji,
	};
}
