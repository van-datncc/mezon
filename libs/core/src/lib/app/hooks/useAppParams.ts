import { useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';

export function useAppParams() {
	const { clanId, channelId, directId, type, canvasId } = useParams();
	const { pathname: currentURL, search } = useLocation();

	const query = useMemo(() => new URLSearchParams(search), [search]);

	const messageId = query.get('messageId');

	return useMemo(
		() => ({
			clanId,
			channelId,
			canvasId,
			directId,
			type,
			currentURL,
			messageId
		}),
		[clanId, channelId, directId, type, currentURL, messageId, canvasId]
	);
}
