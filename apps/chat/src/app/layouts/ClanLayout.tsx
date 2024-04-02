import { ChannelList, ChannelTopbar, ClanHeader, CreateThread, FooterProfile } from '@mezon/components';
import { MezonPolicyProvider, useAuth, useClans, useThreads } from '@mezon/core';
import { useState } from 'react';
import { Outlet, useLoaderData } from 'react-router-dom';
import { ClanLoaderData } from '../loaders/clanLoader';
import Setting from '../pages/setting';

const ClanLayout = () => {
	const { clanId } = useLoaderData() as ClanLoaderData;
	const { currentClan } = useClans();
	const { userProfile } = useAuth();

	const { isShowCreateThread } = useThreads();

	const [openSetting, setOpenSetting] = useState(false);

	const handleOpenCreate = () => {
		setOpenSetting(true);
	};

	return (
		<div className="flex flex-row flex-1 bg-bgSurface">
			<MezonPolicyProvider clanId={clanId}>
				<div className="flex flex-col max-w-[272px] bg-bgSurface relative">
					<ClanHeader name={currentClan?.clan_name} type="CHANNEL" bannerImage={currentClan?.banner} />
					<ChannelList />
					<FooterProfile
						name={userProfile?.user?.username || ''}
						status={userProfile?.user?.online}
						avatar={userProfile?.user?.avatar_url || ''}
						openSetting={handleOpenCreate}
					/>
				</div>
				<div className="flex flex-col flex-1 bg-bgSecondary h-[100%] overflow-visible rounded-r-lg">
					<ChannelTopbar channel={undefined} />
					<div className="flex h-heightWithoutTopBar flex-row">
						<Outlet />
					</div>
				</div>
				{isShowCreateThread && (
					<>
						<div className="w-2 cursor-ew-resize bg-[#000]" />
						<div className="w-[480px] bg-[#151515] rounded-l-lg">
							<CreateThread />
						</div>
					</>
				)}
				<Setting
					open={openSetting}
					onClose={() => {
						setOpenSetting(false);
					}}
				/>
			</MezonPolicyProvider>
		</div>
	);
};

export default ClanLayout;
