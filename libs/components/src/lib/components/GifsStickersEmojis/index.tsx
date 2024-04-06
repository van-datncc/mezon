import { useAppParams } from '@mezon/core';
import { ChannelStreamMode, ChannelType } from '@mezon/mezon-js';
import { selectCurrentChannel } from '@mezon/store';
import { EmojiPlaces, SubPanelName } from '@mezon/utils';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import EmojiPickerComp from '../EmojiPicker';
import GiphyComp from './gifs/GiphyComp';
import { InputSearch } from './inputSearch';
import ImageSquare from './stickers';

const GifStickerEmojiPopup = () => {
	const currentChannel = useSelector(selectCurrentChannel);
	const { type } = useAppParams();
	const [mod, setMod] = useState(0);
	const [activeTab, setActiveTab] = useState<string>('');

	useEffect(() => {
		if (Number(type) === ChannelType.CHANNEL_TYPE_GROUP) {
			setMod(ChannelStreamMode.STREAM_MODE_GROUP);
		} else if (Number(type) === ChannelType.CHANNEL_TYPE_DM) {
			setMod(ChannelStreamMode.STREAM_MODE_DM);
		} else {
			setMod(ChannelStreamMode.STREAM_MODE_CHANNEL);
		}
	}, [type]);

	const handleTabClick = (tab: string) => {
		setActiveTab(tab);
	};

	return (
		<div className="flex flex-col items-center w-[500px] h-fit min-h-[500px] rounded-lg bg-[#222222]">
			<div className=" w-full">
				<div className="flex justify-start flex-row w-full mt-2 border-b border-blue-500 pb-2">
					<button
						className={` px-2 mx-2 rounded-md ${activeTab === SubPanelName.GIFS ? ' font-semibold' : ' text-gray-300 hover:text-white'}`}
						onClick={() => handleTabClick(SubPanelName.GIFS)}
					>
						Gifs
					</button>
					<button
						className={` px-2 mx-2 rounded-md ${activeTab === SubPanelName.STICKERS ? 'font-semibold' : ' text-gray-300 hover:text-white'}`}
						onClick={() => handleTabClick(SubPanelName.STICKERS)}
					>
						Stickers
					</button>
					<button
						className={`px-2 mx-2 rounded-md ${activeTab === SubPanelName.EMOJI ? 'font-semibold' : ' text-gray-300 hover:text-white'}`}
						onClick={() => handleTabClick(SubPanelName.EMOJI)}
					>
						Emoji
					</button>
				</div>
				{activeTab !== SubPanelName.EMOJI && <InputSearch />}
			</div>

			<div className="w-full h-fit">
				{activeTab === SubPanelName.GIFS && (
					<div>
						<GiphyComp
							activeTab={SubPanelName.EMOJI}
							channelId={currentChannel?.id || ''}
							channelLabel={currentChannel?.channel_label || ''}
							mode={mod}
						/>
					</div>
				)}

				{activeTab === SubPanelName.STICKERS && (
					<ImageSquare channelId={currentChannel?.id || ''} channelLabel={currentChannel?.channel_label || ''} mode={mod} />
				)}

				{activeTab === SubPanelName.EMOJI && <EmojiPickerComp emojiAction={EmojiPlaces.EMOJI_EDITOR} />}
			</div>
		</div>
	);
};

export default GifStickerEmojiPopup;
