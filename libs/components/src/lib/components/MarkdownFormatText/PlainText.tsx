import { useSearchMessages } from '@mezon/core';
import { HighlightMatch } from '@mezon/ui';
import React, { useMemo } from 'react';

type PlainTextOpt = {
	text: string;
	showOnchannelLayout?: boolean;
	isSearchMessage?: boolean;
};

export const PlainText: React.FC<PlainTextOpt> = ({ text, showOnchannelLayout, isSearchMessage }) => {
	const { valueSearchMessage } = useSearchMessages();
	const valueSearchMessageSplitted = useMemo(() => {
		return valueSearchMessage?.trim()?.split(' ') || [];
	}, [valueSearchMessage]);

	return (
		<span
			className={`whitespace-pre-line ${showOnchannelLayout ? 'dark:text-white text-colorTextLightMode' : 'dark:text-[#B4BAC0] hover:dark:text-[#E6F3F5]'} text-[#4E5057] hover:text-[#060607]`}
		>
			{isSearchMessage ? HighlightMatch(text, valueSearchMessageSplitted) : text}
		</span>
	);
};
export default PlainText;
