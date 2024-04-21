import { ThunkDispatch } from '@reduxjs/toolkit';
import {
	gifsActions,
	selectAllgifCategory,
	selectDataGifsTrending,
	selectGifsDataSearch,
	selectLoadingStatusGifs,
	selectValueInputSearch,
} from 'libs/store/src/lib/giftStickerEmojiPanel/gifs.slice';
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export function useGifs() {
	const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
	const dataGifCategories = useSelector(selectAllgifCategory)[0];
	const dataGifsSearch = useSelector(selectGifsDataSearch);
	const dataGifsTrending = useSelector(selectDataGifsTrending);

	const loadingStatusGifs = useSelector(selectLoadingStatusGifs);

	const valueInputToCheckHandleSearch = useSelector(selectValueInputSearch);

	const fetchGifsDataSearch = useCallback(
		(valueSearch: string) => {
			dispatch(gifsActions.fetchGifsDataSearch(valueSearch));
		},
		[dispatch],
	);

	const setValueInputSearch = useCallback(
		(valueSearch: string) => {
			dispatch(gifsActions.setValueInputSearch(valueSearch));
		},
		[dispatch],
	);
	const fetchGifsDataTrending = useCallback(() => {
		dispatch(gifsActions.fetchGifCategoryTrending());
	}, [dispatch]);
	return useMemo(
		() => ({
			fetchGifsDataSearch,
			dataGifCategories,
			dataGifsSearch,
			loadingStatusGifs,
			valueInputToCheckHandleSearch,
			setValueInputSearch,
			fetchGifsDataTrending,
		}),
		[
			dataGifCategories,
			fetchGifsDataSearch,
			dataGifsSearch,
			loadingStatusGifs,
			valueInputToCheckHandleSearch,
			setValueInputSearch,
			fetchGifsDataTrending,
		],
	);
}
