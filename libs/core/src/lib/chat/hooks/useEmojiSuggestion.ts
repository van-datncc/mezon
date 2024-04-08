import {
	emojiSuggestionActions,
	selectAllEmojiSuggestion,
	selectEmojiListStatus,
	selectEmojiSuggestion,
	selectIsFocusEditor,
	selectTextToSearchEmojiSuggestion,
	useAppDispatch,
} from '@mezon/store';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';

export function useEmojiSuggestion() {
	const emojis = useSelector(selectAllEmojiSuggestion)[1];
	const isEmojiListShowed = useSelector(selectEmojiListStatus);
	const emojiPicked = useSelector(selectEmojiSuggestion);
	const isFocusEditor = useSelector(selectIsFocusEditor);
	const textToSearchEmojiSuggestion = useSelector(selectTextToSearchEmojiSuggestion);

	const dispatch = useAppDispatch();

	const setEmojiSuggestion = useCallback(
		(emoji: string) => {
			dispatch(emojiSuggestionActions.setSuggestionEmojiPicked(emoji));
		},
		[dispatch],
	);

	const setIsEmojiListShowed = useCallback(
		(isOpen: boolean) => {
			dispatch(emojiSuggestionActions.setStatusSuggestionEmojiList(isOpen));
		},
		[dispatch],
	);

	const setIsFocusEditorStatus = useCallback(
		(isFocus: boolean) => {
			dispatch(emojiSuggestionActions.setIsFocusEditor(isFocus));
		},
		[dispatch],
	);

	const setTextToSearchEmojiSuggesion = useCallback(
		(textSearch: string) => {
			dispatch(emojiSuggestionActions.setTextToSearchEmojiSuggestion(textSearch));
		},
		[dispatch],
	);

	return useMemo(
		() => ({
			emojis,
			emojiPicked,
			setEmojiSuggestion,
			setIsEmojiListShowed,
			isEmojiListShowed,
			setIsFocusEditorStatus,
			isFocusEditor,
			textToSearchEmojiSuggestion,
			setTextToSearchEmojiSuggesion,
		}),
		[
			emojis,
			emojiPicked,
			setEmojiSuggestion,
			setIsEmojiListShowed,
			isEmojiListShowed,
			setIsFocusEditorStatus,
			isFocusEditor,
			textToSearchEmojiSuggestion,
			setTextToSearchEmojiSuggesion,
		],
	);
}
