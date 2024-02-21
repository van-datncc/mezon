import React, { TextareaHTMLAttributes } from 'react';

interface TextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'dangerouslySetInnerHTML'> {
	className?: string;
}

const TextArea: React.FC<TextAreaProps> = ({ className, ...rest }) => {
	return (
		<div>
			<textarea
				className={`bg-black font-[400] py-[12px] px-[14px] rounded w-full border border-gray-300 text-white outline-none ${className}`}
				{...rest}
			/>
		</div>
	);
};

export default TextArea;
