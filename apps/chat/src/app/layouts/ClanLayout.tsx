import { ChannelList, ChannelTopbar, ClanHeader, FooterProfile } from '@mezon/components';
import { MezonPolicyProvider, useApp, useThreads } from '@mezon/core';
import {
	ChannelsEntity,
	fetchWebhooksByChannelId,
	selectAllAccount,
	selectAllChannels,
	selectAllWebhooks,
	selectCloseMenu,
	selectCurrentChannel,
	selectCurrentClan,
	selectCurrentVoiceChannel,
	selectStatusMenu,
	useAppDispatch,
} from '@mezon/store';
import { ChannelType } from 'mezon-js';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useLoaderData } from 'react-router-dom';
import { ClanLoaderData } from '../loaders/clanLoader';
import Setting from '../pages/setting';
import ThreadsMain from '../pages/thread';
import { ChannelIsNotThread } from '@mezon/utils';

const ClanLayout = () => {
	const { clanId } = useLoaderData() as ClanLoaderData;
	const currentClan = useSelector(selectCurrentClan);
	const userProfile = useSelector(selectAllAccount);
	const closeMenu = useSelector(selectCloseMenu);
	const statusMenu = useSelector(selectStatusMenu);

	const { isShowCreateThread } = useThreads();
	const { setIsShowMemberList } = useApp();

	const currentChannel = useSelector(selectCurrentChannel);
	const currentVoiceChannel = useSelector(selectCurrentVoiceChannel);

	const dispatch = useAppDispatch();
	const allChannel = useSelector(selectAllChannels);
	const [parentChannelsInClan, setParentChannelsInClan] = useState<ChannelsEntity[]>([]);

	useEffect(() => {
		const normalChannels = allChannel.filter((channel) => channel.parrent_id === ChannelIsNotThread.TRUE);
		setParentChannelsInClan(normalChannels);
	}, [allChannel]);

	useEffect(() => {
		if (parentChannelsInClan[0]) {
			dispatch(fetchWebhooksByChannelId({ channelId: parentChannelsInClan[0].channel_id as string }));
		}
	}, [dispatch, parentChannelsInClan]);


	useEffect(() => {
		if (isShowCreateThread) {
			setIsShowMemberList(false);
		}
	}, [isShowCreateThread]);

	return (
		<div className="flex flex-row flex-1 bg-transparent">
			<MezonPolicyProvider clanId={clanId}>
				<div
					className={` flex-col flex max-w-[272px] dark:bg-bgSecondary bg-bgLightSecondary relative overflow-hidden min-w-widthMenuMobile sbm:min-w-[272px] ${closeMenu ? (statusMenu ? 'flex' : 'hidden') : ''}`}
				>
					<ClanHeader name={currentClan?.clan_name} type="CHANNEL" bannerImage={currentClan?.banner} />
					<ChannelList channelCurrentType={currentVoiceChannel?.type} />
					<FooterProfile
						name={userProfile?.user?.display_name || userProfile?.user?.username || ''}
						status={userProfile?.user?.online}
						avatar={userProfile?.user?.avatar_url || ''}
						userId={userProfile?.user?.id || ''}
						channelCurrent={currentChannel}
					/>
				</div>
				<div
					className={`flex flex-col flex-1 shrink min-w-0 bg-transparent h-[100%] overflow-visible ${currentChannel?.type === ChannelType.CHANNEL_TYPE_VOICE ? 'group' : ''}`}
				>
					<ChannelTopbar channel={currentChannel} />
					<Outlet />
				</div>
				{isShowCreateThread && (
					<>
						<div className="w-2 cursor-ew-resize dark:bg-bgTertiary bg-white" />
						<div className="w-[480px] dark:bg-bgPrimary bg-bgLightModeSecond rounded-l-lg">
							<ThreadsMain />
						</div>
					</>
				)}
				<Setting />
			</MezonPolicyProvider>
		</div>
	);
};

export default ClanLayout;
