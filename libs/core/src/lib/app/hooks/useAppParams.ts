import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

export function useAppParams() {
	const { clanId, channelId, directId, type } = useParams();

	return useMemo(
		() => ({
			clanId,
			channelId,
			directId,
			type,
		}),
		[clanId, channelId, directId, type],
	);
}
