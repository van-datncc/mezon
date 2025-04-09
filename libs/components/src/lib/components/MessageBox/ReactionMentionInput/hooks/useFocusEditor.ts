import { CHANNEL_INPUT_ID, GENERAL_INPUT_ID } from '@mezon/utils';
import { RefObject, useCallback } from 'react';

interface UseFocusEditorProps {
	editorRef: RefObject<HTMLInputElement | HTMLDivElement | HTMLUListElement>;
	isTopic?: boolean;
}

export const useFocusEditor = ({ editorRef, isTopic = false }: UseFocusEditorProps) => {
	const getTargetInputId = useCallback(() => {
		return isTopic ? GENERAL_INPUT_ID : CHANNEL_INPUT_ID;
	}, [isTopic]);

	const focusEditor = useCallback(() => {
		if (editorRef.current && editorRef.current.id === getTargetInputId()) {
			editorRef.current.focus();
		}
	}, [editorRef, getTargetInputId]);

	const focusEditorIfMatch = useCallback(
		(element: HTMLElement | null, targetInputId?: string) => {
			const expectedId = targetInputId || getTargetInputId();
			if (element && element.id === expectedId) {
				element.focus();
			}
		},
		[getTargetInputId]
	);

	return {
		focusEditor,
		focusEditorIfMatch,
		getTargetInputId
	};
};
