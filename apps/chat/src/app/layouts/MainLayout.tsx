import {ChatContext, ChatContextProvider, useAttachments, useFriends} from '@mezon/core';
import {
	attachmentActions,
	gifsStickerEmojiActions,
	selectAnyUnreadChannel,
	selectBadgeCountAllClan, useAppDispatch
} from '@mezon/store';

import { selectTotalUnreadDM, useAppSelector } from '@mezon/store-mobile';
import { MezonSuspense } from '@mezon/transport';
import {SubPanelName, electronBridge, isLinuxDesktop, isWindowsDesktop, ImageWindowProps} from '@mezon/utils';
import isElectron from 'is-electron';
import debounce from 'lodash.debounce';
import { memo, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';

const GlobalEventListener = () => {
	const { handleReconnect } = useContext(ChatContext);
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { setOpenModalAttachment, setAttachment } = useAttachments();
	
	const allNotificationReplyMentionAllClan = useSelector(selectBadgeCountAllClan);

	const totalUnreadMessages = useSelector(selectTotalUnreadDM);

	const { quantityPendingRequest } = useFriends();

	const hasUnreadChannel = useAppSelector((state) => selectAnyUnreadChannel(state));

	useEffect(() => {
		const handleNavigateToPath = (_: unknown, path: string) => {
			navigate(path);
		};
		window.electron?.on('navigate-to-path', handleNavigateToPath);
		return () => {
			window.electron?.removeListener('navigate-to-path', handleNavigateToPath);
		};
	}, [navigate]);

	useEffect(() => {
		const reconnectSocket = debounce(() => {
			if (document.visibilityState === 'visible') {
				handleReconnect('Socket disconnected event, attempting to reconnect...');
			}
		}, 100);

		window.addEventListener('focus', reconnectSocket);
		window.addEventListener('online', reconnectSocket);
		return () => {
			window.removeEventListener('focus', reconnectSocket);
			window.removeEventListener('online', reconnectSocket);
		};
	}, [handleReconnect]);

	useEffect(() => {
		let notificationCountAllClan = 0;
		notificationCountAllClan = allNotificationReplyMentionAllClan < 0 ? 0 : allNotificationReplyMentionAllClan;
		const notificationCount = notificationCountAllClan + totalUnreadMessages + quantityPendingRequest;
		const displayCountBrowser = notificationCount > 99 ? '99+' : notificationCount.toString();

		if (isElectron()) {
			if (hasUnreadChannel && !notificationCount) {
				electronBridge?.setBadgeCount(null);
				return;
			}
			electronBridge?.setBadgeCount(notificationCount);
		} else {
			document.title = notificationCount > 0 ? `(${displayCountBrowser}) Mezon` : 'Mezon';
		}
	}, [allNotificationReplyMentionAllClan, totalUnreadMessages, quantityPendingRequest, hasUnreadChannel]);
	
	useEffect(() => {
		console.log('start listen set attachment data');
		
		const handleSetAttachmentData = (props: ImageWindowProps) => {
			console.log('listen set attachment data successfully');
			const { attachmentData, messageId, mode, attachmentUrl, currentClanId, currentChannelId, currentDmId, checkListAttachment } = props;
			dispatch(attachmentActions.setMode(mode));
			setOpenModalAttachment(true);
			setAttachment(attachmentUrl);
			dispatch(
				attachmentActions.setCurrentAttachment({
					id: attachmentData.message_id as string,
					uploader: attachmentData.sender_id,
					create_time: attachmentData.create_time
				})
			);
			
			if (((currentClanId && currentChannelId) || currentDmId) && !checkListAttachment) {
				const clanId = currentDmId ? '0' : (currentClanId as string);
				const channelId = (currentDmId as string) || (currentChannelId as string);
				dispatch(attachmentActions.fetchChannelAttachments({ clanId, channelId }));
			}
			
			dispatch(attachmentActions.setMessageId(messageId));
		};
		
		window.electron?.on('set-attachment-data', handleSetAttachmentData);
		
		return () => {
			window.electron?.removeListener('set-attachment-data', handleSetAttachmentData);
		};
	}, []);
	
	
	return null;
};

const MainLayout = memo(
	() => {
		const dispatch = useDispatch();
		const handleClickingOutside = () => {
			dispatch(gifsStickerEmojiActions.setSubPanelActive(SubPanelName.NONE));
		};
		return (
			<div
				id="main-layout"
				className={`${isWindowsDesktop || isLinuxDesktop ? 'top-[21px] fixed' : ''} w-full`}
				onClick={handleClickingOutside}
				onContextMenu={(event: React.MouseEvent) => {
					event.preventDefault();
				}}
			>
				<Outlet />
				<GlobalEventListener />
			</div>
		);
	},
	() => true
);

const MainLayoutWrapper = () => {
	return (
		<MezonSuspense>
			<ChatContextProvider>
				<MainLayout />
			</ChatContextProvider>
		</MezonSuspense>
	);
};

export default MainLayoutWrapper;
