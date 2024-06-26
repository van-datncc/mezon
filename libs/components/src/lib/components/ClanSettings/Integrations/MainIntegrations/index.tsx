import { Icons } from "libs/components/src/lib/components";

interface IIntegrationProps{
    setIsOpenWebhooks(): void;
}

const MainIntegrations = ({setIsOpenWebhooks} : IIntegrationProps) => {
	return (
		<>
			<div className="dark:text-[#b5bac1] text-textLightTheme text-sm pt-5">
				Customize your server with integrations. Manage webhooks, followed channels and apps, as well as Twitch and YouTube settings for
				creators. <b className="font-semibold text-[#00a8fc] hover:underline cursor-pointer">Learn more about managing integrations.</b>
			</div>
			<div className="border-b-[1px] border-[#616161] my-[32px]"></div>
			<div className="dark:text-[#b5bac1] text-textLightTheme py-[20px] px-[16px] flex justify-between items-center border dark:border-black border-[#d1d4d9] rounded-md dark:bg-[#2b2d31] bg-bgLightSecondary">
				<div className="flex gap-3 items-center">
					<div className="rounded-full p-4 dark:bg-[#111214]">
						<Icons.WebhooksIcon className="text-[#4e5058] dark:text-[#b5bac1]" />
					</div>
					<div>
						<div className="pb-[3px] font-semibold">Webhooks</div>
						<div className="text-[12px]">0 webhook</div>
					</div>
				</div>
				<div onClick={setIsOpenWebhooks} className="bg-[#5865f2] text-white rounded-md py-2 px-3 cursor-pointer font-semibold">
					Create Webhook
				</div>
			</div>
		</>
	);
};

export default MainIntegrations;
