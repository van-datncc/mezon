import { Icons } from '@mezon/components';
import { useGifsStickersEmoji } from '@mezon/core';
import { SubPanelName } from '@mezon/utils';
import { useCallback } from 'react';

export type GifStickerEmojiButtonsProps = {
	activeTab: SubPanelName;
};

function GifStickerEmojiButtons({ activeTab }: GifStickerEmojiButtonsProps) {
	const { setSubPanelActive } = useGifsStickersEmoji();

	const handleOpenGifs = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			e.stopPropagation(); // Ngăn chặn sự lan truyền của sự kiện
			setSubPanelActive(SubPanelName.GIFS);
		},
		[setSubPanelActive],
	);

	const handleOpenStickers = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			e.stopPropagation(); // Ngăn chặn sự lan truyền của sự kiện
			setSubPanelActive(SubPanelName.STICKERS);
		},
		[setSubPanelActive],
	);

	const handleOpenEmoji = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			e.stopPropagation(); // Ngăn chặn sự lan truyền của sự kiện
			setSubPanelActive(SubPanelName.EMOJI);
		},
		[setSubPanelActive],
	);

	return (
		<div className="flex flex-row h-full items-center gap-1 w-18 mr-3 relative">
			<div onClick={handleOpenGifs} className="cursor-pointer">
				<Icons.Gif defaultFill={`${activeTab === SubPanelName.GIFS ? '#FFFFFF' : '#AEAEAE'}`} />
			</div>

			<div onClick={handleOpenStickers} className="cursor-pointer">
				<Icons.Sticker defaultFill={`${activeTab === SubPanelName.STICKERS ? '#FFFFFF' : '#AEAEAE'}`} />
			</div>

			<div onClick={handleOpenEmoji} className="cursor-pointer">
				<Icons.Smile defaultFill={`${activeTab === SubPanelName.EMOJI ? '#FFFFFF' : '#AEAEAE'}`} />
			</div>
		</div>
	);
}

export default GifStickerEmojiButtons;
