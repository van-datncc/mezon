import { RefObject, useEffect } from 'react';

export const useClickUpToEdit = <T extends HTMLElement = HTMLElement>(ref: RefObject<T>, handler: () => void) => {
	useEffect(() => {
		const editorElement = ref.current;

		if (!editorElement) {
			return;
		}

		const handleKeyPress = (event: KeyboardEvent) => {
			if (event.key === 'ArrowUp') {
				handler();
			}
		};

		editorElement.addEventListener('keydown', handleKeyPress);

		return () => {
			editorElement.removeEventListener('keydown', handleKeyPress);
		};
	}, [handler, ref]);
};
