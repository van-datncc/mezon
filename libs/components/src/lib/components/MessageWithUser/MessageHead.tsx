import { useShowName } from '@mezon/core';
import { selectMemberClanByUserId2, useAppSelector } from '@mezon/store';
import { IMessageWithUser, convertTimeString } from '@mezon/utils';
import { ChannelStreamMode } from 'mezon-js';
import { memo } from 'react';
import usePendingNames from './usePendingNames';

type IMessageHeadProps = {
	message: IMessageWithUser;
	mode?: number;
	onClick?: (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => void;
};

const MessageHead = ({ message, mode, onClick }: IMessageHeadProps) => {
	const messageTime = convertTimeString(message?.create_time as string);
	const userClan = useAppSelector((state) => selectMemberClanByUserId2(state, message?.sender_id));
	const usernameSender = userClan?.user?.username;
	const clanNick = userClan?.clan_nick;
	const displayName = userClan?.user?.display_name;

	const { pendingClannick, pendingDisplayName, pendingUserName } = usePendingNames(
		message,
		clanNick ?? '',
		displayName ?? '',
		usernameSender ?? '',
		message.clan_nick ?? '',
		message?.display_name ?? '',
		message?.username ?? ''
	);

	const nameShowed = useShowName(
		clanNick ? clanNick : (pendingClannick ?? ''),
		pendingDisplayName ?? '',
		pendingUserName ?? '',
		message?.sender_id ?? ''
	);

	return (
		<div className="relative group">
			<div className="flex-row items-center w-full gap-4 flex">
				<div
					className="text-base text-textLightUserName font-medium tracking-normal cursor-pointer break-all username hover:underline"
					onClick={onClick}
					role="button"
					style={{ letterSpacing: '-0.01rem' }}
				>
					{mode === ChannelStreamMode.STREAM_MODE_CHANNEL ? nameShowed : message?.display_name ? message?.display_name : message?.username}
				</div>
				<div className=" dark:text-zinc-400 text-colorTextLightMode text-[10px] cursor-default">{messageTime}</div>
			</div>
		</div>
	);
};

export default memo(MessageHead, (prev, cur) => prev.message?.id === cur.message?.id && prev.message?.sender_id === cur.message?.sender_id);
