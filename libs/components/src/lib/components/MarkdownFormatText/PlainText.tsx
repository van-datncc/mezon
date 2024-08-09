import { normalizeString } from '@mezon/utils';
import React from 'react';

type PlainTextOpt = {
	text: string;
	showOnchannelLayout?: boolean;
	valueSearchMessage?: string[];
};

export const PlainText: React.FC<PlainTextOpt> = ({ text, showOnchannelLayout, valueSearchMessage }) => {
	return (
		<span
			className={`whitespace-pre-line ${showOnchannelLayout ? 'dark:text-white text-colorTextLightMode' : 'dark:text-[#B4BAC0] hover:dark:text-[#E6F3F5]'} text-[#4E5057] hover:text-[#060607]`}
		>
			{HighlightMatch(text, valueSearchMessage ?? [])}
		</span>
	);
};
export default PlainText;

const HighlightMatch = (content: string, valueSearch: string[]) => {
	const normalizedSearchTerms = valueSearch.map((term) => normalizeString(term));
	console.log('normalizedSearchTerms: ', normalizedSearchTerms);
	const normalizedItemName = normalizeString(content);
	console.log('normalizedItemName: ', normalizedItemName);

	if (normalizedSearchTerms.length === 0) return content;

	let parts: (string | JSX.Element)[] = [];
	let startIndex = 0;

	const addPart = (textBeforeMatch: string, highlightedText: string, key: number) => {
		if (textBeforeMatch) {
			parts.push(textBeforeMatch);
		}
		parts.push(
			<span className="font-bold bg-red-300" key={key}>
				{highlightedText}
			</span>,
		);
	};

	console.log('addPart: ', addPart);
	const findAndHighlight = (term: string) => {
		let index = normalizedItemName.indexOf(term);

		while (index !== -1) {
			// Add text before the match
			const beforeMatch = content.slice(startIndex, index);
			addPart(beforeMatch, content.slice(index, index + term.length), index);

			// Move the start index to the end of the current match
			startIndex = index + term.length;
			index = normalizedItemName.indexOf(term, startIndex);
		}
	};

	// Find and highlight each search term
	for (const term of normalizedSearchTerms) {
		findAndHighlight(term);
	}

	// Add any remaining text after the last match
	if (startIndex < content.length) {
		parts.push(content.slice(startIndex));
	}

	// If no match is found, return the original content as a single part
	if (parts.length === 0) {
		parts.push(content);
	}

	return <>{parts}</>;
};
