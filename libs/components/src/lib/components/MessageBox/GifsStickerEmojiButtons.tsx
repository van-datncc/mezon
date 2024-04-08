import { Icons } from '@mezon/components';
import { SubPanelName } from '@mezon/utils';
import { useCallback } from 'react';

export type GifStickerEmojiButtonsProps = {
	activeTab: SubPanelName;
};

function GifStickerEmojiButtons({ activeTab }: GifStickerEmojiButtonsProps) {
	const handleOpenGifs = useCallback(() => {}, []);

	const handleOpenStickers = useCallback(() => {}, []);

	const handleOpenEmoji = useCallback(() => {}, []);

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
