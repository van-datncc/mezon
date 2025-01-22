import { IMessageWithUser, createImgproxyUrl } from '@mezon/utils';
import { ChannelStreamMode } from 'mezon-js';
import { memo, useMemo } from 'react';
import { AvatarImage } from '../AvatarImage/AvatarImage';
import usePendingNames from './usePendingNames';

type IMessageAvatarProps = {
	message: IMessageWithUser;
	isEditing?: boolean;
	mode?: number;
	onClick?: (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => void;
};

const MessageAvatar = ({ message, mode, onClick }: IMessageAvatarProps) => {
	const clanAvatar = message?.clan_avatar;
	const generalAvatar = message?.avatar;
	const { pendingUserAvatar, pendingClanAvatar } = usePendingNames(
		message,
		undefined,
		undefined,
		undefined,
		undefined,
		undefined,
		undefined,
		message?.avatar,
		generalAvatar,
		clanAvatar,
		message?.clan_avatar
	);

	const avatarUrl = useMemo(() => {
		if (mode === ChannelStreamMode.STREAM_MODE_THREAD || mode === ChannelStreamMode.STREAM_MODE_CHANNEL) {
			return clanAvatar || pendingClanAvatar || pendingUserAvatar;
		}

		return pendingUserAvatar || message?.avatar || '';
	}, [mode, clanAvatar, pendingClanAvatar, pendingUserAvatar, message?.avatar]);

	return (
		<AvatarImage
			onContextMenu={(e) => {
				e.preventDefault();
				e.stopPropagation();
			}}
			alt={message.username ?? ''}
			userName={message.username}
			data-popover-target="popover-content"
			srcImgProxy={createImgproxyUrl(avatarUrl, { width: 100, height: 100, resizeType: 'fit' })}
			src={avatarUrl}
			className="min-w-10 min-h-10"
			classNameText="font-semibold"
			isAnonymous={message.sender_id === process.env.NX_CHAT_APP_ANNONYMOUS_USER_ID}
			onClick={onClick}
		/>
	);
};

export default memo(MessageAvatar, (prev, cur) => prev.message?.sender_id === cur.message?.sender_id);
