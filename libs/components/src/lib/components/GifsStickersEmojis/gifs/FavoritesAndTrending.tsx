import { useChatSending, useGifs } from '@mezon/core';
import { IGifCategory, SubPanelName } from '@mezon/utils';
import GifCategory from './GifCategory';

type FavoritesAndTrendingProps = {
	activeTab: SubPanelName;
	channelId: string;
	channelLabel: string;
	controlEmoji?: boolean;
	clanId?: string;
	mode: number;
};

function FavoritesAndTrending({ channelId, channelLabel, mode }: FavoritesAndTrendingProps) {
	const { sendMessage } = useChatSending({ channelId, channelLabel, mode });
	const { dataGifCategories, dataGifsSearch, loadingStatusGifs, valueInputToCheckHandleSearch } = useGifs();
	console.log(valueInputToCheckHandleSearch);

	return (
		<>
			<div className="mx-2 grid grid-cols-2 justify-center h-[400px] overflow-y-scroll hide-scrollbar gap-2">
				{Array.isArray(dataGifCategories) &&
					dataGifCategories.map((item: IGifCategory, index: number) => <GifCategory gifCategory={item} key={index} />)}
			</div>
		</>
	);
}

export default FavoritesAndTrending;
