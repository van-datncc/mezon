import { useAppNavigation, useAppParams, useDirect, useFriends, useMarkAsRead } from '@mezon/core';
import {
	ChannelMembersEntity,
	SetMuteNotificationPayload,
	SetNotificationPayload,
	channelUsersActions,
	deleteChannel,
	directActions,
	directMetaActions,
	notificationSettingActions,
	removeMemberChannel,
	selectAllAccount,
	selectFriendStatus,
	selectHasKeyE2ee,
	selectNotifiSettingsEntitiesById,
	selectTheme,
	useAppDispatch,
	useAppSelector
} from '@mezon/store';
import { FOR_15_MINUTES, FOR_1_HOUR, FOR_24_HOURS, FOR_3_HOURS, FOR_8_HOURS } from '@mezon/utils';
import { format } from 'date-fns';
import { ChannelType } from 'mezon-js';
import { CSSProperties, FC, createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Menu, Submenu, useContextMenu } from 'react-contexify';
import { useModal } from 'react-modal-hook';
import { useSelector } from 'react-redux';
import ModalConfirm from '../../components/ModalConfirm';
import ItemPanelMember from '../../components/PanelMember/ItemPanelMember';
import UserProfileModalInner from '../../components/UserProfileModalInner';
import { MemberMenuItem } from '../MemberContextMenu';

export const DIRECT_MESSAGE_CONTEXT_MENU_ID = 'direct-message-context-menu';

export interface DirectMessageContextMenuProps {
	children: React.ReactNode;
	contextMenuId?: string;
	dataMemberCreate?: { createId: string };
}

export interface DirectMessageContextMenuHandlers {
	handleViewProfile: () => void;
	handleMessage: () => void;
	handleAddFriend: () => void;
	handleRemoveFriend: () => void;
	handleMarkAsRead: () => void;
	handleMute: (duration?: number) => void;
	handleUnmute: () => void;
	handleEnableE2EE: () => void;
	handleRemoveFromGroup: () => void;
	handleLeaveGroup: () => void;
}

export interface DirectMessageContextMenuContextType {
	setCurrentHandlers: (handlers: DirectMessageContextMenuHandlers | null) => void;
	showMenu: (event: React.MouseEvent) => void;
	setCurrentUser: (user: ChannelMembersEntity | null) => void;
	showContextMenu: (event: React.MouseEvent, user?: ChannelMembersEntity) => void;
	openUserProfile: () => void;
	openProfileItem: (event: React.MouseEvent, user: ChannelMembersEntity) => void;
	contextMenuId: string;
	mutedUntilText: string;
}

export const DMCT_GROUP_CHAT_ID = 'group-chat-context';

const DirectMessageContextMenuContext = createContext<DirectMessageContextMenuContextType | undefined>(undefined);

export const DirectMessageContextMenuProvider: FC<DirectMessageContextMenuProps> = ({
	children,
	contextMenuId = DIRECT_MESSAGE_CONTEXT_MENU_ID,
	dataMemberCreate
}) => {
	const [currentUser, setCurrentUser] = useState<ChannelMembersEntity | any>(null);
	const [currentHandlers, setCurrentHandlers] = useState<DirectMessageContextMenuHandlers | null>(null);
	const [mutedUntilText, setMutedUntilText] = useState<string>('');
	const [nameChildren, setNameChildren] = useState<string>('');
	const [popupLeave, setPopupLeave] = useState<boolean>(false);

	const dispatch = useAppDispatch();
	const userProfile = useSelector(selectAllAccount);
	const { addFriend, deleteFriend } = useFriends();
	const { createDirectMessageWithUser } = useDirect();
	const { toDmGroupPageFromMainApp, navigate } = useAppNavigation();
	const { handleMarkAsReadDM } = useMarkAsRead();
	const hasKeyE2ee = useAppSelector(selectHasKeyE2ee);
	const { directId } = useAppParams();

	const getChannelId = useCallback(() => {
		return currentUser?.channelId || currentUser?.channel_id;
	}, [currentUser]);

	const getChannelType = useCallback(() => {
		return currentUser?.type;
	}, [currentUser]);

	const getChannelE2ee = useCallback(() => {
		return currentUser?.e2ee;
	}, [currentUser]);

	const { show } = useContextMenu({
		id: contextMenuId
	});

	const showMenu = (event: React.MouseEvent) => {
		show({ event });
	};

	const [openUserProfile, closeUserProfile] = useModal(() => {
		if (!currentUser) return null;

		return (
			<UserProfileModalInner
				userId={currentUser?.id || currentUser?.user_id?.[0]}
				directId={(currentUser as any)?.channel_id || currentUser?.channelId}
				onClose={() => closeUserProfile()}
				isDM={true}
				user={currentUser}
				avatar={currentUser?.avatar_url || currentUser?.channel_avatar?.[0]}
				name={currentUser?.display_name || currentUser?.username || currentUser?.display_names?.[0]}
				status={{
					status: typeof currentUser?.metadata === 'object' ? currentUser?.metadata?.status === 'ONLINE' : false,
					isMobile: currentUser?.is_mobile
				}}
				customStatus={typeof currentUser?.metadata === 'object' ? currentUser?.metadata?.status : undefined}
			/>
		);
	}, [currentUser]);

	const handleDirectMessageWithUser = useCallback(
		async (user?: any) => {
			if (!user?.id) return;

			const response = await createDirectMessageWithUser(user.id, user.display_name || user.username, user.avatar_url);

			if (response?.channel_id) {
				const directDM = toDmGroupPageFromMainApp(response.channel_id, Number(response.type));
				navigate(directDM);
			}
		},
		[createDirectMessageWithUser, toDmGroupPageFromMainApp, navigate]
	);

	const handleMarkAsRead = useCallback(
		(directId: string) => {
			const timestamp = Date.now() / 1000;
			dispatch(directMetaActions.setDirectLastSeenTimestamp({ channelId: directId, timestamp: timestamp }));
			handleMarkAsReadDM(directId);
		},
		[dispatch, handleMarkAsReadDM]
	);

	const handleEnableE2ee = useCallback(
		async (directId?: string, e2ee?: number) => {
			// if (!hasKeyE2ee && !e2ee) {
			// 	dispatch(e2eeActions.setDirectMesIdE2ee(directId));
			// 	dispatch(e2eeActions.setOpenModalE2ee(true));
			// 	return;
			// }
			// if (!directId) return;
			// const currentDmGroup =
			// if (currentDmGroup) {
			// 	await dispatch(
			// 		channelsActions.updateChannel({
			// 			channel_id: directId,
			// 			channel_label: '',
			// 			category_id: currentDmGroup.category_id,
			// 			app_id: currentDmGroup.app_id || '',
			// 			e2ee: !currentDmGroup.e2ee ? 1 : 0
			// 		})
			// 	);
			// }
		},
		[hasKeyE2ee, dispatch]
	);

	const handleRemoveMemberFromGroup = useCallback(
		async (userId: string, channelId: string) => {
			if (!userId || !channelId) return;

			try {
				await dispatch(
					channelUsersActions.removeChannelUsers({
						channelId: channelId,
						userId: userId,
						channelType: ChannelType.CHANNEL_TYPE_GROUP
					})
				);
			} catch (error) {
				dispatch({
					type: 'ERROR_NOTIFICATION',
					payload: {
						message: 'Failed to remove member from group',
						error
					}
				});
			}
		},
		[dispatch]
	);

	const muteOrUnMuteChannel = useCallback(
		(active: number) => {
			const channelId = getChannelId();
			if (!channelId) return;

			const body = {
				channel_id: channelId,
				notification_type: 0,
				clan_id: '',
				active: active,
				is_current_channel: true
			};
			dispatch(notificationSettingActions.setMuteNotificationSetting(body));
		},
		[dispatch, getChannelId]
	);

	const handleScheduleMute = useCallback(
		(duration: number) => {
			const channelId = getChannelId();
			const channelType = getChannelType();

			if (!channelId) return;

			if (duration !== Infinity) {
				const now = new Date();
				const unmuteTime = new Date(now.getTime() + duration);
				const unmuteTimeISO = unmuteTime.toISOString();

				const body: SetNotificationPayload = {
					channel_id: channelId,
					notification_type: 0,
					clan_id: '',
					time_mute: unmuteTimeISO,
					is_current_channel: true,
					is_direct: channelType === ChannelType.CHANNEL_TYPE_DM || channelType === ChannelType.CHANNEL_TYPE_GROUP
				};
				dispatch(notificationSettingActions.setNotificationSetting(body));
			} else {
				const body: SetMuteNotificationPayload = {
					channel_id: channelId,
					notification_type: 0,
					clan_id: '',
					active: 0,
					is_current_channel: true
				};
				dispatch(notificationSettingActions.setMuteNotificationSetting(body));
			}
		},
		[dispatch, getChannelId, getChannelType]
	);

	const isDmGroup = getChannelType() === ChannelType.CHANNEL_TYPE_GROUP;
	const isDm = getChannelType() === ChannelType.CHANNEL_TYPE_DM;

	const channelId = getChannelId();

	const getGroupMembersCount = useCallback(() => {
		return currentUser?.user_id?.length || 0;
	}, [currentUser]);

	const isLastOne = getGroupMembersCount() <= 1;

	const handleLeaveDmGroup = useCallback(async () => {
		const channelId = getChannelId();
		if (!channelId) return;

		const isLeaveOrDeleteGroup = isLastOne
			? await dispatch(deleteChannel({ clanId: '', channelId: channelId, isDmGroup: true }))
			: await dispatch(removeMemberChannel({ channelId: channelId, userIds: [userProfile?.user?.id as string], kickMember: false }));

		if (!isLeaveOrDeleteGroup) {
			return;
		}

		if (directId === channelId) {
			navigate('/chat/direct/friends');
		}

		await dispatch(directActions.remove(channelId));
	}, [dispatch, getChannelId, navigate, userProfile?.user?.id, isLastOne, directId]);

	const handleConfirmLeave = useCallback(
		(e?: React.MouseEvent) => {
			handleLeaveDmGroup();
		},
		[handleLeaveDmGroup]
	);

	const createDefaultHandlers = useCallback(
		(user?: any): DirectMessageContextMenuHandlers => {
			return {
				handleViewProfile: () => {
					if (user) {
						openUserProfile();
					}
				},
				handleMessage: () => {
					if (user) {
						handleDirectMessageWithUser(user);
					}
				},
				handleAddFriend: () => {
					if (!user) return;

					addFriend({ usernames: [user.usernames[0]], ids: [user.user_id[0]] });
				},
				handleRemoveFriend: () => {
					if (!user) return;
					deleteFriend(user.usernames[0], user.user_id[0]);
				},
				handleMarkAsRead: () => {
					const channelId = (user as any)?.channelId || (user as any)?.channel_id;
					if (channelId) {
						handleMarkAsRead(channelId);
					}
				},
				handleMute: (duration = Infinity) => {
					handleScheduleMute(duration);
				},
				handleUnmute: () => {
					muteOrUnMuteChannel(1);
				},
				handleEnableE2EE: () => {
					const channelId = user?.channelId || user?.channel_id;
					const e2ee = user?.e2ee;
					if (channelId) {
						handleEnableE2ee(channelId, e2ee);
					}
				},
				handleRemoveFromGroup: () => {
					const userId = user?.id;
					const channelId = user?.channelId || user.channel_id;
					if (userId && channelId) {
						handleRemoveMemberFromGroup(userId, channelId);
					}
				},
				handleLeaveGroup: () => {
					handleConfirmLeave();
				}
			};
		},
		[
			openUserProfile,
			handleDirectMessageWithUser,
			addFriend,
			deleteFriend,
			handleMarkAsRead,
			handleScheduleMute,
			muteOrUnMuteChannel,
			handleEnableE2ee,
			handleRemoveMemberFromGroup,
			handleConfirmLeave
		]
	);

	const showContextMenu = useCallback(
		async (event: React.MouseEvent, user?: ChannelMembersEntity) => {
			event.preventDefault();

			if (user) {
				setCurrentUser(user?.user ? user?.user : user);

				const channelId = (user as any)?.channelId || (user as any)?.channel_id;
				if (channelId) {
					await dispatch(
						notificationSettingActions.getNotificationSetting({
							channelId: channelId
						})
					);
				}
			}

			const handlers = createDefaultHandlers(user);
			setCurrentHandlers(handlers);
			showMenu(event);
		},
		[dispatch, createDefaultHandlers, showMenu]
	);

	const openProfileItem = useCallback(
		(event: React.MouseEvent, user: ChannelMembersEntity) => {
			if (user) {
				setCurrentUser(user);
				openUserProfile();
			}
		},
		[setCurrentUser, openUserProfile]
	);

	const contextValue: DirectMessageContextMenuContextType = {
		setCurrentHandlers,
		showMenu,
		setCurrentUser,
		showContextMenu,
		openUserProfile,
		openProfileItem,
		contextMenuId,
		mutedUntilText
	};

	const appearanceTheme = useSelector(selectTheme);
	const isLightMode = appearanceTheme === 'light';

	const className: CSSProperties = {
		'--contexify-menu-bgColor': isLightMode ? '#FFFFFF' : '#111214',
		'--contexify-activeItem-bgColor': '#4B5CD6',
		'--contexify-rightSlot-color': '#6f6e77',
		'--contexify-activeRightSlot-color': '#fff',
		'--contexify-arrow-color': '#6f6e77',
		'--contexify-activeArrow-color': '#fff',
		'--contexify-itemContent-padding': '-3px',
		'--contexify-menu-radius': '2px',
		'--contexify-activeItem-radius': '2px',
		'--contexify-menu-minWidth': '188px',
		'--contexify-separator-color': '#ADB3B9'
	} as CSSProperties;

	const isSelf = userProfile?.user?.id === currentUser?.id || currentUser?.user_id?.includes(userProfile?.user?.id);

	const notificationSettings = useAppSelector(selectNotifiSettingsEntitiesById(channelId || ''));
	const isMuted = notificationSettings?.active === 0;
	const hasMuteTime = notificationSettings?.time_mute ? new Date(notificationSettings.time_mute) > new Date() : false;

	const isOwnerClanOrGroup = userProfile?.user?.id && dataMemberCreate?.createId && userProfile?.user?.id === dataMemberCreate.createId;

	const isFriend = Number.isInteger(useSelector(selectFriendStatus(currentUser?.user_id?.[0])));

	useEffect(() => {
		const displayName = currentUser?.display_name || currentUser?.display_names?.[0];
		const channelName = isDmGroup ? 'Conversation' : `@${displayName}`;

		if (notificationSettings?.active === 1 || notificationSettings?.id === '0') {
			setNameChildren(`Mute`);
			setMutedUntilText('');
		} else {
			setNameChildren(`UnMute`);

			if (notificationSettings?.time_mute) {
				const timeMute = new Date(notificationSettings.time_mute);
				const currentTime = new Date();
				if (timeMute > currentTime) {
					const timeDifference = timeMute.getTime() - currentTime.getTime();
					const formattedDate = format(timeMute, 'dd/MM, HH:mm');
					setMutedUntilText(`Muted until ${formattedDate}`);

					setTimeout(() => {
						const channelId = getChannelId();
						if (channelId) {
							const body = {
								channel_id: channelId,
								notification_type: notificationSettings?.notification_setting_type || 0,
								clan_id: '',
								active: 1,
								is_current_channel: true
							};
							dispatch(notificationSettingActions.setMuteNotificationSetting(body));
						}
					}, timeDifference);
				}
			}
		}
	}, [notificationSettings, dispatch, currentUser, isDmGroup, getChannelId]);

	return (
		<DirectMessageContextMenuContext.Provider value={contextValue}>
			{children}

			<Menu id={contextMenuId} style={className} animation={false}>
				{currentHandlers && (
					<>
						<MemberMenuItem label="Profile" onClick={currentHandlers.handleViewProfile} />

						{channelId && <MemberMenuItem label="Mark as Read" onClick={currentHandlers.handleMarkAsRead} />}

						{!isSelf && !isDm && !isDmGroup && <MemberMenuItem label="Message" onClick={currentHandlers.handleMessage} />}

						{!isSelf && !isFriend && <MemberMenuItem label="Add Friend" onClick={currentHandlers.handleAddFriend} />}

						{!isSelf && isFriend && (
							<MemberMenuItem label="Remove Friend" onClick={currentHandlers.handleRemoveFriend} isWarning={true} />
						)}

						{channelId && (
							<MemberMenuItem
								label={getChannelE2ee() ? 'Disable E2EE' : 'Enable E2EE'}
								onClick={currentHandlers.handleEnableE2EE}
								rightElement={getChannelE2ee() ? <span className="ml-2 text-xs">🔒</span> : <span className="ml-2 text-xs">🔓</span>}
							/>
						)}

						{contextMenuId !== DMCT_GROUP_CHAT_ID &&
							channelId &&
							(isMuted || hasMuteTime ? (
								<MemberMenuItem
									label={nameChildren}
									onClick={currentHandlers.handleUnmute}
									rightElement={mutedUntilText ? <span className="ml-2 text-xs">{mutedUntilText}</span> : undefined}
								/>
							) : (
								<Submenu
									label={
										<span
											className="flex truncate justify-between items-center w-full font-sans text-sm font-medium dark:text-[#ADB3B9] text-[#4E5058] hover:text-[#FFFFFF] dark:hover:text-[#FFFFFF] p-1"
											style={{ fontFamily: `'gg sans', 'Noto Sans', sans-serif`, padding: 8 }}
										>
											{nameChildren}
										</span>
									}
								>
									<MemberMenuItem label="For 15 Minutes" onClick={() => currentHandlers.handleMute(FOR_15_MINUTES)} />
									<MemberMenuItem label="For 1 Hour" onClick={() => currentHandlers.handleMute(FOR_1_HOUR)} />
									<MemberMenuItem label="For 3 Hour" onClick={() => currentHandlers.handleMute(FOR_3_HOURS)} />
									<MemberMenuItem label="For 8 Hour" onClick={() => currentHandlers.handleMute(FOR_8_HOURS)} />
									<MemberMenuItem label="For 24 Hour" onClick={() => currentHandlers.handleMute(FOR_24_HOURS)} />
									<MemberMenuItem label="Until I turn it back on" onClick={() => currentHandlers.handleMute()} />
								</Submenu>
							))}

						{contextMenuId === DMCT_GROUP_CHAT_ID && !isSelf && isOwnerClanOrGroup && (
							<ItemPanelMember children="Remove From Group" onClick={currentHandlers.handleRemoveFromGroup} danger />
						)}

						{isDmGroup && (
							<ItemPanelMember
								children={isLastOne ? 'Delete Group' : 'Leave Group'}
								danger
								onClick={currentHandlers.handleLeaveGroup}
							/>
						)}
					</>
				)}
			</Menu>

			{popupLeave && isLastOne && (
				<ModalConfirm
					handleCancel={() => setPopupLeave(false)}
					handleConfirm={handleLeaveDmGroup}
					title="delete"
					modalName="this group"
					buttonName="Delete Group"
				/>
			)}
		</DirectMessageContextMenuContext.Provider>
	);
};

export const useDirectMessageContextMenu = () => {
	const context = useContext(DirectMessageContextMenuContext);
	if (!context) {
		throw new Error('useDirectMessageContextMenu must be used within a DirectMessageContextMenuProvider');
	}
	return context;
};
