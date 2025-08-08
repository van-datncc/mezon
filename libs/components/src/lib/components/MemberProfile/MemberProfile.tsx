import { useColorsRoleById } from '@mezon/core';
import { ChannelMembersEntity } from '@mezon/store';
import { Icons } from '@mezon/ui';
import { EUserStatus, UsersClanEntity, createImgproxyUrl } from '@mezon/utils';
import { ReactNode } from 'react';
import { AvatarImage } from '../../components';
import { useMemberContextMenu } from '../../contexts';
import { UserStatusIconClan } from './IconStatus';

type BaseMemberProfileProps = {
	id: string;
	userMeta?: { status?: string; online: boolean };
	user: ChannelMembersEntity | UsersClanEntity;
	username: string;
	avatar: string;
	isOwner?: boolean;
	userStatus?: ReactNode;
};

export const BaseMemberProfile = ({ id, user, userMeta, username, avatar, isOwner, userStatus }: BaseMemberProfileProps) => {
	const { showContextMenu, openProfileItem, setCurrentUser } = useMemberContextMenu();

	const handleClick = (event: React.MouseEvent) => {
		setCurrentUser(user);
		openProfileItem(event, user);
	};

	const handleContextMenu = (event: React.MouseEvent) => {
		const userTemplate: UsersClanEntity = {
			...user,
			id: id,
			prioritizeName: username,
			clan_avatar: avatar,
			user: {
				...user?.user,
				username: user?.user?.username,
				display_name: user?.user?.display_name,
				avatar_url: user?.user?.avatar_url
			}
		};
		showContextMenu(event, userTemplate);
	};

	const isOffline = userMeta?.status === EUserStatus.INVISIBLE || !userMeta?.online;

	return (
		<div className={`relative group w-full ${isOffline ? 'opacity-50' : ''}`}>
			<div onContextMenu={handleContextMenu} onClick={handleClick} className="cursor-pointer flex items-center gap-[9px] relative">
				<div className="relative">
					<AvatarImage
						alt={username}
						username={user?.user?.username ?? username}
						className="min-w-8 min-h-8 max-w-8 max-h-8"
						classNameText="font-semibold"
						srcImgProxy={createImgproxyUrl(avatar ?? '')}
						src={avatar}
					/>
					<div className="rounded-full right-[-4px] absolute bottom-0 inline-flex items-center justify-center gap-1 p-[3px] text-sm text-theme-primary">
						<UserStatusIconClan status={userMeta?.status} online={userMeta?.online} />
					</div>
				</div>

				<div className="flex flex-col font-medium">
					<ClanUserName userId={user?.id} name={username} isOwner={!!isOwner} />
					<p className="text-theme-primary w-full text-[12px] line-clamp-1 break-all max-w-[176px] flex gap-1 items-center">
						{/* {userVoiceStatus ? (
							<>
								<Icons.Speaker className="text-green-500 !w-3 !h-3" />
								In voice
							</>
						) : (
							userStatus
						)} */}
						{userStatus}
					</p>
				</div>
			</div>
		</div>
	);
};

export function ClanUserName({ name, userId, isOwner }: { name: string; userId: string; isOwner: boolean }) {
	const userRolesClan = useColorsRoleById(userId || '');

	return (
		<span className="one-line text-start " style={{ color: userRolesClan.highestPermissionRoleColor }}>
			{name}

			{isOwner && (
				<button className="w-[14px] h-[14px] ml-1 pt-[2px]">
					<Icons.OwnerIcon />
				</button>
			)}
		</span>
	);
}
