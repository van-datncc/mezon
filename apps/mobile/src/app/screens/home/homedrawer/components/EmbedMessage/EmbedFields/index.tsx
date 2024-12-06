import { useTheme } from '@mezon/mobile-ui';
import { embedActions, useAppDispatch } from '@mezon/store-mobile';
import { DatePickerComponent, EMessageComponentType, IMessageRatioOption, InputComponent, SelectComponent } from '@mezon/utils';
import debounce from 'lodash.debounce';
import { memo, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { MezonDateTimePicker } from '../../../../../../componentUI';
import { EmbedInput } from './EmbedInput';
import { EmbedRadioButton } from './EmbedRadioItem';
import { EmbedSelect } from './EmbedSelect';
import { style } from './styles';

interface Field {
	name: string;
	value: string;
	inline?: boolean;
	options?: IMessageRatioOption[];
	inputs?: SelectComponent | InputComponent | DatePickerComponent;
}

interface EmbedFieldsProps {
	message_id: string;
	fields: Field[];
}

export const EmbedFields = memo(({ message_id, fields }: EmbedFieldsProps) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const [checked, setChecked] = useState<number[]>([]);
	const dispatch = useAppDispatch();
	const groupedFields = useMemo(() => {
		return fields.reduce<Field[][]>((acc, field) => {
			if (!field.inline) {
				acc.push([field]);
			} else {
				const lastRow = acc[acc.length - 1];
				if (lastRow && lastRow[0].inline && lastRow.length < 3) {
					lastRow.push(field);
				} else {
					acc.push([field]);
				}
			}
			return acc;
		}, []);
	}, [fields]);

	const handleCheckRadioButton = (index: number, option: IMessageRatioOption) => {
		if (!option?.name) {
			setChecked([index]);
			handleRadioValue(option?.value);
			return;
		}
		if (checked.includes(index)) {
			setChecked(checked.filter((check) => check !== index));
			return;
		}
		setChecked([...checked, index]);
		handleRadioValue(option?.value);
	};

	const handleRadioValue = (value: string) => {
		dispatch(
			embedActions.addEmbedValue({
				message_id: message_id,
				data: {
					id: value,
					value: value
				}
			})
		);
	};

	const handleChangeDataInput = (value: string, id?: string) => {
		dispatch(
			embedActions.addEmbedValue({
				message_id: message_id,
				data: {
					id: id,
					value: value
				},
				multiple: true
			})
		);
	};

	const handleChangeText = debounce((text: string, id: string) => {
		handleChangeDataInput(text, id);
	}, 300);

	return (
		<View style={styles.container}>
			{!!groupedFields?.length &&
				groupedFields.map((field, index) => (
					<View key={`fieldGroup${index}`}>
						{!!field.length &&
							field.map((fieldItem, fieldIndex) => (
								<View key={`field${index}-${fieldIndex}`} style={styles.field}>
									{!!fieldItem?.name && <Text style={styles.name}>{fieldItem?.name}:</Text>}
									{!!fieldItem?.value && <Text style={styles.value}>{fieldItem?.value}</Text>}
									{!!fieldItem?.options?.length &&
										fieldItem?.options?.map((optionItem, optionIndex) => (
											<EmbedRadioButton
												key={`Embed_field_option_${optionItem}_${optionIndex}`}
												option={optionItem}
												checked={checked?.includes(optionIndex)}
												onCheck={() => handleCheckRadioButton(optionIndex, optionItem)}
											/>
										))}
									{!fieldItem?.inputs && (
										<View>
											{fieldItem?.inputs?.type === EMessageComponentType.INPUT && (
												<EmbedInput input={fieldItem?.inputs?.component} onSelectionChanged={handleChangeText} />
											)}
											{fieldItem?.inputs?.type === EMessageComponentType.SELECT && (
												<EmbedSelect options={fieldItem?.inputs?.component?.options} onSelectionChanged={handleRadioValue} />
											)}
											{fieldItem?.inputs?.type === EMessageComponentType.DATEPICKER && (
												<MezonDateTimePicker value={new Date(fieldItem?.inputs?.component?.value)} />
											)}
										</View>
									)}
								</View>
							))}
					</View>
				))}
		</View>
	);
});
