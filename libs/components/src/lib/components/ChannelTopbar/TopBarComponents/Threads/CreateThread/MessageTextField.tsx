type MessageTextFieldProps = {
	onChange: (value: string) => void;
};

const MessageTextField = ({ onChange }: MessageTextFieldProps) => {
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		onChange(value);
	};
	return (
		<div className="mb-6">
			<input
				type="text"
				onChange={handleInputChange}
				className="w-full h-10 p-[10px] bg-[#26262B] text-base rounded placeholder:text-sm"
				placeholder="Enter a message to start the conversation!"
			/>
		</div>
	);
};

export default MessageTextField;
