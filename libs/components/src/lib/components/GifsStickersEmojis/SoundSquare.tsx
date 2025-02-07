/* eslint-disable react-hooks/exhaustive-deps */
import { useChatSending, useEscapeKeyClose, useGifsStickersEmoji } from '@mezon/core';
import { selectCurrentClan, selectCurrentTopicId, useAppSelector } from '@mezon/store';
import { Icons } from '@mezon/ui';
import { IMessageSendPayload } from '@mezon/utils';
import { ApiChannelDescription, ApiMessageAttachment, ApiMessageMention, ApiMessageRef } from 'mezon-js/api.gen';
import { useCallback, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { MessageAudio } from '../MessageWithUser/MessageAudio/MessageAudio';

type ChannelMessageBoxProps = {
	channel: ApiChannelDescription | undefined;
	mode: number;
	onClose: () => void;
};

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

const sounds = [
	{
		clan_name: '🍻thaiphamquocdsdfsfsfsfs',
		logo: 'https://fastly.picsum.photos/id/391/536/354.jpg?hmac=29BA6wFw5oDS6512JTZGg8jXcA_-hnW9154Cqs9OZqw',
		clan_id: '1775731152322039808',
		id: '1',
		filename: 'giong_nghe_di_deo_chiu_dc.mp3',
		size: 64503,
		url: 'https://cdn.mezon.vn/1775732550744936448/1840651419422560256/1775730015049093000/1738915806076_0giong_nghe_di_deo_chiu_dc.mp3',
		filetype: 'audio/mpeg'
	},
	{
		clan_name: '🍻thaiphamquocdsdfsfsfsfs',
		logo: 'https://fastly.picsum.photos/id/391/536/354.jpg?hmac=29BA6wFw5oDS6512JTZGg8jXcA_-hnW9154Cqs9OZqw',
		clan_id: '1775731152322039808',
		id: '2',
		filename: 'yeah_boiii_i_i_i.mp3',
		size: 130430,
		url: 'https://cdn.mezon.vn/1775732550744936448/1840651419422560256/1775730015049093000/1738915806076_1yeah_boiii_i_i_i.mp3',
		filetype: 'audio/mpeg'
	},
	{
		clan_name: '🍻thaiphamquocdsdfsfsfsfs',
		logo: 'https://fastly.picsum.photos/id/391/536/354.jpg?hmac=29BA6wFw5oDS6512JTZGg8jXcA_-hnW9154Cqs9OZqw',
		clan_id: '1775731152322039808',
		id: '3',
		filename: 'Danger_Alarm_Meme_Sound_Effect.mp3',
		size: 101189,
		url: 'https://cdn.mezon.vn/1775732550744936448/1840651419422560256/1775730015049093000/1738915806076_2Danger_Alarm_Meme_Sound_Effect.mp3',
		filetype: 'audio/mpeg'
	},
	{
		clan_name: '🍻thaiphamquocdsdfsfsfsfs',
		logo: 'https://fastly.picsum.photos/id/391/536/354.jpg?hmac=29BA6wFw5oDS6512JTZGg8jXcA_-hnW9154Cqs9OZqw',
		clan_id: '1775731152322039808',
		id: '4',
		filename: 'galaxy_meme.mp3',
		size: 303744,
		url: 'https://cdn.mezon.vn/1775732550744936448/1840651419422560256/1775730015049093000/1738915806076_3galaxy_meme.mp3',
		filetype: 'audio/mpeg'
	},
	{
		clan_name: '🍻thaiphamquocdsdfsfsfsfs',
		logo: 'https://fastly.picsum.photos/id/391/536/354.jpg?hmac=29BA6wFw5oDS6512JTZGg8jXcA_-hnW9154Cqs9OZqw',
		clan_id: '1775731152322039808',
		id: '5',
		filename: 'oh_hello_there.mp3',
		size: 49780,
		url: 'https://cdn.mezon.vn/1775732550744936448/1840651419422560256/1775730015049093000/1738915806076_4oh_hello_there.mp3',
		filetype: 'audio/mpeg'
	}
];

function SoundSquare({ channel, mode, onClose }: ChannelMessageBoxProps) {
	const { sendMessage } = useChatSending({ channelOrDirect: channel, mode });
	const currentTopicId = useSelector(selectCurrentTopicId);
	const { valueInputToCheckHandleSearch, subPanelActive, setSubPanelActive } = useGifsStickersEmoji();
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

	// get list clan logo to show on leftside
	const categoryLogo = sounds
		.map((sound) => ({
			id: sound.clan_id,
			type: sound.clan_name,
			url: sound.logo
		}))
		.filter((sound, index, self) => index === self.findIndex((s) => s.id === sound.id));

	const [selectedType, setSelectedType] = useState('');
	const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
	const containerRef = useRef<HTMLDivElement>(null);

	const modalRef = useRef<HTMLDivElement>(null);
	useEscapeKeyClose(modalRef, onClose);

	const onClickSendSound = () => {
		// console.log('sent clicked');
	};

	return (
		<div ref={modalRef} tabIndex={-1} className="outline-none flex h-full w-full md:w-[500px] max-sm:ml-1">
			<div className="overflow-y-auto overflow-x-hidden hide-scrollbar h-[25rem] rounded md:ml-2 ">
				<div className="w-11 flex flex-col gap-y-1 dark:bg-[#1E1F22] bg-bgLightModeSecond pt-1 px-1 md:items-start pb-1 rounded items-center min-h-[25rem]">
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
				</div>
			</div>
			<div className="flex flex-col h-[400px] overflow-y-auto flex-1 hide-scrollbar" ref={containerRef}>
				{valueInputToCheckHandleSearch ? (
					<SoundPanel soundList={sounds} onClickSendSound={onClickSendSound} />
				) : (
					<>
						{categoryLogo.map((avt) => (
							<div ref={(el) => (categoryRefs.current[avt.type || ''] = el)} key={avt.id}>
								<CategorizedSounds
									valueInputToCheckHandleSearch={valueInputToCheckHandleSearch}
									soundList={sounds}
									onClickSendSound={onClickSendSound}
									categoryName={avt.type || ''}
									key={avt.id}
								/>
							</div>
						))}
					</>
				)}
			</div>
		</div>
	);
}
export default SoundSquare;

interface ExtendedApiMessageAttachment extends ApiMessageAttachment, ClanSound {}

interface ICategorizedSoundProps {
	soundList: ExtendedApiMessageAttachment[];
	categoryName: string;
	onClickSendSound: () => void;
	valueInputToCheckHandleSearch?: string;
}

const CategorizedSounds: React.FC<ICategorizedSoundProps> = ({ soundList, categoryName, onClickSendSound, valueInputToCheckHandleSearch }) => {
	const soundListByCategoryName = soundList.filter((sound) => sound.clan_name === categoryName);
	const [isShowSoundList, setIsShowSoundList] = useState(true);
	const currentClan = useAppSelector(selectCurrentClan);

	const handleToggleButton = () => {
		setIsShowSoundList(!isShowSoundList);
	};

	return (
		<div>
			<button
				onClick={handleToggleButton}
				className="w-full flex flex-row justify-start items-center pl-1 mb-1 mt-0 py-1 gap-[2px] sticky top-[-0.5rem] dark:bg-[#2B2D31] bg-bgLightModeSecond z-10 dark:text-white text-black max-h-full"
			>
				<p className="uppercase">{categoryName !== 'custom' ? categoryName : currentClan?.clan_name}</p>
				<span className={`${isShowSoundList ? ' rotate-90' : ''}`}>
					<Icons.ArrowRight />
				</span>
			</button>
			{isShowSoundList && <SoundPanel soundList={soundListByCategoryName} onClickSendSound={onClickSendSound} />}
		</div>
	);
};

interface ISoundPanelProps {
	soundList: ExtendedApiMessageAttachment[];
	onClickSendSound?: () => void;
}

const SoundPanel: React.FC<ISoundPanelProps> = ({ soundList, onClickSendSound }) => {
	return (
		<div className="w-auto pb-2 px-2">
			<div className="grid grid-cols-2 gap-4">
				{soundList.map((sound, index) => (
					<div key={sound.id} className="relative flex flex-col justify-between items-end border border-red-400 rounded-lg w-full h-[7rem]">
						<MessageAudio audioUrl={sound.url || ''} posInPopUp={true} />
					</div>
				))}
			</div>
		</div>
	);
};
