import {
	emojiSuggestionActions,
	selectAddEmojiState,
	selectAllEmojiSuggestion,
	selectEmojiListStatus,
	selectEmojiObjSuggestion,
	selectShiftPressedStatus,
	selectTextToSearchEmojiSuggestion,
	useAppDispatch
} from '@mezon/store';
import { EmojiStorage, IEmoji } from '@mezon/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAuth } from '../../auth/hooks/useAuth';

interface EmojiSuggestionProps {
	isMobile?: boolean;
}

const filterEmojiData = (emojis: IEmoji[]) => {
	return emojis.map(({ id, src, shortname, category }) => ({
		id,
		src,
		category,
		shortname
	}));
};

export function useEmojiSuggestion({ isMobile = false }: EmojiSuggestionProps = {}) {
	const emojiMetadata = useSelector(selectAllEmojiSuggestion);
	const userId = useAuth();
	const [emojiRecentData, setEmojiRecentData] = useState<string | null>(null);

	useEffect(() => {
		const fetchRecentEmojis = async () => {
			try {
				const recentEmojis = await AsyncStorage.getItem('recentEmojis');
				if (recentEmojis !== null) {
					setEmojiRecentData(recentEmojis);
				}
			} catch (error) {
				console.error('Error fetching recent emojis:', error);
			}
		};

		if (isMobile) {
			fetchRecentEmojis();
		} else {
			const emojiRecentStorage = localStorage.getItem('recentEmojis');
			setEmojiRecentData(emojiRecentStorage);
		}
	}, [isMobile]);

	const emojisRecentDataParse = useMemo(() => {
		if (!emojiRecentData) return [];
		const parsedData = JSON.parse(emojiRecentData);
		return parsedData.filter((emojiItem: EmojiStorage) => emojiItem.senderId === userId.userId);
	}, [emojiRecentData, userId.userId]);

	const emojiConverted = useMemo(() => {
		return emojisRecentDataParse.reverse().map((item: EmojiStorage) => {
			const emojiFound = emojiMetadata.find((emoji) => emoji.shortname === item.emoji);
			return {
				id: emojiFound?.id,
				src: emojiFound?.src,
				category: 'Recent',
				shortname: emojiFound?.shortname
			};
		});
	}, [emojisRecentDataParse, emojiMetadata]);

	const emojis = useMemo(() => filterEmojiData([...emojiMetadata, ...emojiConverted]), [emojiMetadata, emojiConverted]);

	const isEmojiListShowed = useSelector(selectEmojiListStatus);
	const emojiPicked = useSelector(selectEmojiObjSuggestion);

	const textToSearchEmojiSuggestion = useSelector(selectTextToSearchEmojiSuggestion);
	const addEmojiState = useSelector(selectAddEmojiState);
	const shiftPressedState = useSelector(selectShiftPressedStatus);

	const dispatch = useAppDispatch();

	const setSuggestionEmojiObjPicked = useCallback(
		(emojId: string, emojiShortname: string) => {
			dispatch(emojiSuggestionActions.setSuggestionEmojiObjPicked({ id: emojId, shortName: emojiShortname }));
		},
		[dispatch]
	);

	const setIsEmojiListShowed = useCallback(
		(isOpen: boolean) => {
			dispatch(emojiSuggestionActions.setStatusSuggestionEmojiList(isOpen));
		},
		[dispatch]
	);

	const setTextToSearchEmojiSuggesion = useCallback(
		(textSearch: string) => {
			dispatch(emojiSuggestionActions.setTextToSearchEmojiSuggestion(textSearch));
		},
		[dispatch]
	);

	const setAddEmojiActionChatbox = useCallback(
		(isAdd: boolean) => {
			dispatch(emojiSuggestionActions.setAddEmojiActionChatbox(isAdd));
		},
		[dispatch]
	);

	const setShiftPressed = useCallback(
		(isPress: boolean) => {
			dispatch(emojiSuggestionActions.setShiftPressed(isPress));
		},
		[dispatch]
	);

	const categoriesEmoji = useMemo(
		() => ['Recent', 'Frequency', 'People', 'Nature', 'Food', 'Activities', 'Travel', 'Objects', 'Symbols', 'Flags'],
		[]
	);

	const categoryEmoji = useMemo(() => {
		return emojiMetadata
			.map((emoji) => ({
				id: emoji.clan_id,
				clan_name: emoji.clan_name,
				clan_logo: emoji.logo
			}))
			.filter((emoji, index, self) => emoji.id !== '0' && index === self.findIndex((s) => s.id === emoji.id));
	}, [emojiMetadata]);

	const clanNames = useMemo(() => {
		return categoryEmoji.map((emoji) => emoji.clan_name || '');
	}, [categoryEmoji]);

	useEffect(() => {
		categoriesEmoji.splice(2, 0, ...clanNames);
	}, [clanNames, categoriesEmoji]);

	return useMemo(
		() => ({
			emojiPicked,
			setIsEmojiListShowed,
			isEmojiListShowed,
			textToSearchEmojiSuggestion,
			setTextToSearchEmojiSuggesion,
			categoriesEmoji,
			categoryEmoji,
			setAddEmojiActionChatbox,
			addEmojiState,
			setShiftPressed,
			shiftPressedState,
			emojis,
			emojiConverted,
			setSuggestionEmojiObjPicked
		}),
		[
			emojiPicked,
			setIsEmojiListShowed,
			isEmojiListShowed,
			textToSearchEmojiSuggestion,
			setTextToSearchEmojiSuggesion,
			setAddEmojiActionChatbox,
			addEmojiState,
			setShiftPressed,
			shiftPressedState,
			emojis,
			emojiConverted,
			setSuggestionEmojiObjPicked,
			categoriesEmoji,
			categoryEmoji
		]
	);
}
