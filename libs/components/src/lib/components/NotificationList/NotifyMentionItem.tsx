import { useChatMessages, useNotification } from '@mezon/core';
import { INotification, selectChannelById, selectClanById, selectMemberClanByUserId } from '@mezon/store';
import { IMessageWithUser } from '@mezon/utils';
import { useSelector } from 'react-redux';
import MessageWithUser from '../MessageWithUser';
export type NotifyMentionProps = {
	notify: INotification;
};

function parseObject(obj: any) {	
	let attachments;
	let mentions;
	let reactions;
	let references;
	try {
		attachments = JSON.parse(obj.attachments)
	} catch(err) {
		attachments = {}
	}
	try {
		mentions = JSON.parse(obj.mentions)
	} catch(err) {
		mentions = {}
	}
	try {
		references = JSON.parse(obj.references)
	} catch(err) {
		references = {}
	}
	try {
		reactions = JSON.parse(obj.reactions)
	} catch(err) {
		reactions = {}
	}
	const parsedObj = { 
		...obj,
		attachments:attachments,
		mentions:mentions,
		reactions:reactions,
		references:references,
	};
	return parsedObj;
}

function NotifyMentionItem({ notify }: NotifyMentionProps) {
	const { deleteNotify } = useNotification();	
	const user = notify.sender_id ? useSelector(selectMemberClanByUserId(notify.sender_id)) : null;
	const channelInfo = notify.content?.channel_id ? useSelector(selectChannelById(notify.content.channel_id)) : null;
	const clanInfo = channelInfo?.clan_id ? useSelector(selectClanById(channelInfo.clan_id)) : null;
	const data = parseObject(notify.content);
	console.log("content", notify.content);
	const { jumpToMessage } = useChatMessages({ channelId:data.channel_id });
	return (
		<div className="flex flex-col gap-2 py-3 px-3 w-full">
			<div className="flex justify-between">
				<div className="flex flex-row items-center gap-2">
					<div>
						{clanInfo?.logo ? (
							<img src={clanInfo.logo} className="rounded-full size-10 object-cover" />
						) : (
							<div>
								{clanInfo?.clan_name && (
									<div className="w-[45px] h-[45px] bg-bgDisable flex justify-center items-center text-contentSecondary text-[20px] rounded-xl">
										{clanInfo.clan_name.charAt(0).toUpperCase()}
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
							{clanInfo?.clan_name} {'>'} {channelInfo?.category_name}
						</div>
					</div>
				</div>
				<button
					className="bg-bgTertiary mr-1 text-contentPrimary rounded-full w-6 h-6 flex items-center justify-center text-[10px]"
					onClick={() => {
						deleteNotify(notify.id);
						jumpToMessage(data.message_id);
					}}
				>
					✕
				</button>
			</div>
			<div className="bg-bgTertiary rounded-[8px] relative group">
				<button
					className="absolute py-1 px-2 bg-bgSecondary top-[10px] right-3 text-[10px] rounded-[6px] transition-all duration-300 group-hover:block hidden"
					onClick={() => {
						jumpToMessage(data.message_id);
					}}					
				>
					Jump
				</button>
				<MessageWithUser
					message={data as IMessageWithUser}
					user={user}
					isMessNotifyMention={true}
					attachments={data.attachments}
					mentions={data.mentions}
					mode={2}
				/>
			</div>
		</div>
	);
}

export default NotifyMentionItem;
