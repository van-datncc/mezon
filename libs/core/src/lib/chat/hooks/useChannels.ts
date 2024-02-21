import { selectAllChannels } from '@mezon/store';
import { useSelector } from 'react-redux';

export function useChannels() {
	const channels = useSelector(selectAllChannels);

	return {
		channels,
	};
}
