import { ChatContext } from '@mezon/core';
import { selectCurrentChannel } from '@mezon/store';
import { EmojiPlaces, TabNamePopup } from '@mezon/utils';
import { useContext } from 'react';
import { useSelector } from 'react-redux';
import EmojiPicker from '../EmojiPicker';
import GiphyComp from './gifs/gifs';
import { InputSearch } from './inputSearch';
import ImageSquare from './stickers';

const GifStickerEmojiPopup = () => {
	const { activeTab, setActiveTab } = useContext(ChatContext);
	const currentChannel = useSelector(selectCurrentChannel);

	const handleTabClick = (tab: string) => {
		setActiveTab(tab);
	};

	return (
		<div className="flex flex-col items-center w-[500px] h-fit min-h-[500px] rounded-lg bg-[#151617]">
			<div className=" w-full">
				<div className="flex justify-start flex-row w-full mt-2 border-b border-blue-500 pb-2">
					<button
						className={` px-2 mx-2 rounded-md ${activeTab === TabNamePopup.GIFS ? ' font-semibold' : ' text-gray-300 hover:text-white'}`}
						onClick={() => handleTabClick(TabNamePopup.GIFS)}
					>
						Gifs
					</button>
					<button
						className={` px-2 mx-2 rounded-md ${activeTab === TabNamePopup.STICKERS ? 'font-semibold' : ' text-gray-300 hover:text-white'}`}
						onClick={() => handleTabClick(TabNamePopup.STICKERS)}
					>
						Stickers
					</button>
					<button
						className={`px-2 mx-2 rounded-md ${activeTab === TabNamePopup.EMOJI ? 'font-semibold' : ' text-gray-300 hover:text-white'}`}
						onClick={() => handleTabClick(TabNamePopup.EMOJI)}
					>
						Emoji
					</button>
				</div>
				<InputSearch />
			</div>

			<div className="w-full h-fit">
				{activeTab === TabNamePopup.GIFS && (
					<div>
						<GiphyComp channelId={currentChannel?.id || ''} channelLabel={currentChannel?.channel_label || ''} mode={2} />
					</div>
				)}

				{activeTab === TabNamePopup.STICKERS && (
					<ImageSquare channelId={currentChannel?.id || ''} channelLabel={currentChannel?.channel_label || ''} mode={2} />
				)}

				{activeTab === TabNamePopup.EMOJI && (
					<div className="scale-75 transform right-5 mt-0 z-20 absolute">
						<EmojiPicker messageEmoji={undefined} emojiAction={EmojiPlaces.EMOJI_EDITOR} />
					</div>
				)}
			</div>
		</div>
	);
};

export default GifStickerEmojiPopup;
