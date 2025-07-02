import { RequestInput, handleBoldShortCut } from '@mezon/utils';
import { KeyboardEvent, RefObject, useCallback } from 'react';

interface UseKeyboardHandlerProps {
	editorRef: RefObject<HTMLInputElement | null>;
	draftRequest: RequestInput | null | undefined;
	updateDraft: (request: Partial<RequestInput>) => void;
	handleUndoRedoShortcut: (event: KeyboardEvent<HTMLTextAreaElement> | KeyboardEvent<HTMLInputElement>) => void;
	handleSend: (anonymousMode?: boolean) => void;
	anonymousMode: boolean;
	isEphemeralMode?: boolean;
	setIsEphemeralMode?: (mode: boolean) => void;
	setEphemeralTargetUserId?: (userId: string | null) => void;
	setEphemeralTargetUserDisplay?: (display: string | null) => void;
	ephemeralTargetUserId?: string | null;
}

export const useKeyboardHandler = ({
	editorRef,
	draftRequest,
	updateDraft,
	handleUndoRedoShortcut,
	handleSend,
	anonymousMode,
	isEphemeralMode,
	setIsEphemeralMode,
	setEphemeralTargetUserId,
	setEphemeralTargetUserDisplay,
	ephemeralTargetUserId
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
				case 'Escape': {
					if (
						(isEphemeralMode || ephemeralTargetUserId) &&
						setIsEphemeralMode &&
						setEphemeralTargetUserId &&
						setEphemeralTargetUserDisplay
					) {
						event.preventDefault();
						setIsEphemeralMode(false);
						setEphemeralTargetUserId(null);
						setEphemeralTargetUserDisplay(null);
						updateDraft({
							valueTextInput: '',
							content: '',
							mentionRaw: []
						});
					}
					return;
				}
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
		[
			draftRequest,
			handleSend,
			anonymousMode,
			updateDraft,
			handleUndoRedoShortcut,
			editorRef,
			isEphemeralMode,
			setIsEphemeralMode,
			setEphemeralTargetUserId,
			setEphemeralTargetUserDisplay,
			ephemeralTargetUserId
		]
	);

	return { onKeyDown };
};
