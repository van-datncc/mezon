import { useSearchMessages } from '@mezon/core';
import { HighlightMatch } from '@mezon/ui';
import React, { useMemo } from 'react';

type PlainTextOpt = {
	text: string;
	isSearchMessage?: boolean;
	isEditted: boolean;
};

export const PlainText: React.FC<PlainTextOpt> = ({ text, isSearchMessage, isEditted }) => {
	const { valueSearchMessage } = useSearchMessages();
	const valueSearchMessageSplitted = useMemo(() => {
		return valueSearchMessage?.trim()?.split(' ') || [];
	}, [valueSearchMessage]);

	return (
		<span>
			{isSearchMessage ? HighlightMatch(text, valueSearchMessageSplitted) : text}
			{isEditted && (
				<p className="ml-[5px] inline opacity-50 text-[9px] self-center font-semibold dark:text-textDarkTheme text-textLightTheme w-[50px]">
					(edited)
				</p>
			)}
		</span>
	);
};
export default PlainText;
