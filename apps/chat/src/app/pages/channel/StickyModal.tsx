import { initStore, MezonStoreProvider } from '@mezon/store';
import { useMezon } from '@mezon/transport';
import isElectron from 'is-electron';
import React, { useEffect, useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { preloadedState } from '../../mock/state';

interface StickyModalProps {
	children: React.ReactNode;
	onClose: () => void;
	modalName: string;
	appName: string;
	appUrl: string;
	appClanId: string;
	appChannelId: string;
}

const StickyModal: React.FC<StickyModalProps> = ({ children, onClose, modalName, appName, appUrl, appClanId, appChannelId }) => {
	const mezon = useMezon();
	const storeConfig = useMemo(() => (mezon ? initStore(mezon, preloadedState) : null), [mezon]);
	const modalRef = useRef<Window | null>(null);

	useEffect(() => {
		const uniqueName = `StickyModal-${modalName}`;
		if (isElectron()) {
			(window as any).electron.send('open-modal', { modalName, appName, appUrl, appClanId, appChannelId });
			return;
		}
		if (!modalRef.current || modalRef.current.closed) {
			modalRef.current = window.open('', uniqueName, `width=${window.innerWidth},height=${window.innerHeight},left=0,top=0`);
		}

		const modalWindow = modalRef.current;
		if (!modalWindow || !storeConfig) return;

		modalWindow.document.title = appName;
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
	}, [storeConfig, modalName, appName]);

	return null;
};

export default StickyModal;
