import { ChannelsEntity, generateWebhook, selectAllChannels, useAppDispatch } from '@mezon/store';
import { ChannelIsNotThread } from '@mezon/utils';
import { ApiCreateWebhookRequest } from 'mezon-js/api.gen';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import WebhookItemModal from './WebhookItemModal';

const Webhooks = () => {
	const dispatch = useAppDispatch();
	const allChannel = useSelector(selectAllChannels);
	const [normalChannels, setNormalChannel] = useState<ChannelsEntity[]>([]);

	useEffect(() => {
		const normalChannels = allChannel.filter((channel) => channel.parrent_id === ChannelIsNotThread.TRUE);
		setNormalChannel(normalChannels);
	}, [allChannel]);

	const handleAddWebhook = () => {
		const newWebhookReq: ApiCreateWebhookRequest = {
			channel_id: normalChannels[0].channel_id,
			hook_name: 'Captain hook',
		};
		dispatch(generateWebhook(newWebhookReq));
	};
	return (
		<>
			<div className="dark:text-[#b5bac1] text-textLightTheme text-sm pt-5">
				Webhooks are a simple way to post messages from other apps and websites into Discord using internet magic.
				<b className="font-semibold text-[#00a8fc] hover:underline cursor-pointer"> Learn more</b> or try{' '}
				<b className="font-semibold text-[#00a8fc] hover:underline cursor-pointer">building one yourself.</b>
			</div>
			<div className="border-b-[1px] border-[#616161] my-[32px]"></div>
			<div onClick={handleAddWebhook} className="py-2 px-4 bg-[#5865f2] rounded-sm mb-[24px] w-fit text-[14px] font-semibold cursor-pointer">
				New Webhook
			</div>
			<WebhookItemModal />
		</>
	);
};

export default Webhooks;
