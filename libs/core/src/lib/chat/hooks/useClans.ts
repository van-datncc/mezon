import { selectAllClans, selectCurrentClan } from '@mezon/store';
import { useSelector } from 'react-redux';

export function useClans() {
	const clans = useSelector(selectAllClans);
	const currentClan = useSelector(selectCurrentClan);
	return {
		clans,
		currentClan,
	};
}
