import React from 'react';

type PlainTextOpt = {
	text: string;
	isSearchMessage?: boolean;
};

export const PlainText: React.FC<PlainTextOpt> = ({ text, isSearchMessage }) => {
	return <span>{text}</span>;
};
export default PlainText;
