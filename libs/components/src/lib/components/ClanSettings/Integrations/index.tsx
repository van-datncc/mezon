import { useEffect, useState } from 'react';
import { Icons } from '../../../components';
import MainIntegrations from './MainIntegrations';
import Webhooks from './Webhooks';
import { ChannelsEntity, selectAllChannels, selectAllWebhooks, useAppDispatch } from '@mezon/store';
import { useSelector } from 'react-redux';
import { ChannelIsNotThread } from '@mezon/utils';

const Integrations = () => {
	const [isOpenWebhooks, setIsOpenWebhooks] = useState(false);

	const allChannel = useSelector(selectAllChannels);
	const allWebhooks = useSelector(selectAllWebhooks);
	const [parentChannelsInClan, setParentChannelsInClan] = useState<ChannelsEntity[]>([]);

	useEffect(() => {
		const normalChannels = allChannel.filter((channel) => channel.parrent_id === ChannelIsNotThread.TRUE);
		setParentChannelsInClan(normalChannels);
	}, [allChannel]);

	return (
		<div className="sbm:mt-[60px] mt-[10px]">
			<h2 className="text-xl font-semibold mb-5 dark:text-textDarkTheme text-textLightTheme flex">
				<div
					onClick={() => setIsOpenWebhooks(false)}
					className={`${isOpenWebhooks ? 'text-[#b5bac1] hover:dark:text-textDarkTheme hover:text-textLightTheme cursor-pointer' : ''}`}
				>
					Integrations
				</div>{' '}
				{isOpenWebhooks ? (
					<div className="flex">
						<Icons.ArrowDown defaultSize="-rotate-90 w-[20px]" />
						Webhooks
					</div>
				) : (
					''
				)}
			</h2>

			{!isOpenWebhooks ? <MainIntegrations allWebhooks={allWebhooks} setIsOpenWebhooks={() => setIsOpenWebhooks(true)} /> : <Webhooks allWebhooks={allWebhooks} parentChannelsInClan={parentChannelsInClan}/>}
		</div>
	);
};

export default Integrations;
