import { ChatContext } from '@mezon/core';
import { selectCurrentChannel } from '@mezon/store';
import { EmojiPlaces, TabNamePopup } from '@mezon/utils';
import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { Icons } from '../../components';
import EmojiPicker from '../EmojiPicker';
import ImageSquare from './stickers';

const GifStickerEmojiPopup = () => {
	const { activeTab, setActiveTab } = useContext(ChatContext);
	const currentChannel = useSelector(selectCurrentChannel);

	const handleTabClick = (tab: string) => {
		setActiveTab(tab);
	};

	return (
		<div className="flex flex-col items-center w-[500px] h-fit rounded-lg bg-[#151617]">
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
				<div
					className={`transition-all duration-300 h-8 pl-4 pr-2 py-3 bg-[#1E1F22] relative rounded items-center inline-flex w-[97%] m-2 text-center`}
				>
					<input
						type="text"
						placeholder="Search"
						className="text-[#AEAEAE] font-['Manrope'] placeholder-[#AEAEAE] outline-none bg-transparent w-full"
					/>
					<div className="w-5 h-6 flex flex-row items-center pl-1 absolute right-1 bg-[#1E1F22] top-1/4 transform -translate-y-1/2 m-2 cursor-pointer">
						<Icons.Search />
					</div>
				</div>
			</div>

			<div className="w-full h-fit">
				{activeTab === TabNamePopup.GIFS && <div>Gifs content goes here</div>}

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
