import { Icons } from '@mezon/ui';
import { IMessageSelect, IMessageSelectOption } from '@mezon/utils';
import { Dropdown } from 'flowbite-react';
import React, { useState } from 'react';
import { SelectOptions } from './SelectOptions';

type MessageSelectProps = {
	select: IMessageSelect;
};

export const MessageSelect: React.FC<MessageSelectProps> = ({ select }) => {
	const [selectedOptions, setSelectedOptions] = useState<Array<IMessageSelectOption>>([]);
	const [availableOptions, setAvailableOptions] = useState(select?.options || []);

	const handleOptionSelect = (option: { value: string; label: string }) => {
		if (selectedOptions.length < (select?.max_options || 1)) {
			setSelectedOptions((prev) => [...prev, option]);
			setAvailableOptions((prev) => prev.filter((o) => o.value !== option.value));
		}
	};

	const handleRemoveOption = (e: React.MouseEvent<HTMLButtonElement>, option: { value: string; label: string }) => {
		e.stopPropagation();

		setSelectedOptions((prev) => prev.filter((o) => o.value !== option.value));
		setAvailableOptions((prev) => {
			const updatedOptions = [...prev, option];

			return updatedOptions.sort(
				(a, b) => select.options.findIndex((opt) => opt.value === a.value) - select.options.findIndex((opt) => opt.value === b.value)
			);
		});
	};

	const handleClearSelection = () => {
		setAvailableOptions(select.options);
		setSelectedOptions([]);
	};

	const handleSubmitSelection = () => {
		handleClearSelection();
	};

	const getSelectNote = () => {
		if (select?.min_options && select?.max_options) {
			return `Select from ${select.min_options} to ${select.max_options} options`;
		}

		if (select?.max_options) {
			return `Select up to ${select.max_options} option${select.max_options > 1 ? 's' : ''}`;
		}

		if (select?.min_options) {
			return `Select at least ${select.min_options} option${select.min_options > 1 ? 's' : ''}`;
		}

		return 'Select 1 option';
	};

	return (
		<Dropdown
			dismissOnClick={false}
			label=""
			renderTrigger={() => (
				<div className="w-full max-w-[400px] h-auto rounded-md flex p-3 justify-between items-center text-sm dark:bg-bgInputDark bg-bgLightModeThird border dark:text-textPrimary text-textPrimaryLight">
					<div>
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
											onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
												handleRemoveOption(e, option);
											}}
										>
											✕
										</button>
									</div>
								))}
							</div>
						)}
						<div className="flex flex-col justify-between items-start w-full">
							<p className="dark:text-textPrimary text-textPrimary400">{select.placeholder ?? 'Select an option'}</p>
							<p className={'text-xs italic'}>{getSelectNote()}</p>
						</div>
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
