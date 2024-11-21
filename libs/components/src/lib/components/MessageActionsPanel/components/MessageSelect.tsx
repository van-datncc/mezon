import { Icons } from '@mezon/ui';
import { IMessageSelect } from '@mezon/utils';
import { Dropdown } from 'flowbite-react';
import React, { useState } from 'react';
import { SelectOptions } from './SelectOptions';

type MessageSelectProps = {
	select: IMessageSelect;
};

export const MessageSelect: React.FC<MessageSelectProps> = ({ select }) => {
	const [selectedOptions, setSelectedOptions] = useState<Array<{ value: string; label: string }>>([]);
	const [availableOptions, setAvailableOptions] = useState(select?.options || []);

	const handleOptionSelect = (option: { value: string; label: string }) => {
		if (selectedOptions.length < (select?.max_options || 1)) {
			setSelectedOptions((prev) => [...prev, option]);
			setAvailableOptions((prev) => prev.filter((o) => o.value !== option.value));
		}
	};

	const handleRemoveOption = (option: { value: string; label: string }) => {
		setSelectedOptions((prev) => prev.filter((o) => o.value !== option.value));
		setAvailableOptions((prev) => {
			const updatedOptions = [...prev, option];

			return updatedOptions.sort(
				(a, b) => select.options.findIndex((opt) => opt.value === a.value) - select.options.findIndex((opt) => opt.value === b.value)
			);
		});
	};

	//
	const handleSubmitSelection = () => {
		// do something
	};

	return (
		<Dropdown
			dismissOnClick={false}
			label=""
			renderTrigger={() => (
				<div className="w-full max-w-[200px] h-auto rounded-md flex flex-col p-3 justify-start items-start text-sm dark:bg-bgInputDark bg-bgLightModeThird border dark:text-textPrimary text-textPrimaryLight">
					{selectedOptions.length > 0 && (
						<div className="flex flex-wrap gap-2 mb-2">
							{selectedOptions.map((option) => (
								<div
									key={option.value}
									className="flex items-center px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-md text-xs dark:text-textPrimary text-textPrimaryLight"
								>
									<span>{option.label}</span>
									<button
										className="ml-2 text-red-500 hover:text-red-700"
										onClick={() => {
											handleRemoveOption(option);
										}}
									>
										✕
									</button>
								</div>
							))}
						</div>
					)}
					<div className="flex justify-between items-center w-full">
						<p className="dark:text-textPrimary text-textPrimary400">{select.placeholder ?? 'Select an option'}</p>
					</div>
					<Icons.ArrowDownFill />
				</div>
			)}
			className="h-fit max-h-[200px] text-xs overflow-y-scroll customSmallScrollLightMode dark:bg-bgTertiary px-2 z-20"
		>
			<SelectOptions options={availableOptions} onSelectOption={handleOptionSelect} onSubmitSelection={handleSubmitSelection} />
		</Dropdown>
	);
};
