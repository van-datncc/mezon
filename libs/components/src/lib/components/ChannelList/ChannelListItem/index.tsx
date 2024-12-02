import { Avatar } from 'flowbite-react';
import React, { memo, Ref, useImperativeHandle, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
	clansActions,
	selectCategoryExpandStateByCategoryId,
	selectIsUnreadChannelById,
	selectPttMembersByChannelId,
	selectStreamMembersByChannelId,
	selectVoiceChannelMembersByChannelId
} from '@mezon/store';

import { Icons } from '@mezon/ui';
import { ChannelThreads } from '@mezon/utils';
import { ChannelType } from 'mezon-js';
import { ChannelLink, ChannelLinkRef } from '../../ChannelLink';
import { AvatarUserShort } from '../../ClanSettings/SettingChannel';
import ThreadListChannel, { ListThreadChannelRef } from '../../ThreadListChannel';
import UserListVoiceChannel from '../../UserListVoiceChannel';
import { IChannelLinkPermission } from '../CategorizedChannels';

type ChannelListItemProp = {
	channel: ChannelThreads;
	isActive: boolean;
	permissions: IChannelLinkPermission;
};

export type ChannelListItemRef = {
	scrollIntoChannel: (options?: ScrollIntoViewOptions) => void;
	scrollIntoThread: (threadId: string, options?: ScrollIntoViewOptions) => void;
	channelId: string;
	channelRef: ChannelLinkRef | null;
};

const ChannelListItem = React.forwardRef<ChannelListItemRef | null, ChannelListItemProp>((props, ref) => {
	const { channel, isActive, permissions } = props;

	const listThreadRef = useRef<ListThreadChannelRef | null>(null);
	const channelLinkRef = useRef<ChannelLinkRef | null>(null);

	useImperativeHandle(ref, () => ({
		scrollIntoChannel: (options: ScrollIntoViewOptions = { block: 'center' }) => {
			channelLinkRef.current?.scrollIntoView(options);
		},
		scrollIntoThread: (threadId: string, options: ScrollIntoViewOptions = { block: 'center' }) => {
			listThreadRef.current?.scrollIntoThread(threadId, options);
		},
		channelId: channel?.id,
		channelRef: channelLinkRef.current
	}));

	return (
		<ChannelLinkContent
			channel={channel}
			listThreadRef={listThreadRef}
			channelLinkRef={channelLinkRef}
			isActive={isActive}
			permissions={permissions}
		/>
	);
});

export default memo(ChannelListItem);

type ChannelLinkContentProps = {
	channel: ChannelThreads;
	listThreadRef: Ref<ListThreadChannelRef>;
	channelLinkRef: Ref<ChannelLinkRef>;
	isActive: boolean;
	permissions: IChannelLinkPermission;
};

const ChannelLinkContent: React.FC<ChannelLinkContentProps> = ({ channel, listThreadRef, channelLinkRef, isActive, permissions }) => {
	const dispatch = useDispatch();
	const isUnreadChannel = useSelector((state) => selectIsUnreadChannelById(state, channel.id));
	const voiceChannelMembers = useSelector(selectVoiceChannelMembersByChannelId(channel.id));
	const streamChannelMembers = useSelector(selectStreamMembersByChannelId(channel.id));
	const inPushToTalkMembers = useSelector(selectPttMembersByChannelId(channel.id));

	const channelHasPushToTalkFeature = useMemo(() => {
		return channel.type === ChannelType.CHANNEL_TYPE_TEXT && channel.channel_private === 1;
	}, [channel.channel_private, channel.type]);

	const channelMemberList = useMemo(() => {
		if (channel.type === ChannelType.CHANNEL_TYPE_VOICE) return voiceChannelMembers;
		if (channel.type === ChannelType.CHANNEL_TYPE_STREAMING) return streamChannelMembers;
		if (channelHasPushToTalkFeature) return inPushToTalkMembers;
		return [];
	}, [channel.type, voiceChannelMembers, streamChannelMembers, channelHasPushToTalkFeature, inPushToTalkMembers]);

	const isCategoryExpanded = useSelector(selectCategoryExpandStateByCategoryId(channel.clan_id || '', channel.category_id || ''));
	const unreadMessageCount = channel?.count_mess_unread || 0;

	const handleOpenInvite = () => {
		dispatch(clansActions.toggleInvitePeople({ status: true, channelId: channel.id }));
	};

	const renderChannelLink = () => {
		return (
			<ChannelLink
				ref={channelLinkRef}
				clanId={channel?.clan_id}
				channel={channel}
				key={channel.id}
				createInviteLink={handleOpenInvite}
				isPrivate={channel.channel_private}
				isUnReadChannel={isUnreadChannel}
				numberNotification={unreadMessageCount}
				channelType={channel?.type}
				isActive={isActive}
				permissions={permissions}
			/>
		);
	};

	const renderChannelContent = useMemo(() => {
		if (isCategoryExpanded && channel.type !== ChannelType.CHANNEL_TYPE_VOICE && channel.type !== ChannelType.CHANNEL_TYPE_STREAMING) {
			return (
				<>
					{renderChannelLink()}
					{channel.threads && <ThreadListChannel ref={listThreadRef} threads={channel.threads} isCollapsed={!isCategoryExpanded} />}
					{channelHasPushToTalkFeature && (
						<div>
							<div className="flex flex-col ml-6">
								<div className="flex flex-row items-center h-[34px] relative">
									<span className="absolute top-2 left-0">
										<Icons.ShortCorner />
									</span>
									<div className="ml-6 flex flex-row items-center px-2 mx-2 rounded relative p-1 leading-[24px] dark:hover:text-white hover:text-black text-[16px] dark:font-medium font-semibold dark:text-white text-black ">
										PTT Members
									</div>
								</div>
							</div>
							<UserListVoiceChannel channelID={channel.channel_id ?? ''} channelType={channel?.type} memberList={channelMemberList} />
						</div>
					)}
				</>
			);
		}

		if (isCategoryExpanded && !channelHasPushToTalkFeature) {
			return (
				<>
					{renderChannelLink()}
					<UserListVoiceChannel channelID={channel.channel_id ?? ''} channelType={channel?.type} memberList={channelMemberList} />
				</>
			);
		}

		return channelMemberList.length > 0 ? (
			<>
				{renderChannelLink()}
				{channelHasPushToTalkFeature && (
					<div className="flex flex-col ml-6">
						<div className="flex flex-row items-center h-[34px] relative">
							<span className="absolute top-2 left-0">
								<Icons.ShortCorner />
							</span>
							<div className="ml-6 flex flex-row items-center px-2 mx-2 rounded relative p-1 leading-[24px] dark:hover:text-white hover:text-black text-[16px] dark:font-medium font-semibold dark:text-white text-black ">
								PTT Members
							</div>
						</div>
					</div>
				)}
				<Avatar.Group className="flex gap-3 justify-start items-center px-6">
					{[...channelMemberList].slice(0, 5).map((member, index) => (
						<AvatarUserShort id={member.user_id || ''} key={member.user_id || '' + index} />
					))}
					{channelMemberList && channelMemberList.length > 5 && (
						<Avatar.Counter
							total={channelMemberList?.length - 5 > 50 ? 50 : channelMemberList?.length - 5}
							className="h-6 w-6 dark:text-bgLightPrimary text-bgPrimary ring-transparent dark:bg-bgTertiary bg-bgLightTertiary dark:hover:bg-bgTertiary hover:bg-bgLightTertiary"
						/>
					)}
				</Avatar.Group>
			</>
		) : null;
	}, [
		channel.type,
		channel.threads,
		channel.channel_id,
		isCategoryExpanded,
		channelHasPushToTalkFeature,
		channelMemberList,
		renderChannelLink,
		listThreadRef
	]);

	return <>{renderChannelContent} </>;
};
