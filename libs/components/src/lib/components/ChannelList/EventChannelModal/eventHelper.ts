import { format, isSameDay } from 'date-fns';
import { compareTime } from './timeFomatEvent';

export const checkError = (
	timeStart: string,
	timeEnd: string,
	startDate: Date,
	endDate: Date,
	setErrorStart: (value: boolean) => void,
	setErrorEnd: (value: boolean) => void
) => {
	const currentDate = new Date();
	const currentTime = format(currentDate, 'HH:mm');
	const compareCurrentAndStart = compareTime(currentTime, timeStart);
	const compareStartAndEnd = compareTime(timeStart, timeEnd);
	const isStartDateSameCurrentDate = isSameDay(currentDate, startDate);
	const isStartDateSameEndDate = isSameDay(startDate, endDate);

	// check error startTime
	if (isStartDateSameCurrentDate) {
		setErrorStart(!compareCurrentAndStart);
	} else {
		setErrorStart(false);
	}
	// check error startEnd
	if (!compareStartAndEnd && isStartDateSameEndDate) {
		setErrorEnd(!compareStartAndEnd);
	} else {
		setErrorEnd(false);
	}
};
