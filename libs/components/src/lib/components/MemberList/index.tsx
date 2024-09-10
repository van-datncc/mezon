import { ChannelMembersEntity, ChannelsEntity, selectAllChannelMembers, selectCloseMenu, selectCurrentChannel, useAppSelector } from '@mezon/store';
import { memo } from 'react';
import { useSelector } from 'react-redux';
import ListMember from './listMember';

export type MemberListProps = { className?: string };

function MemberList() {
	const currentChannel = useAppSelector(selectCurrentChannel);
	return <MemberListContent currentChannel={currentChannel} />;
}

const MemberListContent = memo(({ currentChannel }: { currentChannel: ChannelsEntity | null }) => {
	const closeMenu = useSelector(selectCloseMenu);
	const members = useAppSelector((state) => selectAllChannelMembers(state, currentChannel?.id as string));
	const onlineMembers = (members as ChannelMembersEntity[])
		.filter((item) => {
			return item.user?.online;
		})
		.map((item) => ({ ...item, channelId: currentChannel?.id }));
	const offlineMembers = (members as ChannelMembersEntity[])
		.filter((item) => {
			return !item.user?.online;
		})
		.map((item) => ({ ...item, channelId: currentChannel?.id }));

	return (
		<div className={`self-stretch h-[268px] flex-col justify-start items-start flex p-4 gap-[24px] w-full ${closeMenu ? 'pt-20' : 'pt-4'}`}>
			<div className="w-full">
				<p className="mb-3 dark:text-[#AEAEAE] text-black text-[14px] font-semibold flex items-center gap-[4px] font-title text-xs tracking-wide uppercase">
					MEMBER - {onlineMembers.length}
				</p>
				<div className="flex flex-col gap-4 ">
					<ListMember
						lisMembers={[
							...onlineMembers,
							{
								offlineSeparate: true
							},
							...offlineMembers
						]}
						offlineCount={offlineMembers.length}
					/>
				</div>
			</div>
		</div>
	);
});

export default memo(MemberList);
