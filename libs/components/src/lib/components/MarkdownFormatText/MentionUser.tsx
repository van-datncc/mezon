import { useEscapeKey, useOnClickOutside } from '@mezon/core';
import {
	// selectAllChannelMemberIds,
	selectAllRoleIds,
	selectChannelMemberByUserIds,
	selectCurrentChannel,
	selectUserRemovedByChannelId,
	selectUserRemovedByClanId,
	useAppSelector
} from '@mezon/store';
import { MouseButton, getNameForPrioritize } from '@mezon/utils';
import { ChannelStreamMode } from 'mezon-js';
import { memo, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import ShortUserProfile from '../ShortUserProfile/ShortUserProfile';

type ChannelHashtagProps = {
	tagUserName?: string;
	tagUserId?: string;
	mode?: number;
	isJumMessageEnabled: boolean;
	isTokenClickAble: boolean;
	tagRoleName?: string;
	tagRoleId?: string;
};

enum MentionType {
	HERE = 'HERE',
	ROLE_EXIST = 'ROLE_EXIST',
	ROLE_NOT_EXIST = 'ROLE_NOT_EXIST',
	USER_EXIST = 'USER_EXIST',
	USER_NOT_EXIST = 'USER_NOT_EXIST'
}

type UserProfilePopupProps = {
	userID: string;
	channelId?: string;
	mode?: number;
	positionLeft: number;
	positionTop: number;
	positionBottom: boolean;
};

const MentionUser = ({ tagUserName, mode, isJumMessageEnabled, isTokenClickAble, tagUserId, tagRoleName, tagRoleId }: ChannelHashtagProps) => {
	console.log('mode: ', mode);

	const allRoleIds = useSelector(selectAllRoleIds);
	const currentChannel = useSelector(selectCurrentChannel);

	const isPrivateChannel = useMemo(() => {
		if (currentChannel?.channel_private === 1) {
			return true;
		} else {
			return false;
		}
	}, [currentChannel?.channel_private]);
	console.log('isPrivateChannel: ', isPrivateChannel);

	const currentChannelId = useMemo(() => {
		return currentChannel?.channel_id;
	}, [currentChannel?.id]);
	console.log('currentChannelId: ', currentChannelId);

	const userRemoveIdInPrivateChannel = useSelector(selectUserRemovedByChannelId(currentChannel?.id ?? ' '));
	const userRemoveIdInPublicChannel = useSelector(selectUserRemovedByClanId(currentChannel?.clan_id ?? ' '));

	// const userRemove = useMemo(() => {
	// 	if (userRemoveIdInPrivateChannel === userRemoveIdInPublicChannel) {
	// 		return userRemoveIdInPrivateChannel;
	// 	} else if (userRemoveIdInPrivateChannel === null && userRemoveIdInPublicChannel) {
	// 		return userRemoveIdInPublicChannel;
	// 	}
	// }, [userRemoveIdInPrivateChannel, userRemoveIdInPublicChannel]);

	// console.log('userRemove', userRemove);

	// const getUserInPrivate = useAppSelector((state) =>
	// 	selectChannelMemberByUserIds(state, currentChannelId ?? '', userRemove ?? '', mode === ChannelStreamMode.STREAM_MODE_CHANNEL ? '' : '1')
	// )[0];

	// console.log('getUserByUserId', getUserByUserId);

	// const allUserIdsInChannel = useAppSelector((state) => selectAllChannelMemberIds(state, currentChannelId as string));
	// console.log('allUserIds :', allUserIdsInChannel);

	// const checkUserIsExist = useMemo(() => {
	// 	return allUserIdsInChannel.indexOf(tagUserId ?? '') !== -1;
	// }, [allUserIdsInChannel, tagUserId]);

	// console.log('checkUserIsExist :', checkUserIsExist);

	const checkRoleIsExist = useMemo(() => {
		return allRoleIds.includes(tagRoleId ?? '');
	}, [allRoleIds, tagRoleId]);

	const displayToken = useMemo(() => {
		if (tagRoleId && checkRoleIsExist) {
			return {
				display: tagRoleName,
				type: MentionType.ROLE_EXIST
			};
		}
		if (tagRoleId && !checkRoleIsExist) {
			return {
				display: '@unknownrole',
				type: MentionType.ROLE_NOT_EXIST
			};
		}
		if (tagUserName === '@here') {
			return {
				display: '@here',
				type: MentionType.HERE
			};
		}
		// if (tagUserId === userRemove && tagUserName !== '@here') {
		// 	return {
		// 		display: '@unknownuser',
		// 		type: MentionType.USER_NOT_EXIST
		// 	};
		// }
		if (tagUserId && tagUserName !== '@here') {
			return {
				display: tagUserName,
				type: MentionType.USER_EXIST
			};
		}
	}, [tagUserName, tagRoleName, tagUserId, checkRoleIsExist, tagRoleId]);

	const panelRef = useRef<HTMLButtonElement>(null);

	const dispatchUserIdToShowProfile = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.stopPropagation();
		e.preventDefault();
	};

	const [showProfileUser, setIsShowPanelChannel] = useState(false);
	const [positionBottom, setPositionBottom] = useState(false);
	const [positionTop, setPositionTop] = useState(0);
	const [positionLeft, setPositionLeft] = useState(0);

	const handleMouseClick = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
		if (event.button === MouseButton.LEFT && tagUserName !== '@here') {
			setIsShowPanelChannel(true);
			const clickY = event.clientY;
			const windowHeight = window.innerHeight;
			const distanceToBottom = windowHeight - clickY;
			const windowWidth = window.innerWidth;
			const elementTagName = event.target;
			if (elementTagName instanceof HTMLElement) {
				const positionRight = elementTagName.getBoundingClientRect().right;
				const widthElement = elementTagName.offsetWidth;
				const widthElementShortUserProfileMin = 380;
				const distanceToRight = windowWidth - positionRight;
				if (distanceToRight < widthElementShortUserProfileMin) {
					setPositionLeft(positionRight - widthElement - widthElementShortUserProfileMin);
				} else {
					setPositionLeft(positionRight + 20);
				}
				setPositionTop(clickY - 50);
				setPositionBottom(false);
			}
			const heightElementShortUserProfileMin = 313;
			if (distanceToBottom < heightElementShortUserProfileMin) {
				setPositionBottom(true);
			}
		}
	};

	useOnClickOutside(panelRef, () => setIsShowPanelChannel(false));
	useEscapeKey(() => setIsShowPanelChannel(false));

	return (
		<>
			{showProfileUser && (
				<UserProfilePopup
					userID={tagUserId ?? ''}
					channelId={currentChannelId ?? ''}
					mode={mode}
					positionLeft={positionLeft}
					positionTop={positionTop}
					positionBottom={positionBottom}
				/>
			)}
			{displayToken?.type === MentionType.ROLE_EXIST && (
				<span className="font-medium px-[0.1rem] rounded-sm bg-[#E3F1E4] hover:bg-[#B1E0C7] text-[#0EB08C] dark:bg-[#3D4C43] dark:hover:bg-[#2D6457]">{`${displayToken.display}`}</span>
			)}
			{displayToken?.type === MentionType.HERE && (
				<span
					className={`font-medium px-0.1 rounded-sm 'cursor-text'
					${isJumMessageEnabled ? 'cursor-pointer hover:!text-white' : 'hover:none'}
	
					 whitespace-nowrap !text-[#3297ff]  dark:bg-[#3C4270] bg-[#D1E0FF]  ${isJumMessageEnabled ? 'hover:bg-[#5865F2]' : 'hover:none'}`}
				>
					{displayToken.display}
				</span>
			)}
			{displayToken?.type === MentionType.USER_EXIST && (
				<button
					// eslint-disable-next-line @typescript-eslint/no-empty-function
					onMouseDown={!isJumMessageEnabled || isTokenClickAble ? (event) => handleMouseClick(event) : () => {}}
					ref={panelRef}
					// eslint-disable-next-line @typescript-eslint/no-empty-function
					onClick={!isJumMessageEnabled || isTokenClickAble ? (e) => dispatchUserIdToShowProfile(e) : () => {}}
					style={{ textDecoration: 'none' }}
					className={`font-medium px-0.1 rounded-sm
				${isJumMessageEnabled ? 'cursor-pointer hover:!text-white' : 'hover:none'}
				 whitespace-nowrap !text-[#3297ff]  dark:bg-[#3C4270] bg-[#D1E0FF]  ${isJumMessageEnabled ? 'hover:bg-[#5865F2]' : 'hover:none'}`}
				>
					{displayToken.display}
				</button>
			)}
			{displayToken?.type === MentionType.USER_NOT_EXIST && <span>{displayToken.display}</span>}
			{displayToken?.type === MentionType.ROLE_NOT_EXIST && <span>{displayToken.display}</span>}
		</>
	);
};

export default memo(MentionUser);

const UserProfilePopup = ({ userID, channelId, mode, positionLeft, positionTop, positionBottom }: UserProfilePopupProps) => {
	const getUserByUserId = useAppSelector((state) =>
		selectChannelMemberByUserIds(state, channelId ?? '', userID, mode === ChannelStreamMode.STREAM_MODE_CHANNEL ? '' : '1')
	)[0];
	const prioritizeName = getNameForPrioritize(
		getUserByUserId.clan_nick ?? '',
		getUserByUserId.user?.display_name ?? '',
		getUserByUserId.user?.username ?? ''
	);
	const prioritizeAvt = getUserByUserId.clan_avatar ? getUserByUserId.clan_avatar : getUserByUserId.user?.avatar_url;

	const updatedUserByUserId = {
		...getUserByUserId,
		prioritizeName,
		prioritizeAvt
	};

	return (
		<div
			className="dark:bg-black bg-gray-200 mt-[10px] w-[300px] rounded-lg flex flex-col z-10 fixed opacity-100"
			style={{
				left: `${positionLeft}px`,
				top: positionBottom ? '' : `${positionTop}px`,
				bottom: positionBottom ? '64px' : ''
			}}
			onMouseDown={(e) => e.stopPropagation()}
		>
			<ShortUserProfile userID={userID} mode={mode} avatar={updatedUserByUserId.prioritizeAvt} name={updatedUserByUserId.prioritizeName} />
		</div>
	);
};
