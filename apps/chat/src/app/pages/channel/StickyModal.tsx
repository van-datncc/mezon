import { initStore, MezonStoreProvider } from '@mezon/store';
import { useMezon } from '@mezon/transport';
import React, { useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { preloadedState } from '../../mock/state';

interface AppModalProps {
	children: React.ReactNode;
	onClose: () => void;
}

const StickyModal: React.FC<AppModalProps> = ({ children, onClose }) => {
	const mezon = useMezon();
	const storeConfig = useMemo(() => (mezon ? initStore(mezon, preloadedState) : null), [mezon]);

	useEffect(() => {
		const modalWindow = window.open('', 'AppModal', 'width=600,height=400,left=200,top=100');

		if (!modalWindow || !storeConfig) return;

		modalWindow.document.body.innerHTML = "<div id='modal-root'></div>";
		const modalRoot = modalWindow.document.getElementById('modal-root');

		if (modalRoot) {
			ReactDOM.render(
				<MezonStoreProvider store={storeConfig.store} persistor={storeConfig.persistor} loading={null}>
					<div className="p-6 bg-white shadow-lg rounded-lg">
						<button
							onClick={() => {
								modalWindow.close();
								onClose();
							}}
							className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
						>
							&times;
						</button>
						{children}
					</div>
				</MezonStoreProvider>,
				modalRoot
			);
		}

		modalWindow.onbeforeunload = onClose;

		return () => {
			modalWindow.close();
		};
	}, [storeConfig]);

	return null;
};

export default StickyModal;
