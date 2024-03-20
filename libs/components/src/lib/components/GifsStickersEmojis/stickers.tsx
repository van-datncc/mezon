import { useChatSending } from '@mezon/core';
import { IMessageSendPayload } from '@mezon/utils';
import crocosaurus0 from 'libs/assets/src/assets/stickers/Crocosaurus Stickers/emojibest_com_crocosaurus_0.gif';
import crocosaurus18 from 'libs/assets/src/assets/stickers/Crocosaurus Stickers/emojibest_com_crocosaurus_18.gif';
import crocosaurus4 from 'libs/assets/src/assets/stickers/Crocosaurus Stickers/emojibest_com_crocosaurus_4.gif';
import EmojiDom13 from 'libs/assets/src/assets/stickers/EmojiDom/emojibest_com_emojidom_anim_13.gif';
import EmojiDom5 from 'libs/assets/src/assets/stickers/EmojiDom/emojibest_com_emojidom_anim_5.gif';
import EmojiDom8 from 'libs/assets/src/assets/stickers/EmojiDom/emojibest_com_emojidom_anim_8.gif';
import FredTheDog0 from 'libs/assets/src/assets/stickers/FredTheDog/emojibest_com_fred_the_pug_0 (1).gif';
import FredTheDog1 from 'libs/assets/src/assets/stickers/FredTheDog/emojibest_com_fred_the_pug_1.gif';
import FredTheDog11 from 'libs/assets/src/assets/stickers/FredTheDog/emojibest_com_fred_the_pug_11.gif';
import MemesWithCats11 from 'libs/assets/src/assets/stickers/Memes With Cats/emojibest_com_memes_with_cats_11.gif';
import MemesWithCats17 from 'libs/assets/src/assets/stickers/Memes With Cats/emojibest_com_memes_with_cats_17.gif';
import MemesWithCats7 from 'libs/assets/src/assets/stickers/Memes With Cats/emojibest_com_memes_with_cats_7.gif';
import SamuraiDojo0 from 'libs/assets/src/assets/stickers/SamuraiDojo/emojibest_com_samorai__dojo_0.gif';
import SamuraiDojo7 from 'libs/assets/src/assets/stickers/SamuraiDojo/emojibest_com_samorai__dojo_7.gif';
import SamuraiDojo8 from 'libs/assets/src/assets/stickers/SamuraiDojo/emojibest_com_samorai__dojo_8.gif';
import { useCallback, useState } from 'react';
import { ApiMessageAttachment, ApiMessageMention, ApiMessageRef } from 'vendors/mezon-js/packages/mezon-js/api.gen';

type ChannelMessageBoxProps = {
	channelId: string;
	channelLabel: string;
	controlEmoji?: boolean;
	clanId?: string;
	mode: number;
};

function ImageSquare({ channelId, channelLabel, mode }: ChannelMessageBoxProps) {
	const [attachmentData, setAttachmentData] = useState<ApiMessageAttachment[]>([]);

	const { sendMessage } = useChatSending({ channelId, channelLabel, mode });
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

	const avts = [
		{ id: 1, url: 'https://www.emojibest.com/Crocosaurus/crocosaurus_1.webp' },
		{ id: 2, url: 'https://www.emojibest.com/FredThePug/fred_the_pug_3.webp' },
		{ id: 3, url: 'https://www.emojibest.com/MemesWithCats/memes_with_cats_0.webp' },
	];
	const images = [
		{ id: 1, url: crocosaurus0 },
		{ id: 2, url: crocosaurus4 },
		{ id: 3, url: crocosaurus18 },
		{ id: 4, url: FredTheDog0 },
		{ id: 5, url: FredTheDog1 },
		{ id: 6, url: FredTheDog11 },
		{ id: 7, url: MemesWithCats7 },
		{ id: 8, url: MemesWithCats11 },
		{ id: 9, url: MemesWithCats17 },
		{ id: 10, url: SamuraiDojo0 },
		{ id: 11, url: SamuraiDojo7 },
		{ id: 12, url: SamuraiDojo8 },
		{ id: 13, url: EmojiDom5 },
		{ id: 14, url: EmojiDom8 },
		{ id: 15, url: EmojiDom13 },
	];

	const handleClickImage = (imageUrl: string) => {
		handleSend({ t: '' }, [], [{ url: imageUrl, height: 20,size:20 }], []);
	};

	return (
		<div className="flex h-full">
			<div className="w-[40%] py-4 mx-1  p-1 flex flex-col">
				{avts.map((avt) => (
					<img
						key={avt.id}
						src={avt.url}
						alt={`avt ${avt.id}`}
						className="w-full h-auto cursor-pointer hover:bg-bgDisable hover:rounded-lg justify-center items-center"
					/>
				))}
			</div>
			<div className="w-auto pb-2">
				<div className="grid grid-cols-3 gap-4 max-h-[400px] overflow-y-scroll">
					{images.map((image) => (
						<img
							key={image.id}
							src={image.url}
							alt={`Image ${image.id}`}
							className="w-full h-auto cursor-pointer hover:bg-bgDisable hover:rounded-lg"
							onClick={() => handleClickImage(image.url)}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

export default ImageSquare;
