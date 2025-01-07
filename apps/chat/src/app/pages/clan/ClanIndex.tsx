import { useAppNavigation } from '@mezon/core';
import { selectChannelById2, selectCurrentClanId, selectDefaultChannelIdByClanId, useAppSelector } from '@mezon/store';
import { safeJSONParse } from 'mezon-js';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function ClanIndex() {
	const clanId = useSelector(selectCurrentClanId);
	const { navigate, toChannelPage } = useAppNavigation();

	const idsSelectedChannel = safeJSONParse(localStorage.getItem('remember_channel') || '{}');
	const channelId = idsSelectedChannel[clanId as string];
	const channel = useAppSelector((state) => selectChannelById2(state, channelId));
	const defaultChannelId = useAppSelector((state) => selectDefaultChannelIdByClanId(state, clanId as string));

	useEffect(() => {
		if (!defaultChannelId) return;
		const redirectId = channel?.id || defaultChannelId;
		const link = toChannelPage(redirectId as string, clanId as string);
		navigate(link);
	}, [channel, clanId, defaultChannelId, navigate, toChannelPage]);

	return (
		<div className="flex-row bg-bgSurface flex grow">
			<div className="flex flex-col bg-bgSurface relative"></div>
			<div className="flex flex-col flex-1 shrink min-w-0 bg-bgSecondary h-[100%] overflow-hidden"></div>
		</div>
	);
}
