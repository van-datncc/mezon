import { IMessageInput } from '@mezon/utils';
import { memo } from 'react';
import { MezonInput } from '../../../../../../../componentUI';

type EmbedInputProps = {
	input: IMessageInput;
	onSelectionChanged?: (value: string, id: string) => void;
};

export const EmbedInput = memo(({ input, onSelectionChanged }: EmbedInputProps) => {
	const handleChange = (text) => {
		onSelectionChanged(text, input?.id);
	};
	return <MezonInput placeHolder={input?.placeholder} onTextChange={handleChange} />;
});
