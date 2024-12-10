import { size } from '@mezon/mobile-ui';
import { IMessageInput } from '@mezon/utils';
import { memo, useEffect } from 'react';
import { MezonInput } from '../../../../../../../componentUI';

type EmbedInputProps = {
	input: IMessageInput;
	buttonId: string;
	onSelectionChanged?: (value: string, id: string) => void;
};

export const EmbedInput = memo(({ input, buttonId, onSelectionChanged }: EmbedInputProps) => {
	useEffect(() => {
		onSelectionChanged(input?.defaultValue, buttonId);
	}, []);

	const handleChange = (text: string) => {
		onSelectionChanged(text, buttonId);
	};
	return (
		<MezonInput
			inputWrapperStyle={{ height: input?.textarea && size.s_80 }}
			placeHolder={input?.placeholder}
			onTextChange={handleChange}
			textarea={input?.textarea}
			defaultValue={input?.defaultValue}
		/>
	);
});
