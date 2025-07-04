import { Icons } from '@mezon/ui';
import { ApiClanWebhook } from 'mezon-js/api.gen';

interface IClanIntegrationProps {
	setIsOpenClanWebhooks(): void;
	allClanWebhooks?: ApiClanWebhook[] | undefined;
}

const MainClanIntegrations = ({ setIsOpenClanWebhooks, allClanWebhooks }: IClanIntegrationProps) => {
	return (
		<div
			onClick={() => {
				if (allClanWebhooks && allClanWebhooks?.length !== 0) {
					setIsOpenClanWebhooks();
				}
			}}
			className={`mt-5  py-[20px] px-[16px] flex justify-between items-center border-theme-primary rounded-lg bg-item-theme ${allClanWebhooks?.length !== 0 ? 'cursor-pointer' : ''}`}
		>
			<div className="flex gap-4 max-sm:gap-0 max-sbm:w-[40%] items-center">
				<Icons.WebhooksIcon />
				<div>
					<div className="pb-[3px] font-semibold break-all text-theme-primary">Clan Webhooks</div>
					<div className="text-[12px] text-theme-primary">
						{allClanWebhooks && allClanWebhooks?.length > 1
							? allClanWebhooks?.length + ' webhooks'
							: allClanWebhooks?.length + ' webhook'}
					</div>
				</div>
			</div>
			{allClanWebhooks && allClanWebhooks?.length === 0 ? (
				<div
					onClick={setIsOpenClanWebhooks}
					className="bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-md py-2 px-3 cursor-pointer font-semibold"
				>
					Create Clan Webhook
				</div>
			) : (
				<div className="items-center cursor-pointer text-[14px] flex gap-[4px]">
						<div className="text-theme-primary">View Clan Webhook</div>
					<Icons.ArrowDown defaultSize="h-[15px] w-[15px] -rotate-90" />
				</div>
			)}
		</div>
	);
};

export default MainClanIntegrations;
