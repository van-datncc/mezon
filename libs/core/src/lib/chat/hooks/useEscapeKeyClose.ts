import { RefObject, useEffect } from 'react';

export const useEscapeKeyClose = (ref: RefObject<HTMLElement> | undefined, onClose: () => void) => {
	useEffect(() => {
		const element = ref?.current;
		if (!element) return;
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape' || event.key === 'Esc') {
				onClose();
			}
		};
		document.addEventListener('keydown', handleKeyDown);
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [ref, onClose]);
};
