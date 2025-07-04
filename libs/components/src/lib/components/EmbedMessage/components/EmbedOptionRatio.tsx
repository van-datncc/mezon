import { embedActions } from '@mezon/store';
import { IMessageRatioOption } from '@mezon/utils';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { MessageRatioButton } from '../../MessageActionsPanel/components/MessageRatio';
import { EmbedDescription } from './EmbedDescription';
import { EmbedTitle } from './EmbedTitle';

interface EmbedOptionRatioProps {
	options: IMessageRatioOption[];
	message_id: string;
	idRadio: string;
	max_options?: number;
	disabled?: boolean;
}

export function EmbedOptionRatio({ options, message_id, idRadio, max_options }: EmbedOptionRatioProps) {
	const [checked, setChecked] = useState<number[]>([]);
	const handleCheckedOption = (index: number) => {
		if (!options[index].name) {
			setChecked([index]);
			handleAddEmbedRadioValue(index);
			return;
		}
		if (checked.includes(index)) {
			setChecked(checked.filter((check) => check !== index));
			handleAddEmbedRadioValue(index);
			return;
		}

		if (!max_options || checked.length < max_options) {
			setChecked([...checked, index]);
			handleAddEmbedRadioValue(index);
		}
	};

	const dispatch = useDispatch();

	const checkMultiple = useMemo(() => {
		if (options.length > 1 && options[0].name) {
			return options[0].name === options[1].name;
		}
		return true;
	}, [options]);

	const handleAddEmbedRadioValue = useCallback(
		(index: number) => {
			dispatch(
				embedActions.addEmbedValue({
					message_id: message_id,
					data: {
						id: idRadio,
						value: options[index].value
					},
					multiple: true,
					onlyChooseOne: checkMultiple
				})
			);
		},
		[checkMultiple]
	);
	return (
		<>
			{options &&
				options.map((option, index) => (
					<div className="flex justify-between items-center gap-4" key={option.value + message_id}>
						<div className="flex flex-col">
							<EmbedTitle title={option.label} />
							<EmbedDescription description={option.description || ''} />
						</div>
						<MessageRatioButton
							name={option.name ? option.name + message_id : 'ratio_button' + message_id}
							onCheckRatio={() => handleCheckedOption(index)}
							checked={checked.includes(index)}
							color={option.style}
							disabled={option.disabled}
						/>
					</div>
				))}
		</>
	);
}
