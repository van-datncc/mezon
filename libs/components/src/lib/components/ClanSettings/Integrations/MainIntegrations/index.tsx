import { Icons } from '@mezon/ui';
import { ApiWebhook } from 'mezon-js/api.gen';

interface IIntegrationProps {
	setIsOpenWebhooks(): void;
	allWebhooks?: ApiWebhook[] | undefined;
}

const MainIntegrations = ({ setIsOpenWebhooks, allWebhooks }: IIntegrationProps) => {
	return (
		<>
			<div className="text-sm pt-5">
				Customize your server with integrations. Manage webhooks, followed channels and apps, as well as Twitch and YouTube settings for
				creators. <b className="font-semibold text-[#00a8fc] hover:underline cursor-pointer">Learn more about managing integrations.</b>
			</div>
			<div className="border-b-theme-primary my-[32px]" />
			<div
				onClick={() => {
					if (allWebhooks && allWebhooks?.length !== 0) {
						setIsOpenWebhooks();
					}
				}}
				className={`py-[20px] px-[16px] flex justify-between items-center border-theme-primary rounded-lg bg-item-theme ${allWebhooks?.length !== 0 ? 'cursor-pointer' : ''}`}
			>
				<div className="flex gap-4 max-sm:gap-0 max-sbm:w-[40%] items-center">
					<Icons.WebhooksIcon />
					<div>
						<div className="pb-[3px] font-semibold break-all">Webhooks</div>
						<div className="text-[12px]">
							{allWebhooks && allWebhooks?.length > 1 ? allWebhooks?.length + ' webhooks' : allWebhooks?.length + ' webhook'}
						</div>
					</div>
				</div>
				{allWebhooks && allWebhooks?.length === 0 ? (
					<div
						onClick={setIsOpenWebhooks}
						className="bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-md py-2 px-3 cursor-pointer font-semibold"
					>
						Create Webhook
					</div>
				) : (
					<div className="items-center cursor-pointer text-[14px] flex gap-[4px]">
						<div>View Webhook</div>
						<Icons.ArrowDown defaultSize="h-[15px] w-[15px]  -rotate-90" />
					</div>
				)}
			</div>
		</>
	);
};

export default MainIntegrations;
