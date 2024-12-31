import { ERepeatType } from '@mezon/utils';
import { format } from 'date-fns';
import { compareTime } from './timeFomatEvent';

export const checkError = (
	timeStart: string,
	timeEnd: string,
	frequencyValue: ERepeatType,
	selectedDateStart: Date,
	setErrorStart: (value: boolean) => void,
	setErrorEnd: (value: boolean) => void
) => {
	const formatDate = format(selectedDateStart, 'yyyyMMdd');
	const today = format(Date.now(), 'yyyyMMdd');
	const currentTime = format(new Date(), 'HH:mm');

	if (
		(Number(formatDate) === Number(today) && frequencyValue === ERepeatType.DOES_NOT_REPEAT) ||
		(Number(formatDate) === Number(today) && frequencyValue === ERepeatType.DEFAULT)
	) {
		setErrorStart(!compareTime(currentTime, timeStart, true));
	} else {
		setErrorStart(false);
	}

	const isSameDay = Number(formatDate) === Number(today);
	if (isSameDay && !compareTime(timeStart, timeEnd)) {
		setErrorEnd(true);
	} else {
		setErrorEnd(false);
	}
};
