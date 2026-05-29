import { getStore, selectDirectById, selectOgpData } from '@mezon/store';
import { useMezon } from '@mezon/transport';
import type { IMessageSendPayload } from '@mezon/utils';
import { EBacktickType, EOgpType, processText, sleep } from '@mezon/utils';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export function useSendInviteMessage() {
	const { t } = useTranslation('linkMessageInvite');
	const { clientRef, sessionRef } = useMezon();
	const client = clientRef.current;

	const sendInviteMessage = React.useCallback(
		async (url: string, channel_id: string, channelMode: number, code?: number) => {
			const { links, markdowns } = processText(url);
			const linkInMk: { type: EBacktickType; e?: number; s?: number }[] = [];

			links.forEach((link) => {
				const item = {
					type: EBacktickType.LINK,
					e: link?.e,
					s: link?.s
				};
				linkInMk.push(item);
			});

			const mk = [...markdowns, ...linkInMk];
			const store = getStore();
			const ogpData = selectOgpData(store.getState());

			if (ogpData) {
				mk.push({
					description: ogpData?.description?.slice(0, 200) || '',
					image: ogpData?.image || '',
					title: ogpData.type !== EOgpType.image ? ogpData?.title || '' : '',
					s: ogpData.url.length || 0,
					e: (ogpData.url.length || 0) + 1,
					type: EBacktickType.OGP_PREVIEW,
					index: ogpData.index,
					clanId: ogpData.clan_id,
					url: ogpData.url,
					member_count: ogpData.member_count,
					banner: ogpData.banner,
					is_community: ogpData.is_community
				});
			}

			const content: IMessageSendPayload = {
				t: url,
				mk
			};

			const session = sessionRef.current;
			const client = clientRef.current;

			if (!client || !session || !channel_id) {
				console.error(client, session, channel_id);
				throw new Error('Client is not initialized');
			}

			const foundDM = selectDirectById(store.getState(), channel_id);
			if (!foundDM) {
				await sleep(100);
			}

			await client.sendChannelMessage(
				session,
				'0',
				channel_id,
				channelMode,
				false,
				typeof content === 'object' ? JSON.stringify(content) : content,
				[],
				[],
				[],
				undefined,
				undefined,
				undefined,
				code
			);
		},
		[sessionRef, clientRef, t]
	);

	return useMemo(
		() => ({
			client,
			sendInviteMessage
		}),
		[client, sendInviteMessage]
	);
}
