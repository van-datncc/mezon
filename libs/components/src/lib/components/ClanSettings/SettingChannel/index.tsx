import { useCategory } from '@mezon/core';
import { channelSettingActions, selectAllChannelSuggestion, selectCurrentClanId, selectMemberClanByUserId, useAppDispatch } from '@mezon/store';
import { Icons } from '@mezon/ui';
import { ChannelThreads, ICategoryChannel } from '@mezon/utils';
import { Avatar, Tooltip } from 'flowbite-react';
import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';

const ListChannelSetting = () => {
	const { categorizedChannels } = useCategory();
	const dispatch = useAppDispatch();
	const selectClanId = useSelector(selectCurrentClanId);
	const listChannel = useSelector(selectAllChannelSuggestion);

	const memoizedCategorizedChannels = useMemo(() => {
		return categorizedChannels.map((category: ICategoryChannel) => {
			if (category.channels.length === 0) {
				return null;
			}
			return (
				<div className="flex flex-col w-full">
					<div className="rounded-t w-fit px-2 py-2 dark:bg-bgSecondaryHover bg-bgLightModeThird text-channelActiveColor text-base shadow border-b-[1px] dark:border-bgTertiary uppercase font-semibold">
						{category.category_name}
					</div>
					<ListChannelByCate key={category.id} category={category} channels={category.channels} />
				</div>
			);
		});
	}, [categorizedChannels]);

	useEffect(() => {
		async function fetchListChannel() {
			await dispatch(channelSettingActions.fetchChannelByUserId({ clanId: selectClanId as string }));
		}
		fetchListChannel();
	}, []);
	console.log('Lisst', listChannel);
	return (
		<div className="w-full flex flex-col gap-1">
			<div className="w-full flex pl-12">
				<span className="flex-1">Name</span>
				<span className="flex-1">Members</span>
				<span>Creator</span>
			</div>
			{listChannel.length > 0
				? listChannel.map((channel, index) => (
						<ItemInfor creatorId={'1809059413005176832'} label={'Hello Me'} privateChannel={1} isThread={false} key={index} />
					))
				: null}
		</div>
	);
};

interface ListChannelByCateProps {
	category: ICategoryChannel;
	channels: ChannelThreads[];
}

const ListChannelByCate = ({ channels, category }: ListChannelByCateProps) => {
	return (
		<div className={`flex rounded-sm gap-2 dark:bg-bgSecondaryHover bg-bgLightModeThird`}>
			<div className="space-y-0.5 text-contentTertiary flex-1">
				{channels.map((channel: ChannelThreads) => {
					return <ListThreadByChannel key={channel.id} channel={channel as ChannelThreads} />;
				})}
			</div>
		</div>
	);
};

interface ListThreadByChannelProps {
	channel: ChannelThreads;
}

const ListThreadByChannel = ({ channel }: ListThreadByChannelProps) => {
	return (
		<div className="flex overflow-hidden gap-1 flex-col dark:bg-bgSecondaryHover bg-bgLightModeThird rounded-lg dark:text-textDarkTheme text-textLightTheme">
			<ItemInfor
				creatorId={channel.creator_id as string}
				label={channel.channel_label || ''}
				privateChannel={channel.channel_private as number}
			/>

			{channel.threads?.length && channel.threads.length > 0 ? (
				<div className="flex flex-col gap-1 pl-10">
					{channel.threads.map((thread) => (
						<ItemInfor
							isThread={true}
							creatorId={thread.category_id as string}
							label={thread.channel_label || ''}
							privateChannel={thread.channel_private as number}
						/>
					))}
				</div>
			) : null}
		</div>
	);
};

const ItemInfor = ({
	isThread,
	label,
	creatorId,
	privateChannel
}: {
	isThread?: boolean;
	label: string;
	creatorId: string;
	privateChannel: number;
}) => {
	const creatorChannel = useSelector(selectMemberClanByUserId(creatorId));
	console.log('creatorChannel: ', creatorId);
	// ${isThread ? 'after:content-[" "] after:w-4 after:h-16 after:rounded-l-md after:rounded-t-none after:border-l-2 after:border-b-2 after:bg-transparent after:border-channelTextLabel after:absolute after:bottom-8 after:-left-5 ' : ''}

	return (
		<div
			className={`flex object-cover items-center py-3 px-3 gap-3 w-full relative before:content-[" "] before:w-full before:h-[0.08px] before:bg-borderDivider before:absolute before:top-0 before:left-0 `}
		>
			<div className="h-6 w-6">{isThread ? <Icons.ThreadIcon /> : privateChannel ? <Icons.HashtagLocked /> : <Icons.Hashtag />}</div>
			<div className="flex-1">{label}</div>
			<div className="flex-1 flex ">
				<Avatar.Group className="flex gap-3 justify-end items-center">
					<Avatar key={creatorId} img={creatorChannel?.clan_avatar || creatorChannel?.user?.avatar_url} rounded size="xs" />
					<Avatar key={creatorId} img={creatorChannel?.clan_avatar || creatorChannel?.user?.avatar_url} rounded size="xs" />
					<Avatar key={creatorId} img={creatorChannel?.clan_avatar || creatorChannel?.user?.avatar_url} rounded size="xs" />
					<Avatar key={creatorId} img={creatorChannel?.clan_avatar || creatorChannel?.user?.avatar_url} rounded size="xs" />
					<Avatar key={creatorId} img={creatorChannel?.clan_avatar || creatorChannel?.user?.avatar_url} rounded size="xs" />
					<Avatar key={creatorId} img={creatorChannel?.clan_avatar || creatorChannel?.user?.avatar_url} rounded size="xs" />
					<Avatar key={creatorId} img={creatorChannel?.clan_avatar || creatorChannel?.user?.avatar_url} rounded size="xs" />
					<Avatar key={creatorId} img={creatorChannel?.clan_avatar || creatorChannel?.user?.avatar_url} rounded size="xs" />

					<Avatar.Counter
						total={50}
						className="h-4 w-6 dark:text-bgLightPrimary text-bgPrimary ring-transparent dark:bg-bgTertiary bg-bgLightTertiary dark:hover:bg-bgTertiary hover:bg-bgLightTertiary"
					/>
				</Avatar.Group>
			</div>

			<Tooltip content={creatorChannel?.clan_nick || creatorChannel?.user?.display_name || creatorChannel.user?.username}>
				<div className="h-8 w-8 rounded-full overflow-hidden flex object-cover">
					<img src={creatorChannel?.clan_avatar || creatorChannel?.user?.avatar_url} />
				</div>
			</Tooltip>
		</div>
	);
};
export default ListChannelSetting;
