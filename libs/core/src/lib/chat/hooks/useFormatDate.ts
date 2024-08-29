import { format } from 'date-fns';
import { useMemo } from 'react';

export function useFormatDate({ date }: { date: string | Date }) {
	const timeFormatted = useMemo(() => {
		if (date instanceof Date && !isNaN(date.getTime())) {
			return format(date, 'MMM dd, yyyy');
		} else return '';
	}, [date]);

	return useMemo(
		() => ({
			timeFormatted
		}),
		[timeFormatted]
	);
}
