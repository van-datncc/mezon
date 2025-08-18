import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ModalPortalProps {
	children: React.ReactNode;
	isOpen: boolean;
}

function ModalPortal({ children, isOpen }: ModalPortalProps): JSX.Element | null {
	const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);

	useEffect(() => {
		let modalRoot = document.getElementById('modal-root');
		
		if (!modalRoot) {
			modalRoot = document.createElement('div');
			modalRoot.id = 'modal-root';
			modalRoot.style.position = 'fixed';
			modalRoot.style.top = '0';
			modalRoot.style.left = '0';
			modalRoot.style.width = '100%';
			modalRoot.style.height = '100%';
			modalRoot.style.pointerEvents = 'none';
			modalRoot.style.zIndex = '9999';
			document.body.appendChild(modalRoot);
		}

		setPortalElement(modalRoot);

		return () => {
			if (modalRoot && modalRoot.children.length === 0) {
				document.body.removeChild(modalRoot);
			}
		};
	}, []);

	useEffect(() => {
		if (portalElement) {
			portalElement.style.pointerEvents = isOpen ? 'auto' : 'none';
		}
	}, [isOpen, portalElement]);

	if (!portalElement || !isOpen) return null;

	return createPortal(children, portalElement) as JSX.Element;
}

export default ModalPortal;
