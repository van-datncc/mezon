import { embedActions } from '@mezon/store';
import { IMessageInput } from '@mezon/utils';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useDebouncedCallback } from 'use-debounce';

type MessageRatioButtonProps = {
	select: IMessageInput;
	messageId: string;
	senderId: string;
	buttonId: string;
};

export const MessageInput: React.FC<MessageRatioButtonProps> = ({ select, messageId }) => {
	const { placeholder, required, textarea, type = 'text' } = select;
	const dispatch = useDispatch();

	const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		debouncedChangeInput(e.target.value);
	};

	const debouncedChangeInput = useDebouncedCallback(async (value: string) => {
		dispatch(
			embedActions.addEmbedValueInput({
				message_id: messageId,
				data: {
					id: select.id,
					value: value
				},
				multiple: true
			})
		);
	}, 300);
	return (
		<div className="flex flex-row items-center dark:text-textPrimary text-textPrimaryLight rounded-sm text-sm text-left ">
			{textarea ? (
				<textarea
					onChange={handleChangeInput}
					placeholder={placeholder + (required ? '*' : '')}
					className={`outline-none p-4 py-2 bg-bgTertiary text-channelTextLabel rounded max-h-40`}
					required={required}
				/>
			) : (
				<input
					onChange={handleChangeInput}
					placeholder={placeholder + (required ? '*' : '')}
					type={type}
					className={`outline-none p-4 py-2 bg-bgTertiary text-channelTextLabel rounded`}
					required={required}
				/>
			)}
		</div>
	);
};
