import { useAppNavigation, useJumpToMessage, useNotification } from '@mezon/core';
import {
	INotification,
	referencesActions,
	selectChannelById,
	selectCurrentChannelId,
	selectCurrentClan,
	selectMemberClanByUserId,
} from '@mezon/store';
import { IMessageWithUser } from '@mezon/utils';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MessageAvatar from '../MessageWithUser/MessageAvatar';
import MessageHead from '../MessageWithUser/MessageHead';
import MarkUpOnReply from '../MessageWithUser/MessageReply/MarkUpOnReply';
import { useMessageLine } from '../MessageWithUser/useMessageLine';
export type NotifyMentionProps = {
	readonly notify: INotification;
};

function parseObject(obj: any) {
	let attachments;
	let mentions;
	let reactions;
	let references;
	try {
		attachments = JSON.parse(obj.attachments);
	} catch (err) {
		attachments = {};
	}
	try {
		mentions = JSON.parse(obj.mentions);
	} catch (err) {
		mentions = {};
	}
	try {
		references = JSON.parse(obj.references);
	} catch (err) {
		references = {};
	}
	try {
		reactions = JSON.parse(obj.reactions);
	} catch (err) {
		reactions = {};
	}
	const parsedObj = {
		...obj,
		attachments: attachments,
		mentions: mentions,
		reactions: reactions,
		references: references,
	};
	return parsedObj;
}

function NotifyMentionItem({ notify }: NotifyMentionProps) {
	const dispatch = useDispatch();
	const { deleteNotify } = useNotification();
	const user = useSelector(selectMemberClanByUserId(notify.sender_id || ''));
	const currentClan = useSelector(selectCurrentClan);
	const channelInfo = useSelector(selectChannelById(notify.content.channel_id));
	const data = parseObject(notify.content);
	const { toChannelPage, navigate } = useAppNavigation();
	const { jumpToMessage } = useJumpToMessage();
	const currentChannelId = useSelector(selectCurrentChannelId);

	data.content = JSON.parse(data.content);
	data.update_time = data.create_time;
	const dispatchMessageMention = async () => {
		if (currentChannelId !== data.channel_id) {
			await navigate(toChannelPage(data.channel_id, currentClan?.id ?? ''));
			dispatch(referencesActions.setMessageMentionId(data.message_id));
		} else {
			jumpToMessage(data.message_id);
		}
	};

	return (
		<div className="flex flex-col gap-2 py-3 px-3 w-full">
			<div className="flex justify-between">
				<div className="flex flex-row items-center gap-2">
					<div>
						{currentClan?.logo ? (
							<img
								src={currentClan.logo}
								className="rounded-full size-10 object-cover max-w-10 max-h-10 min-w-10 min-h-10"
								alt={currentClan.logo}
							/>
						) : (
							<div>
								{currentClan?.clan_name && (
									<div className="w-[45px] h-[45px] bg-bgDisable flex justify-center items-center text-contentSecondary text-[20px] rounded-xl">
										{currentClan.clan_name.charAt(0).toUpperCase()}
									</div>
								)}
							</div>
						)}
					</div>
					<div className="flex flex-col gap-1">
						<div className="font-bold text-[16px] cursor-pointer flex gap-x-1">
							# <p className=" hover:underline">{channelInfo?.channel_label}</p>
						</div>
						<div className="text-[10px] uppercase">
							{currentClan?.clan_name} {'>'} {channelInfo?.category_name}
						</div>
					</div>
				</div>
				<button
					className="dark:bg-bgTertiary bg-bgLightModeButton mr-1 dark:text-contentPrimary text-colorTextLightMode rounded-full w-6 h-6 flex items-center justify-center text-[10px]"
					onClick={() => {
						deleteNotify(notify.id);
					}}
				>
					✕
				</button>
			</div>
			<div className="dark:bg-bgTertiary bg-transparent rounded-[8px] relative group">
				<button
					className="absolute py-1 px-2 dark:bg-bgSecondary bg-bgLightModeButton top-[10px] z-50 right-3 text-[10px] rounded-[6px] transition-all duration-300 group-hover:block hidden"
					onClick={() => {
						dispatchMessageMention();
					}}
				>
					Jump
				</button>

				<MentionTabContent message={data} />
			</div>
		</div>
	);
}

export default NotifyMentionItem;

interface IMentionTabContent {
	message: IMessageWithUser;
}

function MentionTabContent({ message }: IMentionTabContent) {
	const dispatch = useDispatch();
	const { mentions } = useMessageLine(message.content.t ?? '');
	const getIdMessageToJump = useCallback(
		(idRefMessage: string, e: React.MouseEvent<HTMLDivElement | HTMLSpanElement>) => {
			e.stopPropagation();
			if (idRefMessage) {
				dispatch(referencesActions.setIdMessageToJump(idRefMessage));
				dispatch(referencesActions.setIdReferenceMessageReply(''));
			}
		},
		[dispatch],
	);
	return (
		<>
			<div className="justify-start gap-4 inline-flex w-full relative h-fit overflow-visible pr-12">
				<MessageAvatar user={user} message={message} isCombine={false} isEditing={isEditing} isShowFull={isShowFull} />
				<div className="w-full relative h-full">
					<MessageHead message={message} user={user} isCombine={isCombine} isShowFull={isShowFull} />
					<div className="justify-start items-center inline-flex w-full h-full pt-[2px] textChat">
						<div className={messageContentClass} style={{ wordBreak: 'break-word' }}>
							<MarkUpOnReply onClickToMove={(e) => getIdMessageToJump(message.id, e)} mention={mentions} />
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
