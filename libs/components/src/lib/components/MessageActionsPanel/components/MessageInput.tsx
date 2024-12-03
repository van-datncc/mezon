import { IMessageInput } from '@mezon/utils';
import React, { HTMLInputTypeAttribute } from 'react';

type MessageRatioButtonProps = {
	select: IMessageInput;
	placeholder?: string;
	type?: HTMLInputTypeAttribute;
	required?: boolean;
	textarea?: boolean;
	messageId: string;
	senderId: string;
	buttonId: string;
};

export const MessageInput: React.FC<MessageRatioButtonProps> = ({ placeholder = 'Ex. Write something', required, textarea, type = 'text' }) => {
	return (
		<div className="flex flex-row items-center dark:text-textPrimary text-textPrimaryLight rounded-sm text-sm py-2 px-4 text-left ">
			{textarea ? (
				<textarea placeholder={placeholder + (required ? '*' : '')} className={``} required={required} />
			) : (
				<input placeholder={placeholder + (required ? '*' : '')} type={type} className={``} required={required} />
			)}
		</div>
	);
};
