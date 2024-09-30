import { ChatContext, ChatContextProvider, useFriends, useGifsStickersEmoji } from '@mezon/core';
import { reactionActions, selectAllChannelMeta, selectAnyUnreadChannel, selectMentionAndReplyUnreadAllClan } from '@mezon/store';

import { selectAllDirectMessageByLastSeenTimestamp, selectAllDirectMetaMessages, useAppSelector } from '@mezon/store-mobile';
import { MezonSuspense } from '@mezon/transport';
import { SubPanelName, electronBridge, removeUndefinedAndEmpty } from '@mezon/utils';
import isElectron from 'is-electron';
import debounce from 'lodash.debounce';
import { useContext, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';

// function removeUndefinedAndEmpty(obj: Record<string, DirectMetaEntity[]>) {
// 	return Object.fromEntries(
// 		Object.entries(obj).filter(([key, value]) => key !== 'undefined' && !(typeof value === 'object' && Object.keys(value).length === 0))
// 	);
// }

const GlobalEventListener = () => {
	const { handleReconnect } = useContext(ChatContext);
	const navigate = useNavigate();

	const allLastSeenChannelAllClan = useSelector(selectAllChannelMeta);
	const allNotificationReplyMentionAllClan = useSelector(selectMentionAndReplyUnreadAllClan(allLastSeenChannelAllClan));

	const allLastSeenChannelAllDirect = useSelector(selectAllDirectMetaMessages);
	const getAllDirectMessageUnread = useSelector(selectAllDirectMessageByLastSeenTimestamp(allLastSeenChannelAllDirect));
	const filterDirectUnread = removeUndefinedAndEmpty(getAllDirectMessageUnread);

	const allCountDirectUnread = useMemo(() => {
		let length = 0;

		for (const key in filterDirectUnread) {
			if (key !== 'undefined') {
				length += filterDirectUnread[key].length;
			}
		}

		return length;
	}, [filterDirectUnread]);

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
		const notificationCount = allNotificationReplyMentionAllClan.length + allCountDirectUnread + quantityPendingRequest;

		if (isElectron()) {
			if (hasUnreadChannel && !notificationCount) {
				electronBridge?.setBadgeCount(null);
				return;
			}
			electronBridge?.setBadgeCount(notificationCount);
		} else {
			if (notificationCount > 0) {
				document.title = `(${notificationCount}) Mezon`;
			} else {
				document.title = 'Mezon';
			}
		}
	}, [allNotificationReplyMentionAllClan.length, allCountDirectUnread, quantityPendingRequest, hasUnreadChannel]);

	return null;
};

const MainLayout = () => {
	const dispatch = useDispatch();
	const { setSubPanelActive } = useGifsStickersEmoji();
	const handleClickingOutside = () => {
		setSubPanelActive(SubPanelName.NONE);
		dispatch(reactionActions.setUserReactionPanelState(false));
	};
	return (
		<div
			id="main-layout"
			onClick={handleClickingOutside}
			onContextMenu={(event: React.MouseEvent) => {
				event.preventDefault();
			}}
		>
			<Outlet />
			<GlobalEventListener />
		</div>
	);
};

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
