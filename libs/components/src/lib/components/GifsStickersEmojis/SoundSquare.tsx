import { useChatSending, useEscapeKeyClose } from '@mezon/core';
import { selectCurrentTopicId } from '@mezon/store';
import { IMessageSendPayload } from '@mezon/utils';
import { ApiChannelDescription, ApiMessageAttachment, ApiMessageMention, ApiMessageRef } from 'mezon-js/api.gen';
import { useCallback, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { AudioAttachment } from '../ThumbnailAttachmentRender';

type ChannelMessageBoxProps = {
	channel: ApiChannelDescription | undefined;
	mode: number;
	onClose: () => void;
};

interface ICategorizedSoundProps {
	soundList: any[];
	categoryName: string;
	onClickSound: (soundUrl: SoundPanel) => void;
	valueInputToCheckHandleSearch?: string;
}

interface ISoundPanelProps {
	soundList: SoundPanel[];
	onClickSound: (soundUrl: SoundPanel) => void;
}

type SoundPanel = {
	type?: string;
	url?: string;
	id?: string;
};

export interface ClanSound {
	category?: string;
	clan_id?: string;
	create_time?: string;
	creator_id?: string;
	id?: string;
	shortname?: string;
	source?: string;
	logo?: string;
	clan_name?: string;
}

const searchSounds = (sounds: ClanSound[], searchTerm: string) => {
	if (!searchTerm) return sounds;
	const lowerCaseSearchTerm = searchTerm.trim().toLowerCase();
	return sounds.filter((item) => item?.shortname?.toLowerCase().includes(lowerCaseSearchTerm));
};

function SoundSquare({ channel, mode, onClose }: ChannelMessageBoxProps) {
	const audio1 = 'https://cdn.mezon.vn/0/1821757488236597248/1787375123666309000/1738831579632_0Shrek__oh_hello_there__.mp3';
	const audio2 = 'https://cdn.mezon.vn/0/1821757488236597248/1787375123666309000/1738831591788_0galaxy_meme.mp3';

	const clanSounds = [
		{
			id: '123',
			url: audio1,
			label: 'audio1',
			category: 'Among Us',
			creator_id: '1775731111020728320',
			clan_id: '1775731152322039808',
			clan_name: '🍻thaiphamquocdsdfsfsfsfs'
		},
		{
			id: '456',
			url: audio2,
			label: 'audio2',
			category: 'Among Us',
			creator_id: '1775731111020728320',
			clan_id: '1775731152322039808',
			clan_name: '🍻thaiphamquocdsdfsfsfsfs'
		}
	];

	// const clanSounds = useAppSelector(selectAllSoundSuggestion);
	const { sendMessage } = useChatSending({ channelOrDirect: channel, mode });
	const currentTopicId = useSelector(selectCurrentTopicId);
	// const { valueInputToCheckHandleSearch, subPanelActive } = useSounds();
	// const [searchedSounds, setSearchSounds] = useState<ClanSound[]>([]);

	// useEffect(() => {
	// 	const result = searchSounds(clanSounds, valueInputToCheckHandleSearch ?? '');
	// 	setSearchSounds(result);
	// }, [valueInputToCheckHandleSearch, subPanelActive, clanSounds]);

	const handleSend = useCallback(
		(
			content: IMessageSendPayload,
			mentions?: Array<ApiMessageMention>,
			attachments?: Array<ApiMessageAttachment>,
			references?: Array<ApiMessageRef>
		) => {
			sendMessage(content, mentions, attachments, references);
		},
		[sendMessage]
	);

	// const categoryLogo = clanSounds
	// 	.map((sound) => ({
	// 		id: sound.clan_id,
	// 		type: sound.clan_name,
	// 		url: sound.icon
	// 	}))
	// 	.filter((sound, index, self) => index === self.findIndex((s) => s.id === sound.id));

	// const sounds = useMemo(() => {
	// 	return [
	// 		...searchedSounds.map((sound) => ({
	// 			id: sound.id,
	// 			url: sound.source,
	// 			type: sound.clan_name
	// 		}))
	// 	].filter(Boolean);
	// }, [searchedSounds]);

	// const { setSubPanelActive } = useSounds();
	const [selectedType, setSelectedType] = useState('');
	const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
	const containerRef = useRef<HTMLDivElement>(null);

	// const handleClickSound = (sound: SoundPanel) => {
	// 	handleSend({ t: '' }, [], [{ url: sound.url, filetype: 'audio/mpeg', filename: sound.id }], []);
	// 	setSubPanelActive(SubPanelName.NONE);
	// };

	const modalRef = useRef<HTMLDivElement>(null);
	useEscapeKeyClose(modalRef, onClose);

	return (
		<div ref={modalRef} tabIndex={-1} className="outline-none flex h-full w-full md:w-[500px] max-sm:ml-1">
			<div className="overflow-y-auto overflow-x-hidden hide-scrollbar h-[25rem] rounded md:ml-2 ">
				{/* <div className="w-11 flex flex-col gap-y-1 dark:bg-[#1E1F22] bg-bgLightModeSecond pt-1 px-1 md:items-start pb-1 rounded items-center min-h-[25rem]">
					{categoryLogo.map((cat) => (
						<button key={cat.id} className="flex justify-center items-center w-9 h-9 rounded-lg hover:bg-[#41434A]">
							{cat.url !== '' ? (
								<img
									src={cat.url}
									alt={cat.type}
									className="w-7 h-7 object-cover aspect-square cursor-pointer border border-bgHoverMember rounded-full"
								/>
							) : (
								<div className="dark:text-textDarkTheme text-textLightTheme">{cat?.type?.charAt(0).toUpperCase()}</div>
							)}
						</button>
					))}
				</div> */}
			</div>
			<div className="flex flex-col h-[400px] overflow-y-auto flex-1 hide-scrollbar" ref={containerRef}>
				<AudioAttachment attachment={sounds} />
			</div>
		</div>
	);
}
export default SoundSquare;

// const SoundPanel: React.FC<ISoundPanelProps> = ({ soundList, onClickSound }) => {
// 	return (
// 		<div className="w-auto pb-2 px-2">
// 			<AudioAttachment />
// 		</div>
// 	);
// };
