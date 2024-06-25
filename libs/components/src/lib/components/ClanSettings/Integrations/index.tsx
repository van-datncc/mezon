import { useState } from 'react';
import { Icons } from '../../../components';
import MainIntegrations from './MainIntegrations';
import Webhooks from './Webhooks';

const Integrations = () => {
	const [isOpenWebhooks, setIsOpenWebhooks] = useState(false);
	return (
		<div>
			<h2 className="text-xl font-semibold mb-5 dark:text-textDarkTheme text-textLightTheme flex">
				<div onClick={() => setIsOpenWebhooks(false)} className={`${isOpenWebhooks? "text-[#b5bac1] hover:dark:text-textDarkTheme hover:text-textLightTheme cursor-pointer":""}`}>Integrations</div>{' '}
				{isOpenWebhooks ? (
					<div className="flex">
						<Icons.ArrowDown defaultSize="-rotate-90 w-[20px]" />
						Webhooks
					</div>
				) : (
					''
				)}
			</h2>

			{!isOpenWebhooks ? <MainIntegrations setIsOpenWebhooks={()=>setIsOpenWebhooks(true)}/> : <Webhooks />}
		</div>
	);
};

export default Integrations;
