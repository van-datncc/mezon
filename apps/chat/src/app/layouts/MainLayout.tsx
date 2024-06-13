import { ChatContextProvider, useChatReaction, useGifsStickersEmoji } from '@mezon/core';
import { MezonSuspense } from '@mezon/transport';
import { SubPanelName } from '@mezon/utils';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
	const { setSubPanelActive } = useGifsStickersEmoji();
	const { setUserReactionPanelState } = useChatReaction();

	const handleClickingOutside = () => {
		setSubPanelActive(SubPanelName.NONE);
		setUserReactionPanelState(false);
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
