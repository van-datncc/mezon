import { AvatarImage, ModalUserProfile } from '@mezon/components';
import { useGetPriorityNameFromUserClan, useOnClickOutside } from '@mezon/core';
import { HEIGHT_PANEL_PROFILE, HEIGHT_PANEL_PROFILE_DM, IMessageWithUser } from '@mezon/utils';
import { ChannelStreamMode } from 'mezon-js';
import { memo, useMemo, useRef, useState } from 'react';
import { useMessageParser } from './useMessageParser';
import usePendingNames from './usePendingNames';

type IMessageAvatarProps = {
	message: IMessageWithUser;
	isCombine: boolean;
	isEditing?: boolean;
	isShowFull?: boolean;
	mode?: number;
	allowDisplayShortProfile: boolean;
};

const MessageAvatar = ({ message, isCombine, isEditing, isShowFull, mode, allowDisplayShortProfile }: IMessageAvatarProps) => {
	const { senderId, username, avatarSender, userClanAvatar, userClanNickname, userDisplayName } = useMessageParser(message);
	const { clanAvatar, generalAvatar } = useGetPriorityNameFromUserClan(message.sender_id);
	const { pendingUserAvatar, pendingClanAvatar } = usePendingNames(
		message,
		undefined,
		undefined,
		undefined,
		undefined,
		undefined,
		undefined,
		avatarSender,
		generalAvatar,
		clanAvatar,
		userClanAvatar
	);

	const { messageHour } = useMessageParser(message);
	const [isShowPanelChannel, setIsShowPanelChannel] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [positionTop, setPositionTop] = useState<number | null>(null);
	const panelRef = useRef<HTMLDivElement | null>(null);

	const isAnonymous = useMemo(() => senderId === process.env.NX_CHAT_APP_ANNONYMOUS_USER_ID, [senderId]);
	useOnClickOutside(panelRef, () => setIsShowPanelChannel(false));

	if (message.references?.length === 0 && isCombine && !isShowFull) {
		return (
			<div className="w-10 flex items-center justify-center min-w-10">
				<div className="hidden group-hover:text-zinc-400 group-hover:text-[10px] group-hover:block cursor-default">{messageHour}</div>
			</div>
		);
	}

	const handleOpenShortUser = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
		const heightPanel = mode === ChannelStreamMode.STREAM_MODE_CHANNEL ? HEIGHT_PANEL_PROFILE : HEIGHT_PANEL_PROFILE_DM;
		if (window.innerHeight - e.clientY > heightPanel) {
			setPositionTop(e.clientY);
		} else {
			setPositionTop(window.innerHeight - heightPanel);
		}
		setIsShowPanelChannel(!isShowPanelChannel);
	};
	return (
		<>
			{isShowPanelChannel && allowDisplayShortProfile && (
				<div
					className={`fixed z-50 le left-[406px] max-[480px]:left-16 max-[700px]:left-9 dark:bg-black bg-gray-200 w-[300px] max-w-[89vw] rounded-lg flex flex-col  duration-300 ease-in-out`}
					style={{ top: `${positionTop}px` }}
					ref={panelRef}
				>
					<ModalUserProfile
						userID={senderId}
						classBanner="rounded-tl-lg rounded-tr-lg h-[105px]"
						message={message}
						mode={mode}
						positionType={''}
						avatar={userClanAvatar || pendingUserAvatar}
						name={userClanNickname || userDisplayName || username}
						isDM={mode === ChannelStreamMode.STREAM_MODE_CHANNEL ? true : false}
					/>
				</div>
			)}

			<AvatarImage
				onContextMenu={(e) => {
					e.preventDefault();
					e.stopPropagation();
				}}
				alt={username ?? ''}
				userName={username}
				data-popover-target="popover-content"
				src={
					(mode === ChannelStreamMode.STREAM_MODE_CHANNEL
						? pendingClanAvatar
							? pendingClanAvatar
							: pendingUserAvatar
						: pendingUserAvatar) || avatarSender
				}
				className="min-w-10 min-h-10"
				classNameText="font-semibold"
				isAnonymous={isAnonymous}
				onClick={handleOpenShortUser}
			/>
		</>
	);
};

export default memo(MessageAvatar);
