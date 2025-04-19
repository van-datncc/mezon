import { Icons } from '@mezon/ui';
import { Dropdown } from 'flowbite-react';
import { useAppearance } from '../../../context/AppearanceContext';

export type SelectFieldConfig<T> = {
	label: string;
	value: string;
	onChange: (value: string) => void;
	errorMessage?: string;
	options?: any[];
};

const SelectField = <T,>({ label, options, value, onChange, errorMessage }: SelectFieldConfig<T>) => {
	const { isDarkMode } = useAppearance();

	const selectedOption = options?.find((option) => option.value === value)?.label || '-- Select --';

	return (
		<div className={`flex flex-col gap-2 p-4 ${isDarkMode ? 'bg-[#1e1f22]' : 'bg-[#f9fafb]'}`}>
			<label className={`block text-left text-sm font-medium mb-1 ${isDarkMode ? 'text-[#d1d5db]' : 'text-[#111827]'}`}>{label}</label>
			<Dropdown
				trigger="click"
				renderTrigger={() => (
					<div
						className={`w-full h-[40px] rounded-md flex flex-row px-3 justify-between items-center cursor-pointer
              ${isDarkMode ? 'bg-[#2d2f33] text-[#d1d5db]' : 'bg-white text-[#111827] border border-[#4b5563]'}`}
					>
						<p className="truncate">{selectedOption}</p>
						<Icons.ArrowDownFill />
					</div>
				)}
				label=""
				placement="bottom-end"
				className={`border-none py-[6px] px-[8px] max-h-[200px] overflow-y-scroll z-20
          ${isDarkMode ? 'bg-black thread-scroll' : 'bg-white customSmallScrollLightMode'}`}
			>
				{options?.map((option, index) => (
					<Dropdown.Item
						key={index}
						onClick={() => onChange(option.value)}
						className={`truncate ${value === option.value ? (isDarkMode ? 'bg-[#313338]' : 'bg-[#f2f3f5]') : ''}`}
					>
						{option.label}
					</Dropdown.Item>
				))}
			</Dropdown>

			{errorMessage && <span className="text-red-500 text-sm">{errorMessage}</span>}
		</div>
	);
};

export default SelectField;
