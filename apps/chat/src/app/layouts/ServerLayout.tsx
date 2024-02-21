import { MezonPolicyProvider } from '@mezon/core';
import { Outlet, useLoaderData } from 'react-router-dom';
import { ServerLoaderData } from '../loaders/serverLoader';

const ServerLayout = () => {
	const { serverId } = useLoaderData() as ServerLoaderData;

	return (
		<div className="flex-row bg-bgSurface md:flex grow">
			<MezonPolicyProvider clanId={serverId}>
				<Outlet />
			</MezonPolicyProvider>
		</div>
	);
};

export default ServerLayout;
