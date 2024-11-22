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
			className={`mt-5 dark:text-[#b5bac1] text-textLightTheme py-[20px] px-[16px] flex justify-between items-center border dark:border-black border-[#d1d4d9] rounded-md dark:bg-[#2b2d31] bg-bgLightSecondary ${allClanWebhooks?.length !== 0 ? 'cursor-pointer' : ''}`}
		>
			<div className="flex gap-3 max-sm:gap-0 max-sbm:w-[40%] items-center">
				<div className="rounded-full p-4 max-sm:p-2 dark:bg-[#111214]">
					<Icons.WebhooksIcon className="text-[#4e5058] dark:text-[#b5bac1]" />
				</div>
				<div>
					<div className="pb-[3px] font-semibold break-all">Clan Webhooks</div>
					<div className="text-[12px]">
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
				<div className="items-center cursor-pointer text-[#4e5058] dark:text-[#b5bac1] text-[14px] flex gap-[4px]">
					<div>View Clan Webhook</div>
					<Icons.ArrowDown defaultSize="h-[15px] w-[15px] dark:text-[#b5bac1] text-black -rotate-90" />
				</div>
			)}
		</div>
	);
};

export default MainClanIntegrations;
