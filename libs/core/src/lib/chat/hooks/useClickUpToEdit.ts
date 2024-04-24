import { RefObject, useEffect } from 'react';

export const useClickUpToEdit = <T extends HTMLElement = HTMLElement>(ref: RefObject<T>, value: string, handler: () => void) => {
	useEffect(() => {
		const editorElement = ref.current;

		if (!editorElement) {
			return;
		}

		const handleKeyPress = (event: KeyboardEvent) => {
			if (value) return;
			if (event.key === 'ArrowUp') {
				event.preventDefault();
				handler();
			}
		};

		editorElement.addEventListener('keydown', handleKeyPress);

		return () => {
			editorElement.removeEventListener('keydown', handleKeyPress);
		};
	}, [handler, ref, value]);
};
