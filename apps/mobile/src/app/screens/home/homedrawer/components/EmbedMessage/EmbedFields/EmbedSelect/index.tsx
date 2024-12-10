import { IMessageSelectOption } from '@mezon/utils';
import { memo } from 'react';
import { MezonSelect } from '../../../../../../../componentUI';

type EmbedSelectProps = {
	options: IMessageSelectOption[];
	onSelectionChanged: (value: number | string) => void;
};

export const EmbedSelect = memo(({ options, onSelectionChanged }: EmbedSelectProps) => {
	return (
		<MezonSelect
			data={options?.map((item) => {
				return { title: item?.label, value: item?.value };
			})}
			onChange={onSelectionChanged}
		/>
	);
});
