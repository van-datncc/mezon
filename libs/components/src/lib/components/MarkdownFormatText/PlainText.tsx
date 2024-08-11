import { useSearchMessages } from '@mezon/core';
import { HighlightMatch } from '@mezon/ui';
import React, { useMemo } from 'react';

type PlainTextOpt = {
	text: string;
	showOnchannelLayout?: boolean;
	isSearchMessage?: boolean;
	isSingleLine: boolean;
	isJumMessageEnabled: boolean;
};

export const PlainText: React.FC<PlainTextOpt> = ({ text, isSearchMessage, isJumMessageEnabled, isSingleLine }) => {
	const { valueSearchMessage } = useSearchMessages();
	const valueSearchMessageSplitted = useMemo(() => {
		return valueSearchMessage?.trim()?.split(' ') || [];
	}, [valueSearchMessage]);

	return (
		<span
			style={
				isSingleLine
					? {
							whiteSpace: 'nowrap',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
						}
					: undefined
			}
			className={`whitespace-pre-line ${!isJumMessageEnabled ? 'dark:text-white ' : 'dark:text-[#B4BAC0] hover:dark:text-[#E6F3F5] hover:text-[#060607]'} text-[#4E5057] `}
		>
			{isSearchMessage ? HighlightMatch(text, valueSearchMessageSplitted) : text}
		</span>
	);
};
export default PlainText;
