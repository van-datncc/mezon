import { embedActions } from '@mezon/store';
import { IMessageRatioOption } from '@mezon/utils';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { MessageRatioButton } from '../../MessageActionsPanel/components/MessageRatio';
import { EmbedDescription } from './EmbedDescription';
import { EmbedTitle } from './EmbedTitle';

interface EmbedOptionRatioProps {
	options: IMessageRatioOption[];
	message_id: string;
}

export function EmbedOptionRatio({ options, message_id }: EmbedOptionRatioProps) {
	const [checked, setChecked] = useState<number[]>([]);
	const handleCheckedOption = (index: number) => {
		if (!options[index].name) {
			setChecked([index]);
			handleAddEmbedRadioValue();
			return;
		}
		if (checked.includes(index)) {
			setChecked(checked.filter((check) => check !== index));
			return;
		}
		setChecked([...checked, index]);
		handleAddEmbedRadioValue();
	};

	const dispatch = useDispatch();

	const handleAddEmbedRadioValue = () => {
		dispatch(
			embedActions.addEmbedValueInput({
				message_id: message_id,
				data: {
					id: 'This is id',
					value: 'This is value for testing'
				}
			})
		);
	};
	return (
		<>
			{options &&
				options.map((option, index) => (
					<div className="flex justify-between">
						<div className="flex flex-col">
							<EmbedTitle title={option.label} />
							<EmbedDescription description={option.description || ''} />
						</div>
						<MessageRatioButton
							name={option.name ? option.name : 'ratio_button'}
							onCheckRatio={() => handleCheckedOption(index)}
							checked={checked.includes(index)}
							color={option.style}
						/>
					</div>
				))}
		</>
	);
}
