import { Icons } from '@mezon/ui';
import { EUserStatus, UserStatus } from '@mezon/utils';
import { StatusUser2 } from '../StatusUser';

export const UserStatusIconDM = ({ status }: { status?: EUserStatus }) => {
	switch (status) {
		case EUserStatus.ONLINE:
			return <StatusUser2 status="online" />;
		case EUserStatus.IDLE:
			return (
				<span className="flex justify-end items-end h-full">
					<Icons.DarkModeIcon className="text-[#F0B232] -rotate-90 w-3 h-3 bg-theme-primary p-[2px] rounded-full" />
				</span>
			);
		case EUserStatus.DO_NOT_DISTURB:
			return <StatusUser2 status="dnd" />;
		case EUserStatus.INVISIBLE:
			return (
				<span className="flex justify-end items-end h-full">
					<Icons.OfflineStatus className=" w-3 h-3 bg-theme-primary p-[2px] rounded-full" />
				</span>
			);
		default:
			return <StatusUser2 status="online" />;
	}
};

export const UserStatusIcon = ({ status }: { status?: EUserStatus }) => {
	switch (status) {
		case EUserStatus.ONLINE:
			return <StatusUser2 status="online" className="w-5 h-5 p-1" />;
		case EUserStatus.IDLE:
			return <Icons.DarkModeIcon className="text-[#F0B232] -rotate-90 w-5 h-5 bg-theme-primary p-1 rounded-full" />;
		case EUserStatus.DO_NOT_DISTURB:
			return <StatusUser2 status="dnd" className="w-5 h-5 p-1" />;
		case EUserStatus.INVISIBLE:
			return <Icons.OfflineStatus className="w-5 h-5 bg-theme-primary p-1 rounded-full" />;
		default:
			return <StatusUser2 status="online" className="w-5 h-5 p-1" />;
	}
};

export const UserStatusIconClan = ({ status, online }: { status?: EUserStatus | string; online?: boolean }) => {
	const normalizedStatus = typeof status === 'object' && status !== null ? (status as UserStatus).status?.toUpperCase() : status?.toUpperCase();

	if (!online) {
		return <StatusUser2 status="offline" />;
	}

	switch (normalizedStatus) {
		case 'IDLE':
			return <Icons.DarkModeIcon className="text-[#F0B232] -rotate-90 w-[10px] h-[10px]" />;
		case 'DO NOT DISTURB':
			return <StatusUser2 status="dnd" />;
		case 'INVISIBLE':
			return <StatusUser2 status="offline" />;
		case 'ONLINE':
			return <StatusUser2 status="online" />;
	}

	if (online) {
		return <StatusUser2 status="online" />;
	}

	return <Icons.OfflineStatus />;
};
