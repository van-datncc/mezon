import { useState } from 'react';
import WebhookItemModal from './WebhookItemModal';

const Webhooks = () => {
	const [webhookCount, setWebhookCount] = useState(0);

	const handleAddWebhook = () => {
		setWebhookCount(webhookCount + 1);
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
			{Array.from({ length: webhookCount }).map((_, index) => (
				<WebhookItemModal key={index} />
			))}
		</>
	);
};

export default Webhooks;
