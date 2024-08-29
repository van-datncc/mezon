import { format } from 'date-fns';
import { useMemo } from 'react';

export function useFormatDate({ date }: { date: string | Date }) {
	const timeFormatted = useMemo(() => format(date, 'MMM dd, yyyy'), [date]);

	return useMemo(
		() => ({
			timeFormatted
		}),
		[timeFormatted]
	);
}
