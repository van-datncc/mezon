import { useGifs, useGifsStickersEmoji } from '@mezon/core';
import { GifCategoriesEntity } from '@mezon/store-mobile';
import { useEffect, useState } from 'react';
import GifCategory from './GifCategory';
import GiftItem from './GifItem';

type GifSelectorProps = {
	onSelected: (url: string) => void;
	searchText: string;
};

export default function GifSelector({ onSelected, searchText }: GifSelectorProps) {
	const [gifData, setGifData] = useState<any>();

	const { dataGifCategories, dataGifsSearch, loadingStatusGifs, dataGifsFeartured, trendingClickingStatus, setButtonArrowBack, fetchGifsDataSearch } = useGifs();

	const { valueInputToCheckHandleSearch, setValueInputSearch } = useGifsStickersEmoji();

	useEffect(() => {
		fetchGifsDataSearch(searchText);
		setValueInputSearch(searchText);
	}, [searchText]);

	useEffect(() => {
		if (dataGifsSearch.length > 0 && valueInputToCheckHandleSearch !== '') {
			setGifData(dataGifsSearch);
		} else if (trendingClickingStatus) {
			setGifData(dataGifsFeartured);
		} else if (valueInputToCheckHandleSearch === '') {
			setButtonArrowBack(false);
		}
	}, [dataGifsSearch, trendingClickingStatus, valueInputToCheckHandleSearch]);

	function handleGifPress(url: string) {
		onSelected && onSelected(url);
	}

	return valueInputToCheckHandleSearch === '' ? (
		<GifCategory
			loading={loadingStatusGifs === 'loading'}
			data={dataGifCategories as unknown as GifCategoriesEntity[]}
		/>
	) : (
		<GiftItem
			loading={loadingStatusGifs === 'loading'}
			data={gifData}
			onPress={handleGifPress}
		/>
	);
}
