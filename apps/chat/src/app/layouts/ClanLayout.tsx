import { ChannelList, ChannelTopbar, ClanHeader, FooterProfile } from '@mezon/components';
import { MezonPolicyProvider, useAuth, useClans } from '@mezon/core';
import { ChannelType } from '@mezon/mezon-js';
import { selectCurrentChannel } from '@mezon/store';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useLoaderData } from 'react-router-dom';
import { ClanLoaderData } from '../loaders/clanLoader';
import Setting from '../pages/setting';

const ClanLayout = () => {
	const { clanId } = useLoaderData() as ClanLoaderData;
	const { currentClan } = useClans();
	const { userProfile } = useAuth();
	const [openSetting, setOpenSetting] = useState(false);
	const currentChannel = useSelector(selectCurrentChannel);
	const handleOpenCreate = () => {
		setOpenSetting(true);
	};

	return (
		<div className="flex-row bg-bgSurface flex grow">
			<MezonPolicyProvider clanId={clanId}>
				<div className="flex flex-col w-widthSideBar max-w-[272px] bg-bgSurface relative">
					<ClanHeader name={currentClan?.clan_name} type="CHANNEL" bannerImage={currentClan?.banner} />
					<ChannelList channelCurrentType={currentChannel?.type} />
					<FooterProfile
						name={userProfile?.user?.username || ''}
						status={userProfile?.user?.online}
						avatar={userProfile?.user?.avatar_url || ''}
						openSetting={handleOpenCreate}
						channelCurrent={currentChannel}
					/>
				</div>
				<div
					className={`flex flex-col flex-1 shrink min-w-0 bg-bgSecondary h-[100%] overflow-hidden ${currentChannel?.type === ChannelType.CHANNEL_TYPE_VOICE ? 'group' : ''}`}
				>
					<ChannelTopbar channel={currentChannel} />
					<div className="flex h-heightWithoutTopBar flex-row">
						<Outlet />
					</div>
				</div>
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
