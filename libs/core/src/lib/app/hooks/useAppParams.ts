import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

export function useAppParams() {
	const { clanId, channelId, directId, type } = useParams();
	// const { pathname: currentURL } = useLocation();

	return useMemo(
		() => ({
			clanId,
			channelId,
			directId,
			type,
			currentURL: "",
		}),
		[clanId, channelId, directId, type],
	);
}