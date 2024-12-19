import { useAuth, useGetPriorityNameFromUserClan } from '@mezon/core';
import { getFirstMessageOfTopic, selectAllUserClans, selectMemberClanByUserId, threadsActions, topicsActions, useAppDispatch } from '@mezon/store';
import { createImgproxyUrl } from '@mezon/utils';
import { safeJSONParse } from 'mezon-js';
import { ApiChannelMessageHeader, ApiSdTopic } from 'mezon-js/dist/api.gen';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AvatarImage } from '../AvatarImage/AvatarImage';
export type TopicProps = {
	readonly topic: ApiSdTopic;
};

function TopicNotificationItem({ topic }: TopicProps) {
	const [subjectTopic, setSubjectTopic] = useState('');
	const dispatch = useAppDispatch();
	const memberClan = useSelector(selectAllUserClans);
	const { userId } = useAuth();
	const userIds = topic.last_sent_message?.repliers;
	const usernames = memberClan
		.filter((profile) => (userIds || []).includes(profile?.user?.id || '') && profile?.user?.id !== userId)
		.map((profile) => profile?.user?.username);
	useEffect(() => {
		if (usernames.length === 0) {
			setSubjectTopic('Topic and you');
		}
		if (usernames.length === 1) {
			setSubjectTopic(`${usernames[0]} and you`);
		}
		if (usernames.length > 1) {
			setSubjectTopic(`${usernames[usernames.length - 1]} and ${usernames.length - 1} others`);
		}
	}, [usernames, userIds]);
	const handleOpenTopic = () => {
		dispatch(topicsActions.setIsShowCreateTopic({ channelId: topic.channel_id as string, isShowCreateTopic: true }));
		dispatch(threadsActions.setIsShowCreateThread({ channelId: topic.channel_id as string, isShowCreateThread: false }));
		dispatch(topicsActions.setCurrentTopicId(topic.id || ''));
		dispatch(getFirstMessageOfTopic(topic.id || ''));
	};

	const allTabProps = {
		messageReplied: topic?.message,
		subject: subjectTopic,
		senderId: topic?.last_sent_message?.sender_id,
		lastMessageTopic: topic?.last_sent_message
	};

	return (
		<div className="dark:bg-bgTertiary bg-transparent rounded-[8px] relative group">
			<button
				className="absolute py-1 px-2 dark:bg-bgSecondary bg-bgLightTertiary bottom-[10px] z-50 right-3 text-[10px] rounded-[6px] transition-all duration-300 group-hover:block hidden"
				onClick={handleOpenTopic}
			>
				Jump
			</button>
			{<AllTabContent {...allTabProps} />}
		</div>
	);
}

export default TopicNotificationItem;

interface IMentionTabContent {
	messageReplied?: ApiChannelMessageHeader;
	subject?: string;
	senderId?: string;
	lastMessageTopic?: ApiChannelMessageHeader;
}

function AllTabContent({ messageReplied, subject, lastMessageTopic }: IMentionTabContent) {
	const messageRl = messageReplied?.content ? safeJSONParse(messageReplied?.content) : null;
	const lastMsgTopic = lastMessageTopic?.content ? safeJSONParse(lastMessageTopic?.content) : null;
	const [senderId, setSubjectTopic] = useState(lastMessageTopic?.sender_id ?? '');
	useEffect(() => {
		setSubjectTopic(lastMessageTopic?.sender_id ?? '');
	}, [lastMessageTopic]);

	const { priorityAvatar } = useGetPriorityNameFromUserClan(senderId || '');
	const userLastSent = useSelector(selectMemberClanByUserId(lastMessageTopic?.sender_id ?? ''));

	return (
		<div className="flex flex-col p-2 bg-[#FFFFFF] dark:bg-[#313338] rounded-lg">
			<div className="flex flex-row items-start p-1 w-full gap-4 rounded-lg bg-[#FFFFFF] dark:bg-[#313338] relative">
				<div className="relative w-11 h-10">
					<AvatarImage
						alt="user avatar"
						className="w-11 h-10 rounded-full border-2 border-[#FFFFFF] dark:border-[#313338] z-10"
						userName={userLastSent?.user?.username}
						srcImgProxy={createImgproxyUrl((priorityAvatar ? priorityAvatar : userLastSent?.user?.avatar_url) ?? '', {
							width: 300,
							height: 300,
							resizeType: 'fit'
						})}
						src={priorityAvatar ? priorityAvatar : userLastSent?.user?.avatar_url}
					/>
					{/* <AvatarImage
						alt="second avatar"
						className="w-8 h-8 rounded-lg border-2 border-[#FFFFFF] dark:border-[#313338] absolute -bottom-1 -right-2 z-0"
						userName="Second User"
						srcImgProxy={createImgproxyUrl((priorityAvatar ? priorityAvatar : userLastSent?.user?.avatar_url) ?? '', {
							width: 300,
							height: 300,
							resizeType: 'fit'
						})}
						src={priorityAvatar ? priorityAvatar : user?.user?.avatar_url || user?.user?.avatar_url}
					/> */}
				</div>
				<div className="h-full w-full">
					<div>
						<div className="text-[12px] font-bold uppercase">{subject}</div>
					</div>
					<div>
						<div className="text-[12px] ">{`Replied to: ${messageRl?.t}`}</div>
					</div>
					<div>
						<div className="text-[13px] ">{`${userLastSent?.user?.username}: ${lastMsgTopic?.t}`}</div>
					</div>
				</div>
			</div>
		</div>
	);
}
