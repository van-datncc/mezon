import { IMessageSelectOption } from '@mezon/utils';
import { Dropdown } from 'flowbite-react';
import React, { useEffect } from 'react';

type SelectOptionsProps = {
	options: IMessageSelectOption[];
	onSelectOption: (option: IMessageSelectOption) => void;
	onSubmitSelection: () => void;
};

export const SelectOptions: React.FC<SelectOptionsProps> = ({ options, onSelectOption, onSubmitSelection }) => {
	useEffect(() => {
		return () => {
			onSubmitSelection();
		};
	}, []);

	return (
		<>
			{options.map((option) => (
				<Dropdown.Item
					key={option.value}
					onClick={() => {
						onSelectOption(option);
					}}
					className="flex flex-row items-center dark:text-textPrimary text-textPrimaryLight rounded-sm dark:hover:bg-bgModifierHover hover:bg-bgIconDark text-sm w-full py-2 px-4 text-left cursor-pointer"
				>
					<p className="uppercase dark:text-textSecondary text-textSecondary800 font-semibold">{option.label}</p>
				</Dropdown.Item>
			))}
		</>
	);
};
