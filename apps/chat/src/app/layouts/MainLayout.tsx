import { ChatContext, ChatContextProvider, useGifsStickersEmoji } from '@mezon/core';
import { reactionActions } from '@mezon/store';
import { MezonSuspense, SocketStatus, useMezon } from '@mezon/transport';
import { SubPanelName } from '@mezon/utils';
import debounce from 'lodash.debounce';
import { useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
	const dispatch = useDispatch();
	const { socketStatus } = useMezon();
	const { handleReconnect } = useContext(ChatContext);

	useEffect(() => {
		const reconnectSocket = debounce(() => {
			if (document.visibilityState === 'visible') {
				if (socketStatus.current === SocketStatus.CONNECT_FAILURE) {
					handleReconnect('Socket disconnected, attempting to reconnect...');
				}
			}
		}, 100);

		document.addEventListener('visibilitychange', reconnectSocket);
		window.addEventListener('online', reconnectSocket);
		return () => {
			document.removeEventListener('visibilitychange', reconnectSocket);
			window.removeEventListener('online', reconnectSocket);
		};
	}, [handleReconnect, socketStatus]);

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
