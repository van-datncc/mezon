import {
	emojiSuggestionActions,
	selectAddEmojiState,
	selectAllEmojiSuggestion,
	selectEmojiListStatus,
	selectEmojiSuggestion,
	selectShiftPressedStatus,
	selectTextToSearchEmojiSuggestion,
	useAppDispatch,
} from '@mezon/store';
import { IEmoji } from '@mezon/utils';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';

const categoriesEmoji = ['Recent', 'Custom', 'People', 'Nature', 'Food', 'Activities', 'Travel', 'Objects', 'Symbols', 'Flags'];

const filterEmojiData = (emojis: IEmoji[]) => {
	return emojis.map(({ src, shortname, category }) => ({
		src,
		category,
		shortname,
	}));
};

export function useEmojiSuggestion() {
	const emojiMetadata = useSelector(selectAllEmojiSuggestion);
	const emojiRecentData = localStorage.getItem('recentEmojis');
	const emojisRecentDataParse = emojiRecentData ? JSON.parse(emojiRecentData) : [];

	function convertedEmojiRecent(emojiArr: any, emojiSource: any) {
		return emojiArr.map((item: any) => {
			const emojiFound = Array.isArray(emojiSource) && emojiSource.find((emoji: any) => emoji.shortname === item.emoji);
			return {
				src: emojiFound.src,
				category: 'Recent', 
				shortName: item.emoji,
			};
		});
	}

	const emojiConverted = convertedEmojiRecent(emojisRecentDataParse, emojiMetadata);
	const emojiCombine = [...emojiMetadata, ...emojiConverted];

	const emojis = useMemo(() => filterEmojiData(emojiCombine), [emojiCombine]);
	const isEmojiListShowed = useSelector(selectEmojiListStatus);
	const emojiPicked = useSelector(selectEmojiSuggestion);
	const textToSearchEmojiSuggestion = useSelector(selectTextToSearchEmojiSuggestion);
	const addEmojiState = useSelector(selectAddEmojiState);
	const shiftPressedState = useSelector(selectShiftPressedStatus);

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

	const setTextToSearchEmojiSuggesion = useCallback(
		(textSearch: string) => {
			dispatch(emojiSuggestionActions.setTextToSearchEmojiSuggestion(textSearch));
		},
		[dispatch],
	);

	const setAddEmojiActionChatbox = useCallback(
		(isAdd: boolean) => {
			dispatch(emojiSuggestionActions.setAddEmojiActionChatbox(isAdd));
		},
		[dispatch],
	);

	const setShiftPressed = useCallback(
		(isPress: boolean) => {
			dispatch(emojiSuggestionActions.setShiftPressed(isPress));
		},
		[dispatch],
	);

	return useMemo(
		() => ({
			emojiPicked,
			setEmojiSuggestion,
			setIsEmojiListShowed,
			isEmojiListShowed,
			textToSearchEmojiSuggestion,
			setTextToSearchEmojiSuggesion,
			categoriesEmoji,
			setAddEmojiActionChatbox,
			addEmojiState,
			setShiftPressed,
			shiftPressedState,
			emojis,
		}),
		[
			emojiPicked,
			setEmojiSuggestion,
			setIsEmojiListShowed,
			isEmojiListShowed,
			textToSearchEmojiSuggestion,
			setTextToSearchEmojiSuggesion,
			setAddEmojiActionChatbox,
			addEmojiState,
			setShiftPressed,
			shiftPressedState,
			emojis,
		],
	);
}
