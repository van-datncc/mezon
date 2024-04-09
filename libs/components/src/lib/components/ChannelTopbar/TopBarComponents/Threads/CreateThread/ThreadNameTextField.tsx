interface ThreadNameTextFieldProps {
	threadNameProps?: string;
	placeholder?: string;
	value: string;
	onChange: (value: string) => void;
	onKeyDown: (key: string) => void;
	error?: string;
	className?: string;
}

const ThreadNameTextField = ({ threadNameProps, error, placeholder, value, className, onChange, onKeyDown }: ThreadNameTextFieldProps) => {
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		onChange(value);
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		onKeyDown(event.key);
	};

	return (
		<div className="flex flex-col mt-4 mb-4 px-4">
			<span className="text-xs font-semibold uppercase mb-2">{threadNameProps}</span>
			<input value={value} onChange={handleInputChange} type="text" placeholder={placeholder} className={className} onKeyDown={handleKeyDown} />
			{error && <span className="text-xs text-[#B91C1C] mt-1 ml-1">{error}</span>}
		</div>
	);
};

export default ThreadNameTextField;
