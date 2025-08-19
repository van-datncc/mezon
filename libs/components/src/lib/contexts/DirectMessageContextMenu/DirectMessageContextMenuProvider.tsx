
import { useAppParams } from '@mezon/core';
import {
	ChannelMembersEntity,
	EStateFriend,
	RootState,
	directActions,
	selectAllAccount,
	selectFriendById,
	selectHasKeyE2ee,
	selectNotifiSettingsEntitiesById,
	useAppDispatch,
	useAppSelector
} from '@mezon/store';
import { handleUploadEmoticon, useMezon } from '@mezon/transport';
import { EMuteState, FOR_15_MINUTES, FOR_1_HOUR, FOR_24_HOURS, FOR_3_HOURS, FOR_8_HOURS } from '@mezon/utils';
import { ChannelType } from 'mezon-js';
import { FC, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Menu, Submenu, useContextMenu } from 'react-contexify';
import { useSelector } from 'react-redux';
import ModalEditGroup from '../../components/ModalEditGroup';
import ItemPanelMember from '../../components/PanelMember/ItemPanelMember';
import { MemberMenuItem } from '../MemberContextMenu';
import { useModals } from '../MemberContextMenu/useModals';
import {
	DIRECT_MESSAGE_CONTEXT_MENU_ID,
	DMCT_GROUP_CHAT_ID,
	DirectMessageContextMenuContextType,
	DirectMessageContextMenuHandlers,
	DirectMessageContextMenuProps
} from './types';
import { useContextMenuHandlers } from './useContextMenu';
import { useDefaultHandlers } from './useDefaultHandlers';
import { useMenuHandlers } from './useMenuHandlers';
import { useMenuStyles } from './useMenuStyles';
import { useNotificationSettings } from './useNotificationSettings';
import { useProfileModal } from './useProfileModal';


const DirectMessageContextMenuContext = createContext<DirectMessageContextMenuContextType | undefined>(undefined);

export const DirectMessageContextMenuProvider: FC<DirectMessageContextMenuProps> = ({
	children,
	contextMenuId = DIRECT_MESSAGE_CONTEXT_MENU_ID,
	dataMemberCreate
}) => {
	const [currentUser, setCurrentUser] = useState<ChannelMembersEntity | any>(null);
	const [currentHandlers, setCurrentHandlers] = useState<DirectMessageContextMenuHandlers | null>(null);
	const dispatch = useAppDispatch();

	const userProfile = useSelector(selectAllAccount);
	const hasKeyE2ee = useAppSelector(selectHasKeyE2ee);
	const { directId } = useAppParams();
	const { show } = useContextMenu({ id: contextMenuId });

	const getChannelId = currentUser?.channelId || currentUser?.channel_id;
	const getChannelType = currentUser?.type;
	const getChannelE2ee = currentUser?.e2ee;
	const isDmGroup = getChannelType === ChannelType.CHANNEL_TYPE_GROUP;
	const isDm = getChannelType === ChannelType.CHANNEL_TYPE_DM;
	const channelId = getChannelId;

	const isLastOne = (currentUser?.user_id?.length || 0) <= 1;
	const [warningStatus, setWarningStatus] = useState<string>('var(--bg-item-hover)');

	const { openUserProfile } = useProfileModal({ currentUser });
	const { openProfileItem } = useModals({
		currentUser
	});
	const { sessionRef, clientRef } = useMezon();

	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [groupName, setGroupName] = useState('');
	const [imagePreview, setImagePreview] = useState('');
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	useEffect(() => {
		if (currentUser?.channel_id) {
			dispatch(directActions.fetchDirectMessage({ noCache: true }));
		}
	}, [currentUser?.channel_id, dispatch]);



	const openEditGroupModal = useCallback(() => {
		const channelId = currentUser?.channelId || currentUser?.channel_id;
		const channelLabel = currentUser?.channel_label || 'Group';

		setGroupName(channelLabel);
		setImagePreview(currentUser?.topic || '');
		setSelectedFile(null);
		setIsEditModalOpen(true);
	}, [currentUser]);

	const closeEditGroupModal = useCallback(() => {
		setIsEditModalOpen(false);
	}, []);

	const handleSave = useCallback(async () => {
		const value = groupName.trim();
		const channelId = currentUser?.channelId || currentUser?.channel_id;
		const currentGroupName = currentUser?.channel_label;

		const hasNameChanged = value !== currentGroupName;
		const hasImageChanged = selectedFile !== null;

		if ((hasNameChanged || hasImageChanged) && channelId) {
			let avatarUrl = currentUser?.topic;

			if (selectedFile) {
				try {
					const client = clientRef.current;
					const session = sessionRef.current;

					if (!client || !session) {
						return;
					}


					const ext = selectedFile.name.split('.').pop() || 'jpg';
					const unique = `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
					const path = `dm-group-avatar/${channelId || 'temp'}/${unique}.${ext}`;

					const attachment = await handleUploadEmoticon(client, session, path, selectedFile);

					if (attachment && attachment.url) {
						avatarUrl = attachment.url;
					} else {
						return;
					}
				} catch (error) {
					return;
				}
			}


			const payload: { channel_id: string; channel_label?: string; topic?: string } = { channel_id: channelId };
			if (hasNameChanged) payload.channel_label = value;
			if (hasImageChanged) payload.topic = avatarUrl;
			dispatch(directActions.updateDmGroup(payload));
		}

		closeEditGroupModal();
	}, [groupName, selectedFile, currentUser, closeEditGroupModal]);

	const handleImageUpload = useCallback((file: File) => {
		setImagePreview('');

		const reader = new FileReader();
		reader.onload = (e) => {
			const result = e.target?.result as string;
			if (result) {
				setImagePreview(result);
			}
		};
		reader.readAsDataURL(file);

		setSelectedFile(file);
	}, []);
	const showMenu = useCallback(
		(event: React.MouseEvent) => {
			show({ event });
		},
		[show]
	);

	const { menuStyles } = useMenuStyles(warningStatus);

	const {
		handleDirectMessageWithUser,
		handleMarkAsRead,
		handleRemoveMemberFromGroup,
		handleLeaveDmGroup,
		handleEnableE2ee,
		addFriend,
		deleteFriend,
		blockFriend,
		unBlockFriend
	} = useMenuHandlers({
		userProfile,
		hasKeyE2ee,
		directId: directId as string,
		openUserProfile,
		isLastOne
	});

	const notificationSettings = useAppSelector((state) => selectNotifiSettingsEntitiesById(state, channelId || ''));

	const { mutedUntilText, nameChildren, muteOrUnMuteChannel, handleScheduleMute, getNotificationSetting } = useNotificationSettings({
		channelId,
		notificationSettings,
		getChannelId
	});

	const { createDefaultHandlers } = useDefaultHandlers({
		openUserProfile,
		handleDirectMessageWithUser,
		addFriend,
		deleteFriend,
		handleMarkAsRead,
		handleScheduleMute,
		muteOrUnMuteChannel,
		handleEnableE2ee,
		handleRemoveMemberFromGroup,
		handleLeaveDmGroup,
		blockFriend,
		unBlockFriend,
		openEditGroupModal
	});

	const { showContextMenu } = useContextMenuHandlers({
		setCurrentUser,
		setCurrentHandlers,
		showMenu,
		createDefaultHandlers,
		getNotificationSetting,
		openUserProfile
	});

	const isSelf = userProfile?.user?.id === currentUser?.id || currentUser?.user_id?.includes(userProfile?.user?.id);
	const isMuted = notificationSettings?.active !== EMuteState.UN_MUTE;
	const hasMuteTime = notificationSettings?.time_mute ? new Date(notificationSettings.time_mute) > new Date() : false;
	const isOwnerClanOrGroup = userProfile?.user?.id && dataMemberCreate?.createId && userProfile?.user?.id === dataMemberCreate.createId;
	const infoFriend = useAppSelector((state: RootState) => selectFriendById(state, currentUser?.user_id?.[0] || ''));
	const didIBlockUser = useMemo(() => {
		return (
			infoFriend?.state === EStateFriend.BLOCK &&
			infoFriend?.source_id === userProfile?.user?.id &&
			infoFriend?.user?.id === currentUser?.user_id?.[0]
		);
	}, [currentUser?.user_id, infoFriend, userProfile?.user?.id]);

	const shouldShowMenu = currentHandlers && !isSelf;

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

	return (
		<DirectMessageContextMenuContext.Provider value={contextValue}>
			{children}

			{shouldShowMenu && (
				<Menu id={contextMenuId} style={menuStyles} className="z-50 rounded-lg border-theme-primary" animation={false}>
					{currentHandlers && (
						<>
							{isDm && (
								<MemberMenuItem label="Profile" onClick={currentHandlers.handleViewProfile} setWarningStatus={setWarningStatus} />
							)}

							{channelId && (
								<MemberMenuItem label="Mark as Read" onClick={currentHandlers.handleMarkAsRead} setWarningStatus={setWarningStatus} />
							)}

							{!isDm && !isDmGroup && (
								<MemberMenuItem label="Message" onClick={currentHandlers.handleMessage} setWarningStatus={setWarningStatus} />
							)}

							{!isDmGroup && infoFriend?.state !== EStateFriend.BLOCK && (
								<>
									{infoFriend?.state !== EStateFriend.FRIEND &&
										infoFriend?.state !== EStateFriend.MY_PENDING &&
										infoFriend?.state !== EStateFriend.OTHER_PENDING && (
											<MemberMenuItem
												label="Add Friend"
												onClick={currentHandlers.handleAddFriend}
												setWarningStatus={setWarningStatus}
											/>
										)}

									{infoFriend?.state === EStateFriend.FRIEND && (
										<MemberMenuItem
											label="Remove Friend"
											onClick={currentHandlers.handleRemoveFriend}
											isWarning={true}
											setWarningStatus={setWarningStatus}
										/>
									)}
								</>
							)}

							{!isDmGroup && (infoFriend?.state === EStateFriend.FRIEND || didIBlockUser) && (
								<MemberMenuItem
									label={didIBlockUser ? 'Unblock' : 'Block'}
									onClick={didIBlockUser ? currentHandlers.handleUnblockFriend : currentHandlers.handleBlockFriend}
									isWarning={!didIBlockUser}
									setWarningStatus={setWarningStatus}
								/>
							)}

							{contextMenuId !== DMCT_GROUP_CHAT_ID &&
								channelId &&
								(isMuted || hasMuteTime ? (
									<MemberMenuItem
										label={nameChildren}
										onClick={currentHandlers.handleUnmute}
										rightElement={mutedUntilText ? <span className="ml-2 text-xs">{mutedUntilText}</span> : undefined}
										setWarningStatus={setWarningStatus}
									/>
								) : (
									<Submenu
										label={
											<span
												className="flex truncate justify-between items-center w-full font-sans text-sm font-medium text-theme-primary text-theme-primary-hover p-1 "
												style={{ fontFamily: `'gg sans', 'Noto Sans', sans-serif`, padding: 8 }}
											>
												{nameChildren}
											</span>
										}
									>
										<MemberMenuItem
											label="For 15 Minutes"
											onClick={() => currentHandlers.handleMute(FOR_15_MINUTES)}
											setWarningStatus={setWarningStatus}
										/>
										<MemberMenuItem
											label="For 1 Hour"
											onClick={() => currentHandlers.handleMute(FOR_1_HOUR)}
											setWarningStatus={setWarningStatus}
										/>
										<MemberMenuItem
											label="For 3 Hour"
											onClick={() => currentHandlers.handleMute(FOR_3_HOURS)}
											setWarningStatus={setWarningStatus}
										/>
										<MemberMenuItem
											label="For 8 Hour"
											onClick={() => currentHandlers.handleMute(FOR_8_HOURS)}
											setWarningStatus={setWarningStatus}
										/>
										<MemberMenuItem
											label="For 24 Hour"
											onClick={() => currentHandlers.handleMute(FOR_24_HOURS)}
											setWarningStatus={setWarningStatus}
										/>
										<MemberMenuItem
											label="Until I turn it back on"
											onClick={() => currentHandlers.handleMute()}
											setWarningStatus={setWarningStatus}
										/>
									</Submenu>
								))}
							{contextMenuId !== DMCT_GROUP_CHAT_ID && isDmGroup && (
								<ItemPanelMember children={'Edit Group'} onClick={currentHandlers.handleEditGroup} />
							)}
							{contextMenuId === DMCT_GROUP_CHAT_ID && isOwnerClanOrGroup && (
								<ItemPanelMember children="Remove From Group" onClick={currentHandlers.handleRemoveFromGroup} danger />
							)}

							{contextMenuId !== DMCT_GROUP_CHAT_ID && isDmGroup && (
								<ItemPanelMember children={'Leave Group'} danger onClick={currentHandlers.handleLeaveGroup} />
							)}
						</>
					)}
				</Menu>
			)}

				<ModalEditGroup
					isOpen={isEditModalOpen}
					onClose={closeEditGroupModal}
					onSave={handleSave}
					onImageUpload={handleImageUpload}
					groupName={groupName}
					onGroupNameChange={setGroupName}
					imagePreview={imagePreview}
					className="z-[200]"
				/>
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

export * from './types';

