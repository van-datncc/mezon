import { initStore, MezonStoreProvider } from '@mezon/store';
import { useMezon } from '@mezon/transport';
import { OPEN_APP_CHANNEL } from '@mezon/utils';
import isElectron from 'is-electron';
import { ApiChannelAppResponse } from 'mezon-js/api.gen';
import React, { useEffect, useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { preloadedState } from '../../mock/state';

interface StickyModalProps {
	children: React.ReactNode;
	onClose: () => void;
	app: ApiChannelAppResponse;
}

const StickyModal: React.FC<StickyModalProps> = ({ children, onClose, app }) => {
	const appUrl = app.url;
	const appClanId = app.clan_id;
	const appChannelId = app.channel_id;
	const appId = app.id;

	const mezon = useMezon();
	const storeConfig = useMemo(() => (mezon ? initStore(mezon, preloadedState) : null), [mezon]);
	const modalRef = useRef<Window | null>(null);

	useEffect(() => {
		const uniqueName = `StickyModal-${appUrl}`;
		if (isElectron()) {
			window.electron.openChannelApp(OPEN_APP_CHANNEL, { appUrl, appClanId, appChannelId, appId });
			return;
		}
		if (!modalRef.current || modalRef.current.closed) {
			modalRef.current = window.open('', uniqueName, `width=${window.innerWidth},height=${window.innerHeight},left=0,top=0`);
		}

		const modalWindow = modalRef.current;
		if (!modalWindow || !storeConfig) return;

		modalWindow.document.title = appUrl as string;
		modalWindow.document.body.style.margin = '0';
		modalWindow.document.body.style.overflow = 'hidden';
		modalWindow.document.body.innerHTML = "<div id='modal-root'></div>";

		const modalRoot = modalWindow.document.getElementById('modal-root');

		if (modalRoot) {
			const root = createRoot(modalRoot);
			root.render(
				<MezonStoreProvider store={storeConfig.store} persistor={storeConfig.persistor} loading={null}>
					{children}
				</MezonStoreProvider>
			);
		}

		modalWindow.onbeforeunload = onClose;

		return () => {
			modalWindow.close();
		};
	}, [storeConfig, app]);

	return null;
};

export default StickyModal;
