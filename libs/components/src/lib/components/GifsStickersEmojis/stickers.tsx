import { useChatSending, useGifsStickersEmoji } from '@mezon/core';
import { selectAllStickerSuggestion } from '@mezon/store';
import { IMessageSendPayload, SubPanelName } from '@mezon/utils';
import { ApiClanSticker, ApiMessageAttachment, ApiMessageMention, ApiMessageRef } from 'mezon-js/api.gen';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

type ChannelMessageBoxProps = {
	channelId: string;
	mode: number;
};

function ImageSquare({ channelId, mode }: ChannelMessageBoxProps) {
	const { sendMessage } = useChatSending({ channelId, mode });

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
	// TODO: separate data to another file
	const avts = [
		{ id: 1, url: 'https://cdn.mezon.vn/stickers/CrocosaurusStickers/emojibest_com_crocosaurus_0.gif', type: 'cs' },
		{ id: 2, url: 'https://cdn.mezon.vn/stickers/FredTheDog/emojibest_com_fred_the_pug_11.gif', type: 'dog' },
		{ id: 3, url: 'https://cdn.mezon.vn/stickers/SamuraiDojo/emojibest_com_samorai__dojo_8.gif', type: 'cat' },
	];

	const stickerList = useSelector(selectAllStickerSuggestion)
	const { setSubPanelActive } = useGifsStickersEmoji();
	const [selectedType, setSelectedType] = useState('');
	const [selectImage, setSelectImage] = useState<any>(stickerList);
	const handleClickImage = (imageUrl: string) => {
		handleSend({ t: '' }, [], [{ url: imageUrl, height: 40, width: 40, filetype: 'image/gif' }], []);
		setSubPanelActive(SubPanelName.NONE);
	};

	const handleClickAvt = (type: string) => {
		setSelectedType(type);
	};

	useEffect(() => {
		const filteredImages = selectedType ? stickerList.filter((image) => image.category === selectedType) : stickerList;
		if (filteredImages.length > 0) {
			setSelectImage(filteredImages);
		}
	}, [selectedType]);

	return (
		<div className="flex h-full pr-2 w-full md:w-[500px]">
			<div className="w-[60%] md:w-[40%] md:max-w-[40%] flex flex-col px-2 gap-y-2 max-w-[60%]">
				{avts.map((avt) => (
					<img
						key={avt.id}
						src={avt.url}
						alt={`avt ${avt.id}`}
						className={`w-full h-auto cursor-pointer dark:hover:bg-bgDisable hover:bg-bgLightModeButton ${avt.type === selectedType ? 'bg-bgDisable' : ''} hover:rounded-lg justify-center items-center border border-bgHoverMember rounded-lg`}
						onClick={() => handleClickAvt(avt.type)}
						role="button"
					/>
				))}
			</div>
			<div className="w-auto pb-2">
				<div className="grid grid-cols-3 gap-4 max-h-[400px] overflow-y-scroll hide-scrollbar">
					{selectImage.map((image: ApiClanSticker) => (
						<img
							key={image.id}
							src={image.source}
							alt={`Img`}
							className="w-full h-full object-cover cursor-pointer dark:hover:bg-bgDisable hover:bg-bgLightModeButton hover:rounded-lg border border-bgHoverMember rounded-lg"
							onClick={() => handleClickImage(image.source ?? '')}
							role="button"
						/>
					))}
				</div>
			</div>
		</div>
	);
}

export default ImageSquare;
