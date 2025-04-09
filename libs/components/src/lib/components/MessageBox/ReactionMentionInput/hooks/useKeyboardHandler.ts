import { RequestInput, handleBoldShortCut } from '@mezon/utils';
import { KeyboardEvent, RefObject, useCallback } from 'react';

interface UseKeyboardHandlerProps {
	editorRef: RefObject<HTMLInputElement | null>;
	draftRequest: RequestInput | null | undefined;
	updateDraft: (request: Partial<RequestInput>) => void;
	handleUndoRedoShortcut: (event: KeyboardEvent<HTMLTextAreaElement> | KeyboardEvent<HTMLInputElement>) => void;
	handleSend: (anonymousMode?: boolean) => void;
	anonymousMode: boolean;
}

export const useKeyboardHandler = ({
	editorRef,
	draftRequest,
	updateDraft,
	handleUndoRedoShortcut,
	handleSend,
	anonymousMode
}: UseKeyboardHandlerProps) => {
	const onKeyDown = useCallback(
		(event: KeyboardEvent<HTMLTextAreaElement> | KeyboardEvent<HTMLInputElement>): void => {
			const { key, ctrlKey, shiftKey, metaKey } = event;
			const isComposing = event.nativeEvent.isComposing;

			handleUndoRedoShortcut(event);

			if ((ctrlKey || metaKey) && (key === 'b' || key === 'B')) {
				handleBoldShortCut({
					editorRef,
					request: draftRequest || {
						valueTextInput: '',
						content: '',
						mentionRaw: []
					},
					setRequestInput: updateDraft
				});
			}

			switch (key) {
				case 'Enter': {
					if (shiftKey || isComposing) {
						return;
					} else {
						event.preventDefault();
						handleSend(anonymousMode);
						return;
					}
				}
				default: {
					return;
				}
			}
		},
		[draftRequest, handleSend, anonymousMode, updateDraft, handleUndoRedoShortcut, editorRef]
	);

	return { onKeyDown };
};
