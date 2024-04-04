interface ThreadNameTextFieldProps {
	threadNameProps: string;
	onChange: (value: string) => void;
	onKeyDown: (key: string) => void;
	error: string;
}

const ThreadNameTextField = ({ threadNameProps, error, onChange, onKeyDown }: ThreadNameTextFieldProps) => {
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		onChange(value);
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		onKeyDown(event.key);
	};

	return (
		<div className="flex flex-col mt-4">
			<span className="text-xs font-semibold uppercase mb-2">{threadNameProps}</span>
			<input
				onChange={handleInputChange}
				type="text"
				placeholder="New Thread"
				className="h-10 p-[10px] bg-black text-base rounded placeholder:text-sm"
				onKeyDown={handleKeyDown}
			/>
			{error && <span className="text-xs text-[#B91C1C] mt-1 ml-1">{error}</span>}
		</div>
	);
};

export default ThreadNameTextField;
