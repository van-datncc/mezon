import { useAppearance } from '../../../context/AppearanceContext';

type TextFieldProps = {
	label: string;
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	errorMessage?: string;
};

const TextField = ({ label, value, onChange, placeholder, errorMessage }: TextFieldProps) => {
	const { isDarkMode } = useAppearance();

	return (
		<div className={`px-4 p-4 rounded ${isDarkMode ? 'bg-[#1e1f22]' : 'bg-[#f9fafb]'}`}>
			<label className={`block text-left text-sm font-medium mb-1 ${isDarkMode ? 'text-[#d1d5db]' : 'text-[#111827]'}`}>{label}</label>

			<input
				type="text"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				className={`w-full rounded border p-1 my-1 px-3 py-2 focus:ring-2 focus:outline-none transition
          ${errorMessage ? 'border-red-500' : isDarkMode ? 'border-[#4b5563]' : 'border-[#d1d5db]'}
          ${isDarkMode ? 'bg-[#2d2f33] text-[#d1d5db] placeholder-[#6b7280]' : 'bg-white text-[#111827] placeholder-[#9ca3af]'}
          focus:ring-[#5865F2]`}
			/>

			{errorMessage && <p className="text-xs text-red-500 mt-1">{errorMessage}</p>}
		</div>
	);
};

export default TextField;
