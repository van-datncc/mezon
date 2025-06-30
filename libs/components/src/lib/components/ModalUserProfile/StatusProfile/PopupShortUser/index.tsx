import { useFriends } from '@mezon/core';
import { ChannelMembersEntity } from '@mezon/utils';
import ItemPanel from '../../../PanelChannel/ItemPanel';

export const PopupFriend = ({ user, showPopupLeft }: { user: ChannelMembersEntity | null; showPopupLeft?: boolean }) => {
	const { deleteFriend } = useFriends();
	return (
		<div
			className={`absolute top-0  rounded-lg bg-theme-surface shadow w-[165px] p-2 z-[1] ${showPopupLeft ? 'right-9' : 'sbm:left-9 right-9'}`}
			onClick={() => {
				if (user) {
					deleteFriend(user?.user?.username || '', user?.user?.id || '');
				}
			}}
		>
			<ItemPanel children="Remove Friend" />
		</div>
	);
};

type PopupOptionProps = {
	showPopupLeft?: boolean;
	isMe: boolean;
};

export const PopupOption = ({ showPopupLeft, isMe }: PopupOptionProps) => {
	return (
		<div
			className={`absolute top-0 dark:bg-bgProfileBody bg-gray-100 rounded-sm shadow w-[165px] p-2 z-[1] ${showPopupLeft ? 'right-9' : 'sbm:left-9 right-9'}`}
		>
			{!showPopupLeft && <ItemPanel children="View Full Profile" />}
			{!isMe && (
				<>
					<ItemPanel children="Block" danger />
					<ItemPanel children="Report User Profile" danger />
				</>
			)}
		</div>
	);
};
