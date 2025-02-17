import { selectMemberClanByGoogleId, selectMemberClanByUserId2, useAppSelector } from '@mezon/store';
import { Icons } from '@mezon/ui';
import { IChannelMember, createImgproxyUrl, getAvatarForPrioritize } from '@mezon/utils';
import { useCallback, useEffect, useState } from 'react';
import { AvatarImage } from '../../../AvatarImage/AvatarImage';

export type VoiceChannelUsersProps = {
	readonly memberJoin: IChannelMember[];
	readonly memberMax?: number;
	readonly isShowChat?: boolean;
};

export function VoiceChannelUsers({ memberJoin = [], memberMax, isShowChat }: VoiceChannelUsersProps) {
	const [displayedMembers, setDisplayedMembers] = useState<IChannelMember[]>(memberJoin);
	const [remainingCount, setRemainingCount] = useState(0);

	const handleSizeWidth = useCallback(() => {
		const membersToShow = [...memberJoin];
		let maxMembers = memberMax ?? 7;

		if (window.innerWidth < 1000) {
			maxMembers = isShowChat ? 1 : 2;
		} else if (window.innerWidth < 1200) {
			maxMembers = isShowChat ? 2 : 3;
		} else if (window.innerWidth < 1300) {
			maxMembers = isShowChat ? 3 : 4;
		} else if (window.innerWidth < 1400) {
			maxMembers = isShowChat ? 4 : 5;
		} else if (window.innerWidth < 1700) {
			maxMembers = isShowChat ? 5 : 6;
		}

		const extraMembers = membersToShow.length - maxMembers;

		setDisplayedMembers(membersToShow.slice(0, maxMembers));
		setRemainingCount(extraMembers > 0 ? extraMembers : 0);
	}, [memberJoin, memberMax, isShowChat]);

	useEffect(() => {
		handleSizeWidth();
		window.addEventListener('resize', handleSizeWidth);

		return () => {
			window.removeEventListener('resize', handleSizeWidth);
		};
	}, [handleSizeWidth]);

	return (
		<div className="flex items-center gap-2">
			{displayedMembers.map((item: IChannelMember) => (
				<div key={item.id} className="flex items-center">
					<UserItem user={item} />
				</div>
			))}
			{remainingCount > 0 && (
				<div className="w-14 h-14 rounded-full bg-gray-300 text-black font-medium flex items-center justify-center">+{remainingCount}</div>
			)}
		</div>
	);
}

function UserItem({ user }: { user: IChannelMember }) {
	const member = useAppSelector((state) => selectMemberClanByGoogleId(state, user.user_id ?? ''));
	const userStream = useAppSelector((state) => selectMemberClanByUserId2(state, user.user_id ?? ''));
	const username = member ? member?.user?.username : userStream?.user?.username;
	const clanAvatar = member ? member?.clan_avatar : userStream?.clan_avatar;
	const avatarUrl = member ? member?.user?.avatar_url : userStream?.user?.avatar_url;
	const avatar = getAvatarForPrioritize(clanAvatar, avatarUrl);

	return (
		<div className="w-14 h-14 rounded-full">
			<div className="w-14 h-14">
				{member || userStream ? (
					<AvatarImage
						alt={username || ''}
						username={username}
						className="min-w-14 min-h-14 max-w-14 max-h-14"
						srcImgProxy={createImgproxyUrl(avatar ?? '', { width: 300, height: 300, resizeType: 'fit' })}
						src={avatar}
					/>
				) : (
					<Icons.AvatarUser />
				)}
			</div>
		</div>
	);
}
