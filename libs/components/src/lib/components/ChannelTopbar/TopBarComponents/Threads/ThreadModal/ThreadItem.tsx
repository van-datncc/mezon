import { useAppNavigation, useChannelMembers } from '@mezon/core';
import { ChannelType } from 'mezon-js';
import { ChannelsEntity, channelMembersActions, selectMemberByUserId, useAppDispatch } from '@mezon/store';
import { convertTimeString } from '@mezon/utils';
import { Avatar } from 'flowbite-react';
import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import MessageLine from '../../../../MessageWithUser/MessageLine';
import { useMessageSender } from '../../../../MessageWithUser/useMessageSender';

type ThreadItemProps = {
	thread: ChannelsEntity;
	setIsShowThread: React.Dispatch<React.SetStateAction<boolean>>;
};

const ThreadItem = ({ thread, setIsShowThread }: ThreadItemProps) => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const user = useSelector(selectMemberByUserId(thread?.last_sent_message?.sender_id as string));

	const { toChannelPage } = useAppNavigation();
	const { avatarImg, username } = useMessageSender(user);
	const { groupMembers, remainingMember } = useChannelMembers();

	const timeMessage = useMemo(() => {
		if (thread && thread.last_sent_message && thread.last_sent_message.timestamp) {
			const timestamp = new Date(parseInt(thread.last_sent_message.timestamp) * 1000);
			return convertTimeString(timestamp.toISOString());
		}
	}, [thread]);

	const handleLinkThread = (channelId: string, clanId: string) => {
		navigate(toChannelPage(channelId, clanId));
		setIsShowThread(false);
	};

	useEffect(() => {
		dispatch(
			channelMembersActions.fetchChannelMembers({ clanId: '', channelId: thread.channel_id || '', channelType: ChannelType.CHANNEL_TYPE_TEXT }),
		);
	}, [dispatch, thread.channel_id]);

	return (
		<div
			onClick={() => handleLinkThread(thread.channel_id as string, thread.clan_id || '')}
			className="p-4 mb-2 cursor-pointer rounded-lg h-[72px] bg-[#535353] border border-[#535353] hover:border hover:border-[#6A6A6A]"
		>
			<div className="flex flex-row justify-between items-center">
				<div className="flex flex-col gap-1">
					<p className="text-base font-semibold leading-5">{thread?.channel_label}</p>
					{thread?.last_sent_message ? (
						<div className="flex flex-row items-center h-6">
							<Avatar img={avatarImg} rounded size={'xs'} theme={{ root: { size: { xs: 'w-4 h-4' } } }} className="mr-2" />
							<span className="text-[#17AC86] text-sm font-semibold leading-4">{username}:&nbsp;</span>
							<div className="overflow-hidden h-6 max-w-[140px]">
								<MessageLine line={JSON.parse(thread.last_sent_message.content).t} />
							</div>
							<span className="text-xs font-medium leading-4 ml-2">•&nbsp;{timeMessage}</span>
						</div>
					) : (
						<div className="flex flex-row items-center">
							<span className="text-sm font-medium leading-4 mr-2">No recent messages</span>
						</div>
					)}
				</div>
				<div className="w-[120px]">
					<Avatar.Group className="flex gap-3 justify-end">
						{groupMembers?.map((member) => <Avatar key={member.id} img={member.user?.avatar_url} rounded size="xs" />)}
						{remainingMember && remainingMember.length > 0 && <Avatar.Counter total={remainingMember?.length} className="h-6 w-6" />}
					</Avatar.Group>
				</div>
			</div>
		</div>
	);
};

export default ThreadItem;
