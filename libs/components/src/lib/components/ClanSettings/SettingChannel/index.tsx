import { channelSettingActions, selectAllChannelSuggestion, selectCurrentClanId, selectMemberClanByUserId, useAppDispatch } from '@mezon/store';
import { Icons } from '@mezon/ui';
import { ChannelStatusEnum } from '@mezon/utils';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Avatar, Tooltip } from 'flowbite-react';
import { useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';

type ListChannelSettingProp = {
	privateFilter?: boolean;
	publicFilter?: boolean;
	searchFilter: string;
};

const ListChannelSetting = ({ privateFilter, publicFilter, searchFilter }: ListChannelSettingProp) => {
	const dispatch = useAppDispatch();
	const selectClanId = useSelector(selectCurrentClanId);
	const listChannel = useSelector(selectAllChannelSuggestion);
	useEffect(() => {
		async function fetchListChannel() {
			await dispatch(channelSettingActions.fetchChannelByUserId({ clanId: selectClanId as string }));
		}
		fetchListChannel();
	}, []);
	const parentRef = useRef(null);
	const listChannelSetting = useMemo(() => {
		return listChannel.filter((channel) => {
			if (privateFilter && channel.channel_private !== ChannelStatusEnum.isPrivate) {
				return false;
			}
			if (!channel.channel_label?.includes(searchFilter)) {
				return false;
			}
			return true;
		});
	}, [privateFilter, searchFilter, listChannel.length]);

	const rowVirtualizer = useVirtualizer({
		count: listChannelSetting.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 56,
		overscan: 5
	});
	return (
		<div className="h-full w-full flex flex-col gap-1 flex-1">
			<div className="w-full flex pl-12 pr-4 justify-between items-center h-[48px] shadow border-b-[1px] dark:border-bgTertiary text-xs dark:text-textDarkTheme text-textLightTheme font-bold uppercase">
				<span className="flex-1">Name</span>
				<span className="flex-1">Members</span>
				<span>Creator</span>
			</div>
			<div className="h-full overflow-y-auto  hide-scrollbar scroll-smooth" ref={parentRef}>
				<div
					style={{
						height: `${rowVirtualizer.getTotalSize()}px`,
						width: '100%',
						position: 'relative'
					}}
				>
					{rowVirtualizer.getVirtualItems().map((virtualRow, index) => {
						const channel = listChannelSetting[virtualRow.index];
						return (
							<div
								key={virtualRow.key}
								style={{
									position: 'absolute',
									top: 0,
									left: 0,
									width: '100%',
									height: `${virtualRow.size}px`,
									transform: `translateY(${virtualRow.start}px)`
								}}
							>
								<ItemInfor
									creatorId={channel.creator_id as string}
									label={channel.channel_label as string}
									privateChannel={channel.channel_private as number}
									isThread={channel.parent_id !== '0'}
									key={channel.id}
									userIds={channel.user_ids || []}
								/>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

// };

const ItemInfor = ({
	isThread,
	label,
	creatorId,
	privateChannel,
	userIds
}: {
	isThread?: boolean;
	label: string;
	creatorId: string;
	privateChannel: number;
	userIds: string[];
}) => {
	const creatorChannel = useSelector(selectMemberClanByUserId(creatorId));

	return (
		<div
			className={`flex object-cover items-center py-3 px-3 gap-3 w-full relative before:content-[" "] before:w-full before:h-[0.08px] before:bg-borderDivider before:absolute before:top-0 before:left-0 `}
		>
			<div className="h-6 w-6">
				{isThread ? (
					privateChannel ? (
						<Icons.ThreadIconLocker />
					) : (
						<Icons.ThreadIcon />
					)
				) : privateChannel ? (
					<Icons.HashtagLocked />
				) : (
					<Icons.Hashtag />
				)}
			</div>
			<div className="flex-1">{label}</div>
			<div className="flex-1 flex ">
				{privateChannel ? (
					<Avatar.Group className="flex gap-3 justify-end items-center">
						{userIds.slice(0, 2).map((member) => (
							<AvatarUser id={member} key={member} />
						))}
						{userIds.length > 1 && (
							<Avatar.Counter
								total={userIds.length - 1}
								className="h-4 w-6 dark:text-bgLightPrimary text-bgPrimary ring-transparent dark:bg-bgTertiary bg-bgLightTertiary dark:hover:bg-bgTertiary hover:bg-bgLightTertiary"
							/>
						)}
					</Avatar.Group>
				) : (
					<p className="italic text-xs">(All Members)</p>
				)}
			</div>

			<Tooltip content={creatorChannel?.clan_nick || creatorChannel?.user?.display_name || creatorChannel?.user?.username} placement="left">
				<div className="overflow-hidden flex w-12 items-center justify-center">
					<img src={creatorChannel?.clan_avatar || creatorChannel?.user?.avatar_url} className="w-8 h-8 object-cover rounded-full " />
				</div>
			</Tooltip>
		</div>
	);
};
export default ListChannelSetting;

const AvatarUser = ({ id }: { id: string }) => {
	const member = useSelector(selectMemberClanByUserId(id));
	return <Avatar img={member?.clan_avatar || member?.user?.avatar_url} rounded size="xs" />;
};
