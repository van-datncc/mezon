import { selectAllThreads } from '@mezon/store';
import { useSelector } from 'react-redux';

export function useThreads() {
	const threads = useSelector(selectAllThreads);

	return {
		threads,
	};
}
