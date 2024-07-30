import { useSendInviteMessage, useSilentSendMess } from '@mezon/core';
import { DirectEntity, UsersClanEntity } from '@mezon/store';
import { ChannelStreamMode, ChannelType } from 'mezon-js';
import { useEffect, useState } from 'react';
import { AvatarImage } from '../AvatarImage/AvatarImage';

type ItemPorp = {
	url: string;
	dmGroup?: DirectEntity;
	user?: UsersClanEntity;
	isSent?: boolean;
	onSend: (dmGroup: DirectEntity) => void;
};
const ListMemberInviteItem = (props: ItemPorp) => {
	const { dmGroup, isSent, url, onSend, user } = props;
	const [isInviteSent, setIsInviteSent] = useState(isSent);
	const { sendInviteMessage } = useSendInviteMessage();
	const { createSilentSendMess } = useSilentSendMess();
	const directMessageWithUser = async (userId: string) => {
		const response = await createSilentSendMess(userId);
		if (response.channel_id) {
			sendInviteMessage(url, response.channel_id, ChannelStreamMode.STREAM_MODE_DM);
		}
	};

	const handleButtonClick = async (directParamId?: string, type?: number, userId?: string) => {
		setIsInviteSent(true);
		if (userId) {
			directMessageWithUser(userId);
		}
		if (directParamId && dmGroup) {
			let channelMode = 0;
			if (type === ChannelType.CHANNEL_TYPE_DM) {
				channelMode = ChannelStreamMode.STREAM_MODE_DM;
			}
			if (type === ChannelType.CHANNEL_TYPE_GROUP) {
				channelMode = ChannelStreamMode.STREAM_MODE_GROUP;
			}
			sendInviteMessage(url, directParamId, channelMode);
			onSend(dmGroup);
		}
	};
	useEffect(() => {
		setIsInviteSent(isSent);
	}, [isSent]);
	return dmGroup ? (
		<ItemInviteDM 
			channelID={dmGroup.channel_id}
			type={Number(dmGroup.type)}
			avatar={dmGroup.channel_avatar?.at(0)}
			label={dmGroup.channel_label}
			isInviteSent={isInviteSent}
			onHandle={() => handleButtonClick(dmGroup.channel_id || '', dmGroup.type || 0)}
			userName={dmGroup.usernames}
		/>
	) : (
		<ItemInviteUser 
			userId={user?.id}
			avatar={user?.user?.avatar_url}
			displayName={user?.user?.display_name}
			userName={user?.user?.username}
			isInviteSent={isInviteSent}
			onHandle={() => handleButtonClick('', 0, user?.id)}
		/>
	);
};
export default ListMemberInviteItem;

type ItemInviteDMProps = {
	channelID?: string;
	type?: number;
	avatar?: string;
	label?: string;
	isInviteSent?: boolean;
	userName?: string;
	onHandle: () => void;
}

const ItemInviteDM = (props: ItemInviteDMProps) => {
	const {channelID='', type='', avatar='', label='', isInviteSent=false, userName='', onHandle=()=>{}} = props;
	return (
		<div key={channelID} className="flex items-center justify-between h-14">
			<AvatarImage
				alt={userName}
				userName={userName}
				className="min-w-10 min-h-10 max-w-10 max-h-10"
				src={type === ChannelType.CHANNEL_TYPE_GROUP ? '/assets/images/avatar-group.png' : avatar}
			/>
			<p style={{ marginRight: 'auto' }} className="pl-[10px] max-w-full overflow-hidden text truncate">
				{label}
			</p>
			<button
				onClick={onHandle}
				disabled={isInviteSent}
				className={
					isInviteSent
						? 'bg-gray-400 text-gray-700 cursor-not-allowed border border-solid border-gray-400 rounded-[5px] py-[5px] px-[10px]'
						: 'font-sans font-normal text-[16px] bg-blue-200 hover:text-blue-300 text-blue-700 border border-solid border-green-500 rounded-[5px] py-[5px] px-[29px]'
				}
			>
				{isInviteSent ? 'Sent' : 'Invite'}
			</button>
		</div>
	)
}

type ItemInviteUserProps = {
	userId?: string;
	avatar?: string;
	displayName?: string;
	userName?: string;
	isInviteSent?: boolean;
	onHandle?: () => void;
}

const ItemInviteUser = (props: ItemInviteUserProps) => {
	const {userId='', avatar='', displayName='', userName='', isInviteSent=false, onHandle=()=>{}} = props;
	return (
		<div key={userId} className="flex items-center justify-between h-14">
			<AvatarImage
				alt={userName}
				userName={userName}
				className="min-w-10 min-h-10 max-w-10 max-h-10"
				src={avatar}
			/>
			<p style={{ marginRight: 'auto' }} className="pl-[10px]">
				{displayName}
			</p>
			<button
				onClick={onHandle}
				disabled={isInviteSent}
				className={
					isInviteSent
						? 'bg-gray-400 text-gray-700 cursor-not-allowed border border-solid border-gray-400 rounded-[5px] py-[5px] px-[10px]'
						: 'font-sans font-normal text-[16px] bg-blue-200 hover:text-blue-300 text-blue-700 border border-solid border-green-500 rounded-[5px] py-[5px] px-[29px]'
				}
			>
				{isInviteSent ? 'Sent' : 'Invite'}
			</button>
		</div>
	)
}