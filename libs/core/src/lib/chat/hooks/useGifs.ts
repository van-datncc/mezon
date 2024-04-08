import { ThunkDispatch } from '@reduxjs/toolkit';
import { gifsActions, selectAllgifs, selectGifsDataSearch, selectLoadingStatusGifs } from 'libs/store/src/lib/giftStickerEmojiPanel/gifs.slice';
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export function useGifs() {
	const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
	const dataGifs = useSelector(selectAllgifs);
	const dataGifsSearch = useSelector(selectGifsDataSearch);
	const loadingStatusGifs = useSelector(selectLoadingStatusGifs);

	const fetchGifsDataSearch = useCallback(
		(valueSearch: string) => {
			console.log(valueSearch);
			dispatch(gifsActions.fetchGifsDataSearch(valueSearch));
		},
		[dispatch],
	);

	return useMemo(
		() => ({
			fetchGifsDataSearch,
			dataGifs,
			dataGifsSearch,
			loadingStatusGifs,
		}),
		[dataGifs, fetchGifsDataSearch, dataGifsSearch, loadingStatusGifs],
	);
}
