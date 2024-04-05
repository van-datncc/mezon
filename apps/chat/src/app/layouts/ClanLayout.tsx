import { ChannelList, ChannelTopbar, ClanHeader, FooterProfile } from '@mezon/components';
import { MezonPolicyProvider, useAppNavigation, useAuth, useClans, useThreads } from '@mezon/core';
import { ChannelType } from '@mezon/mezon-js';
import { selectCurrentChannel } from '@mezon/store';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useLoaderData, useNavigate } from 'react-router-dom';
import { ClanLoaderData } from '../loaders/clanLoader';
import Setting from '../pages/setting';
import ThreadsMain from '../pages/thread';

const ClanLayout = () => {
	const { toChannelPage } = useAppNavigation();
	const navigate = useNavigate();

	const { clanId } = useLoaderData() as ClanLoaderData;
	const { currentClan } = useClans();
	const { userProfile } = useAuth();

	const { isShowCreateThread } = useThreads();

	const [openSetting, setOpenSetting] = useState(false);

	const currentChannel = useSelector(selectCurrentChannel);
	const handleOpenCreate = () => {
		setOpenSetting(true);
	};

	useEffect(() => {
		if (!isShowCreateThread) {
			navigate(toChannelPage(currentChannel?.channel_id as string, currentChannel?.clan_id as string), { replace: true });
		}
	}, [isShowCreateThread, currentChannel?.channel_id, currentChannel?.clan_id]);

	return (
		<div className="flex flex-row flex-1 bg-bgSurface">
			<MezonPolicyProvider clanId={clanId}>
				<div className="flex flex-col max-w-[272px] bg-bgSurface relative">
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
					className={`flex flex-col flex-1 shrink min-w-0 bg-bgSecondary h-[100%] overflow-visible ${currentChannel?.type === ChannelType.CHANNEL_TYPE_VOICE ? 'group' : ''}`}
				>
					<ChannelTopbar channel={currentChannel} />
					<div className="flex h-heightWithoutTopBar flex-row">
						<Outlet />
					</div>
				</div>
				{isShowCreateThread && (
					<>
						<div className="w-2 cursor-ew-resize bg-[#000]" />
						<div className="w-[480px] bg-[#151515] rounded-l-lg">
							<ThreadsMain />
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
