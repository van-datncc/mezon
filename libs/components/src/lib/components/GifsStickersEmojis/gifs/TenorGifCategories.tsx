import { useChatSending, useGifs } from '@mezon/core';
import { IGifCategory, IMessageSendPayload, SubPanelName } from '@mezon/utils';
import { Loading } from 'libs/ui/src/lib/Loading';
import { ApiMessageAttachment, ApiMessageMention, ApiMessageRef } from 'mezon-js/api.gen';
import { useCallback, useEffect, useState } from 'react';
import FeaturedGifs from './FeaturedGifs';
import GifCategory from './GifCategory';

type ChannelMessageBoxProps = {
	activeTab: SubPanelName;
	channelId: string;
	channelLabel: string;
	controlEmoji?: boolean;
	clanId?: string;
	mode: number;
};

function TenorGifCategories({ channelId, channelLabel, mode }: ChannelMessageBoxProps) {
	const { sendMessage } = useChatSending({ channelId, channelLabel, mode });
	const { dataGifCategories, dataGifsSearch, loadingStatusGifs, valueInputToCheckHandleSearch, dataGifsFeartured } = useGifs();
	const [showCategories, setShowCategories] = useState<boolean>(false);
	useEffect(() => {
		if (valueInputToCheckHandleSearch === '' || dataGifsSearch.length === 0) {
			setShowCategories(true);
		} else {
			setShowCategories(false);
		}
	}, [valueInputToCheckHandleSearch, dataGifsSearch]);

	const handleSend = useCallback(
		(
			content: IMessageSendPayload,
			mentions?: Array<ApiMessageMention>,
			attachments?: Array<ApiMessageAttachment>,
			references?: Array<ApiMessageRef>,
		) => {
			sendMessage(content, mentions, attachments, references);
		},
		[sendMessage],
	);

	const handleClickGif = (giftUrl: string) => {
		handleSend({ t: '' }, [], [{ url: giftUrl }], []);
	};

	const renderGifCategories = () => {
		if (loadingStatusGifs === 'loading') {
			return <Loading />;
		}
		return (
			<>
				<div className="mx-2 grid grid-cols-2 justify-center h-[400px] overflow-y-scroll hide-scrollbar gap-2">
					<FeaturedGifs channelId={channelId} channelLabel={channelLabel} mode={mode} />

					{Array.isArray(dataGifCategories) &&
						dataGifCategories.map((item: IGifCategory, index: number) => <GifCategory gifCategory={item} key={index} />)}
				</div>
			</>
		);
	};

	const renderGifSearch = () => {
		if (loadingStatusGifs === 'loading') {
			return <Loading />;
		}
		return (
			<div className="mx-2 flex justify-center h-[400px] overflow-y-scroll hide-scrollbar flex-wrap">
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1">
					{dataGifsSearch.map((gif: any, index: number) => (
						<div
							key={gif.id}
							className={`order-${index} overflow-hidden cursor-pointer`}
							onClick={() => handleClickGif(gif.media_formats.gif.url)}
						>
							<img src={gif.media_formats.gif.url} alt={gif.media_formats.gif.url} className="w-full h-auto" />
						</div>
					))}
				</div>
			</div>
		);
	};

	return <>{showCategories ? renderGifCategories() : renderGifSearch()}</>;
}

export default TenorGifCategories;
