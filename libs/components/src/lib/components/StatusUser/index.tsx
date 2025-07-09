import { selectDmGroupCurrentId, selectIsUserTypingInChannel, useAppSelector } from '@mezon/store';
import { Icons } from '@mezon/ui';
import { EUserStatus } from '@mezon/utils';
import { ChannelType } from 'mezon-js';
import { memo } from 'react';
import { useSelector } from 'react-redux';
import { directMessageValueProps } from '../DmList/DMListItem';
import { UserStatusIconDM } from '../MemberProfile';

type StatusUserProps = {
	status?: { status?: boolean; isMobile?: boolean };
	isMemberDMGroup?: boolean;
	isMemberChannel?: boolean;
	isListDm?: boolean;
	directMessageValue?: directMessageValueProps;
	userId?: string;
	isTyping?: boolean;
	sizeStatusIcon?: string;
	customStatus?: EUserStatus;
	isDM?: boolean;
	currentChannelID?: string;
};

const DMStatusUser = (props: StatusUserProps) => {
	const { customStatus, status, isMemberDMGroup, isListDm, directMessageValue, userId = '', isTyping = true, sizeStatusIcon } = props;

	const currentDMChannelID = useSelector(selectDmGroupCurrentId);
	const isTypingInDM = useAppSelector((state) => selectIsUserTypingInChannel(state, currentDMChannelID || '', userId));
	const isTypingInDirectMessage = useAppSelector((state) =>
		selectIsUserTypingInChannel(state, directMessageValue?.dmID || '', directMessageValue?.userId)
	);

	const checkDmGroup = Number(directMessageValue?.type) === ChannelType.CHANNEL_TYPE_GROUP;
	let checkTypingUser = false;

	if (isMemberDMGroup) {
		checkTypingUser = isTypingInDM;
	} else if (isListDm) {
		checkTypingUser = isTypingInDirectMessage;
	}

	if (checkDmGroup) {
		return isTyping && checkTypingUser ? renderTypingIndicator(checkTypingUser) : null;
	}

	return (
		<span
			className={`absolute bottom-0 inline-flex items-center justify-center gap-1 p-[3px] text-sm  text-theme-primary ${
				checkTypingUser ? 'rounded-lg -right-2' : 'rounded-full right-[-4px]'
			}`}
		>
			{renderStatusIcon({ isTyping, checkTypingUser, status, customStatus, sizeStatusIcon })}
		</span>
	);
};

const renderTypingIndicator = (checkTypingUser: boolean) => (
	<span
		className={`absolute bottom-0 inline-flex items-center justify-center gap-1 p-[3px] text-sm text-theme-primary ${
			checkTypingUser ? 'rounded-lg -right-2' : 'rounded-full right-[-4px]'
		}`}
	>
		<Icons.IconLoadingTyping bgFill="bg-colorSuccess" />
	</span>
);

const renderStatusIcon = ({
	isTyping,
	checkTypingUser,
	status,
	customStatus,
	sizeStatusIcon
}: {
	isTyping: boolean;
	checkTypingUser: boolean;
	status?: { status?: boolean; isMobile?: boolean };
	customStatus?: EUserStatus;
	sizeStatusIcon?: string;
}) => {
	if (isTyping && checkTypingUser) {
		return <Icons.IconLoadingTyping bgFill="bg-colorSuccess" />;
	}

	if (status?.status === false) {
		return <StatusUser2 status="offline" />;
	}

	if (status?.status) {
		if (customStatus) {
			return <UserStatusIconDM status={customStatus} />;
		}

		if (status?.isMobile) {
			return <Icons.IconMobileDevice defaultSize="w-3 h-3" />;
		}

		return <StatusUser2 status="online" />;
	}

	return <Icons.OfflineStatus defaultSize={sizeStatusIcon} />;
};

const StatusUser = (props: StatusUserProps) => {
	return <DMStatusUser {...props} />;
};

export default memo(StatusUser);

type Status = 'online' | 'idle' | 'dnd' | 'offline';

const statusColors: Record<Status, string> = {
	online: 'bg-green-500',
	idle: 'bg-yellow-500',
	dnd: 'bg-red-500',
	offline: 'bg-gray-400'
};

export const StatusUser2: React.FC<{ status: Status }> = ({ status }) => {
	return (
		<span className="absolute bottom-0 right-0 w-[12px] h-[12px] status-user-background rounded-full p-[2px]">
			<span className={`block w-full h-full rounded-full ${statusColors[status]} relative`}></span>
		</span>
	);
};
