import { useBottomSheetModal } from '@gorhom/bottom-sheet';
import { embedActions, useAppDispatch } from '@mezon/store-mobile';
import { IMessageDatePicker } from '@mezon/utils';
import moment from 'moment';
import { memo } from 'react';
import { MezonDateTimePicker } from '../../../../../../../../app/componentUI';

type EmbedInputProps = {
	input: IMessageDatePicker;
	buttonId: string;
	messageId: string;
};

export const EmbedDatePicker = memo(({ input, buttonId, messageId }: EmbedInputProps) => {
	const dispatch = useAppDispatch();
	const { dismiss } = useBottomSheetModal();

	const handleDatePicked = (value) => {
		dismiss();
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

	return <MezonDateTimePicker onChange={(value) => handleDatePicked(value)} />;
});
