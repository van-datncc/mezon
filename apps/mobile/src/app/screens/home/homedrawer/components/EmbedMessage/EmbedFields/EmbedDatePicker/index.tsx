import { useBottomSheetModal } from '@gorhom/bottom-sheet';
import { size, useTheme } from '@mezon/mobile-ui';
import { embedActions, useAppDispatch } from '@mezon/store-mobile';
import { IMessageDatePicker } from '@mezon/utils';
import moment from 'moment';
import { memo, useEffect, useState } from 'react';
import { MezonDateTimePicker } from '../../../../../../../../app/componentUI';

type EmbedInputProps = {
	input: IMessageDatePicker;
	buttonId: string;
	messageId: string;
};

export const EmbedDatePicker = memo(({ input, buttonId, messageId }: EmbedInputProps) => {
	const { themeValue } = useTheme();
	const dispatch = useAppDispatch();
	const { dismiss } = useBottomSheetModal();
	const [date, setDate] = useState<Date>();

	useEffect(() => {
		handleDatePicked(new Date());
	}, []);

	const handleDatePicked = (value: Date) => {
		dismiss();
		setDate(value);
		const formattedDate = moment(value).format('YYYY-MM-DD');
		dispatch(
			embedActions.addEmbedValue({
				message_id: messageId,
				data: {
					id: buttonId,
					value: formattedDate
				}
			})
		);
	};

	return (
		<MezonDateTimePicker
			value={date}
			onChange={(value) => handleDatePicked(value)}
			containerStyle={{ borderWidth: 1, borderColor: themeValue.border, borderRadius: size.s_12, paddingVertical: size.s_12 }}
		/>
	);
});
