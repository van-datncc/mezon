import { ChannelsEntity, fetchWebhooksByChannelId, generateWebhook, selectAllChannels, selectAllWebhooks, useAppDispatch } from '@mezon/store';
import { ChannelIsNotThread } from '@mezon/utils';
import { ApiWebhookCreateRequest } from 'mezon-js/api.gen';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import WebhookItemModal from './WebhookItemModal';

const Webhooks = () => {
	const dispatch = useAppDispatch();
	const allChannel = useSelector(selectAllChannels);
	const AllWebhooks = useSelector(selectAllWebhooks);
	const [parentChannelsInClan, setParentChannelsInClan] = useState<ChannelsEntity[]>([]);

	useEffect(() => {
		const normalChannels = allChannel.filter((channel) => channel.parrent_id === ChannelIsNotThread.TRUE);
		setParentChannelsInClan(normalChannels);
	}, [allChannel]);

	useEffect(() => {
		if (parentChannelsInClan[0]?.channel_id) {
			dispatch(fetchWebhooksByChannelId({ channelId: parentChannelsInClan[0].channel_id as string }));
		}
	});

	const webhookNames = ['Captain hook', 'Spidey bot', 'Komu Knight', 'Anh ThaiPQ', 'Chi Nga Tester'];

	const getRandomWebhookName = (): string => {
		const randomIndex = Math.floor(Math.random() * webhookNames.length);
		return webhookNames[randomIndex];
	};

	const handleAddWebhook = () => {
		const newWebhookReq: ApiWebhookCreateRequest = {
			channel_id: parentChannelsInClan[0].channel_id,
			webhook_name: getRandomWebhookName(),
		};
		dispatch(generateWebhook({ request: newWebhookReq, channelId: parentChannelsInClan[0].channel_id as string }));
	};
	

	return (
		<div className='pb-5'>
			<div className="dark:text-[#b5bac1] text-textLightTheme text-sm pt-5">
				Webhooks are a simple way to post messages from other apps and websites into Discord using internet magic.
				<b className="font-semibold text-[#00a8fc] hover:underline cursor-pointer"> Learn more</b> or try{' '}
				<b className="font-semibold text-[#00a8fc] hover:underline cursor-pointer">building one yourself.</b>
			</div>
			<div className="border-b-[1px] border-[#616161] my-[32px]"></div>
			<div onClick={handleAddWebhook} className="py-2 px-4 bg-[#5865f2] rounded-sm mb-[24px] w-fit text-[14px] font-semibold cursor-pointer">
				New Webhook
			</div>
			{AllWebhooks &&
				AllWebhooks.map((webhook) => (
					<WebhookItemModal
						parentChannelsInClan={parentChannelsInClan}
						id={webhook.id}
						key={webhook.id}
						webhookName={webhook.webhook_name}
						channelId={webhook.channel_id}
						createTime={webhook.create_time}
						creatorId={webhook.creator_id}
						url={webhook.url}
					/>
				))}
		</div>
	);
};

export default Webhooks;
