import React from 'react';

export const filterOptionReactSelect = (option: { label: JSX.Element | string; value: string }, inputValue: string) => {
	let label = '';
	if (React.isValidElement(option.label)) {
		label = (option.label as JSX.Element).props.children[1]?.toString() || '';
	} else if (typeof option.label === 'string') {
		label = option.label;
	}
	return label.toLowerCase().includes(inputValue.toLowerCase());
};
