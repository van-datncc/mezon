import { emojiSuggestionActions, getStore, selectEmojiFromTopic } from '@mezon/store';
import { CHANNEL_INPUT_ID, GENERAL_INPUT_ID } from '@mezon/utils';
import { RefObject, useCallback, useEffect } from 'react';
import textFieldEdit from 'text-field-edit';

interface UseEmojiPickerProps {
	editorRef: RefObject<HTMLInputElement>;
	emojiPicked: any;
	addEmojiState: any;
	dispatch: any;
	focusEditorIfMatch: (element: HTMLElement | null, targetInputId?: string) => void;
}

export const useEmojiPicker = ({ editorRef, emojiPicked, addEmojiState, dispatch, focusEditorIfMatch }: UseEmojiPickerProps) => {
	const handleEmojiSelection = useCallback(() => {
		const isEmptyEmojiPicked = emojiPicked && Object.keys(emojiPicked).length === 1 && emojiPicked[''] === '';

		if (isEmptyEmojiPicked || !editorRef?.current) {
			return;
		}

		if (emojiPicked) {
			const store = getStore();
			const fromTopic = selectEmojiFromTopic(store.getState());

			for (const [emojiKey, emojiValue] of Object.entries(emojiPicked)) {
				const targetInputId = fromTopic ? GENERAL_INPUT_ID : CHANNEL_INPUT_ID;

				if (editorRef.current?.id === targetInputId) {
					textFieldEdit.insert(editorRef.current, `::[${emojiKey}](${emojiValue})${' '}`);
					focusEditorIfMatch(editorRef.current, targetInputId);
					dispatch(
						emojiSuggestionActions.setSuggestionEmojiObjPicked({
							shortName: '',
							id: '',
							isReset: true
						})
					);
				}
			}
		}
	}, [emojiPicked, dispatch, editorRef, focusEditorIfMatch]);

	useEffect(() => {
		handleEmojiSelection();
	}, [emojiPicked, addEmojiState, handleEmojiSelection]);

	return {
		handleEmojiSelection
	};
};
