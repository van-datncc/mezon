import { selectApplicationById, selectCurrentAppId } from '@mezon/store';
import { useSelector } from 'react-redux';
import ClientInformation from './ClientInformation/ClientInfomation';
import Generator from './Generator/Generator';
import Redirects from './Redirects/Redirects';

const OAuth2 = () => {
	const currentAppId = useSelector(selectCurrentAppId);
	const currentApp = useSelector((state) => selectApplicationById(state, currentAppId as string)) ?? {};
	return (
		<div className="flex flex-col gap-10">
			<div className="flex gap-5 flex-col">
				<div className="text-2xl font-semibold">OAuth2</div>
				<div className="text-xl dark:text-[#b5bac1] text-[#4e5058]">
					Use Mezon as an authorization system or use our API on behalf of your users. Add a redirect URI, pick your scopes, roll a D20 for
					good luck, and go!
				</div>
				<div className="text-blue-500 cursor-pointer">Learn more about OAuth2</div>
			</div>
			<ClientInformation currentApp={currentApp} />
			<Redirects currentApp={currentApp} />
			<Generator />
		</div>
	);
};

export default OAuth2;
