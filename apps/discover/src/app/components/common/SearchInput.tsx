import React, { useRef } from 'react';

interface SearchInputProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	className?: string;
	onClear?: () => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, placeholder = 'Search...', className = '', onClear }) => {
	const inputRef = useRef<HTMLInputElement>(null);

	const handleClear = () => {
		onChange('');
		onClear?.();
		inputRef.current?.focus();
	};

	return (
		<div className={`relative ${className}`}>
			<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
				<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
				</svg>
			</div>

			<input
				ref={inputRef}
				type="text"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[${COLORS.PRIMARY}] focus:border-[${COLORS.PRIMARY}]"
			/>

			{value && (
				<button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={handleClear}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-5 w-5 text-gray-400 hover:text-gray-600"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			)}
		</div>
	);
};

export default SearchInput;
