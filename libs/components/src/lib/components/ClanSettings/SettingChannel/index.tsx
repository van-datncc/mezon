import { selectChannelSuggestionEntities, selectMemberClanByGoogleId, selectMemberClanByUserId } from '@mezon/store';
import { Icons } from '@mezon/ui';
import { getAvatarForPrioritize } from '@mezon/utils';
import { Avatar, AvatarSizes, Tooltip } from 'flowbite-react';
import { ChannelType } from 'mezon-js';
import { ApiChannelSettingItem } from 'mezon-js/api.gen';
import { useRef, useState } from 'react';
import { useModal } from 'react-modal-hook';
import { useSelector } from 'react-redux';
import ChannelSettingInforItem from './InforChannelSetting';

type ListChannelSettingProp = {
	listChannel: Record<string, ApiChannelSettingItem[]>;
};

const ListChannelSetting = ({ listChannel }: ListChannelSettingProp) => {
	const [channelSettingId, setChannelSettingId] = useState('');
	const parentRef = useRef(null);
	const listChannelEntities = useSelector(selectChannelSuggestionEntities);

	const [openModalChannelSetting, closeModalChannelSetting] = useModal(() => {
		return <ChannelSettingInforItem onClose={closeModalChannelSetting} channelId={channelSettingId} />;
	}, [channelSettingId]);

	const handleChooseChannelSetting = (id: string) => {
		setChannelSettingId(id);
		openModalChannelSetting();
	};

	const RenderChannelAndThread = () => {
		const components: JSX.Element[] = [];
		for (const [key, listThread] of Object.entries(listChannel)) {
			const channel = listChannelEntities[key];
			components.push(
				<>
					<ItemInfor
						creatorId={channel.creator_id as string}
						label={channel?.channel_label as string}
						privateChannel={channel.channel_private as number}
						isThread={channel?.parent_id !== '0'}
						key={channel.id}
						userIds={channel?.user_ids || []}
						onClick={handleChooseChannelSetting}
						channelId={channel.id as string}
						isVoice={channel.channel_type === ChannelType.CHANNEL_TYPE_VOICE}
						message_count={channel.message_count || 0}
					/>
					<div className="flex flex-col pl-8">
						{listThread.map((thread) => (
							<ItemInfor
								creatorId={thread.creator_id as string}
								label={thread?.channel_label as string}
								privateChannel={thread.channel_private as number}
								isThread={thread?.parent_id !== '0'}
								key={`${thread.id}_thread`}
								userIds={thread?.user_ids || []}
								onClick={handleChooseChannelSetting}
								channelId={thread.id as string}
								message_count={channel.message_count || 0}
							/>
						))}
					</div>
				</>
			);
		}
		return (
			<div className="flex flex-col">
				{components.map((channelGroup, index) => (
					<div key={`group_${index}`}>{channelGroup}</div>
				))}
			</div>
		);
	};

	return (
		<div className="h-full w-full flex flex-col gap-1 flex-1">
			<div className="w-full flex pl-12 pr-12 justify-between items-center h-[48px] shadow border-b-[1px] dark:border-bgTertiary text-xs dark:text-textDarkTheme text-textLightTheme font-bold uppercase">
				<span className="flex-1">Name</span>
				<span className="flex-1">Members</span>
				<span className="flex-1">Messages count</span>
				<span className="pr-1">Creator</span>
			</div>
			<div className="h-full overflow-y-auto  hide-scrollbar scroll-smooth pb-10" ref={parentRef}>
				{RenderChannelAndThread()}
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
	userIds,
	onClick,
	channelId,
	isVoice,
	message_count
}: {
	isThread?: boolean;
	label: string;
	creatorId: string;
	privateChannel: number;
	userIds: string[];
	onClick: (id: string) => void;
	channelId: string;
	isVoice?: boolean;
	message_count?: number | string;
}) => {
	const creatorChannel = useSelector(selectMemberClanByUserId(creatorId));
	const handleChooseChannel = () => {
		onClick(channelId);
	};
	const handleCopyChannelId = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.stopPropagation();
		e.preventDefault();
		navigator.clipboard.writeText(channelId);
	};
	return (
		<div
			className={`w-full py-1 relative before:content-[" "] before:w-full before:h-[0.08px] before:bg-borderDivider before:absolute before:top-0 before:left-0 group text-textPrimaryLight dark:text-textPrimary`}
			onContextMenu={handleCopyChannelId}
		>
			<div className="cursor-pointer px-3 py-2 pr-12 flex gap-3 items-center w-full hover:bg-bgHover">
				<div className="h-6 w-6">
					{!isVoice && (
						<>
							{isThread ? (
								privateChannel ? (
									<Icons.ThreadIconLocker className="w-5 h-5 fill-textPrimary" />
								) : (
									<Icons.ThreadIcon />
								)
							) : privateChannel ? (
								<Icons.HashtagLocked />
							) : (
								<Icons.Hashtag />
							)}
						</>
					)}

					{isVoice && <Icons.Speaker />}
				</div>
				<div className={`flex-1`}>{label}</div>
				<div className="flex-1 flex ">
					{privateChannel ? (
						<Avatar.Group className={`flex flex-1 items-center gap-3 ${isThread ? '-ml-8' : ''}`}>
							{userIds.slice(0, 2).map((member) => (
								<AvatarUserShort id={member} key={member} hiddenTooltip={true} />
							))}
							{userIds.length > 3 && (
								<Avatar.Counter
									total={userIds.length - 1}
									className="h-4 w-6 dark:text-textPrimary text-textPrimaryLight ring-transparent dark:bg-bgTertiary bg-bgLightTertiary dark:hover:bg-bgTertiary hover:bg-bgLightTertiary"
								/>
							)}
						</Avatar.Group>
					) : (
						<p className={`italic text-xs ${isThread ? '-ml-8' : ''}`}>(All Members)</p>
					)}
				</div>
				<div className={`flex-1 font-semibold ${isThread ? '-ml-8' : ''}`}>{message_count}</div>

				<div className="overflow-hidden flex w-12 items-center justify-center">
					{(creatorChannel?.clan_avatar || creatorChannel?.user?.avatar_url) && (
						<Tooltip
							content={creatorChannel?.clan_nick || creatorChannel?.user?.display_name || creatorChannel?.user?.username}
							placement="left"
						>
							<img
								src={creatorChannel?.clan_avatar || creatorChannel?.user?.avatar_url}
								className="w-8 h-8 object-cover rounded-full "
							/>
						</Tooltip>
					)}
				</div>
			</div>
		</div>
	);
};
export default ListChannelSetting;
export const AvatarUserShort = ({ id, hiddenTooltip = false, size = 'xs' }: { id: string; hiddenTooltip?: boolean; size?: keyof AvatarSizes }) => {
	const member = useSelector(selectMemberClanByUserId(id));
	const voiceClan = useSelector(selectMemberClanByGoogleId(id ?? ''));
	const clanAvatar = voiceClan?.clan_avatar || member?.clan_avatar;
	const userAvatar = voiceClan?.user?.avatar_url || member?.user?.avatar_url;
	const avatarUrl = getAvatarForPrioritize(clanAvatar, userAvatar);

	return (
		<>
			{hiddenTooltip ? (
				<Avatar img={avatarUrl} rounded size={size} />
			) : (
				<Tooltip content={member?.clan_nick || member?.user?.display_name || member?.user?.username} hidden={hiddenTooltip} trigger="hover">
					<Avatar img={avatarUrl} rounded size={size} />
				</Tooltip>
			)}
		</>
	);
};
