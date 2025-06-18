/* eslint-disable react-hooks/exhaustive-deps */
import { useChatSending, useCurrentInbox, useEscapeKeyClose, useGifsStickersEmoji } from '@mezon/core';
import {
	MediaType,
	referencesActions,
	selectAllStickerSuggestion,
	selectCurrentClan,
	selectCurrentClanId,
	selectDataReferences,
	soundEffectActions,
	useAppDispatch,
	useAppSelector
} from '@mezon/store';
import { Icons } from '@mezon/ui';
import { IMessageSendPayload, SubPanelName, blankReferenceObj } from '@mezon/utils';
import { ApiChannelDescription, ApiMessageAttachment, ApiMessageMention, ApiMessageRef } from 'mezon-js/api.gen';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MessageAudio } from '../MessageWithUser/MessageAudio/MessageAudio';

type ChannelMessageBoxProps = {
	channel: ApiChannelDescription | undefined;
	mode: number;
	onClose: () => void;
	isTopic?: boolean;
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

const searchSounds = (sounds: ExtendedApiMessageAttachment[], searchTerm: string) => {
	if (!searchTerm) return sounds;
	const lowerCaseSearchTerm = searchTerm.trim().toLowerCase();
	return sounds.filter((item) => item?.filename?.toLowerCase().includes(lowerCaseSearchTerm));
};

function SoundSquare({ channel, mode, onClose, isTopic = false }: ChannelMessageBoxProps) {
	const dispatch = useAppDispatch();
	const { sendMessage } = useChatSending({
		channelOrDirect: channel,
		mode,
		fromTopic: isTopic
	});
	const currentId = useCurrentInbox()?.channel_id;
	const dataReferences = useAppSelector((state) => selectDataReferences(state, currentId ?? ''));
	const isReplyAction = dataReferences.message_ref_id && dataReferences.message_ref_id !== '';
	const { valueInputToCheckHandleSearch, subPanelActive, setSubPanelActive } = useGifsStickersEmoji();

	const currentClanId = useAppSelector(selectCurrentClanId) || '';

	const allStickersInStore = useAppSelector(selectAllStickerSuggestion);
	const allSoundsInStore = allStickersInStore.filter((sticker) => (sticker as any).media_type === MediaType.AUDIO);

	useEffect(() => {
		dispatch(soundEffectActions.fetchSoundByUserId({ noCache: false }));
	}, [dispatch]);

	const userSounds = useMemo(() => {
		return allSoundsInStore.map((sound) => ({
			clan_name: sound.clan_name || 'MY SOUNDS',
			logo: sound.logo || '',
			clan_id: sound.clan_id || '',
			id: sound.id || '',
			filename: sound.shortname || 'sound.mp3',
			size: 100000,
			url: sound.source || '',
			filetype: 'audio/mpeg'
		}));
	}, [allSoundsInStore]);

	const allSounds = useMemo(() => {
		return [...userSounds];
	}, [userSounds]);

	const [searchedSounds, setSearchSounds] = useState<ExtendedApiMessageAttachment[]>([]);

	useEffect(() => {
		const result = searchSounds(allSounds, valueInputToCheckHandleSearch ?? '');
		setSearchSounds(result);
	}, [valueInputToCheckHandleSearch, subPanelActive, allSounds]);

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
	const categoryLogo = useMemo(() => {
		return allSounds
			.map((sound) => ({
				id: sound.clan_id,
				type: sound.clan_name,
				url: sound.logo
			}))
			.filter((sound, index, self) => index === self.findIndex((s) => s.id === sound.id));
	}, [allSounds]);

	const [selectedType, setSelectedType] = useState('');
	const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
	const containerRef = useRef<HTMLDivElement>(null);

	const modalRef = useRef<HTMLDivElement>(null);
	useEscapeKeyClose(modalRef, onClose);

	const onClickSendSound = useCallback(
		(sound: ExtendedApiMessageAttachment) => {
			if (isReplyAction) {
				handleSend({ t: '' }, [], [sound], [dataReferences]);
				dispatch(
					referencesActions.setDataReferences({
						channelId: currentId as string,
						dataReferences: blankReferenceObj as ApiMessageRef
					})
				);
			} else {
				handleSend({ t: '' }, [], [sound], []);
			}
			setSubPanelActive(SubPanelName.NONE);
		},
		[isReplyAction, handleSend, dispatch, currentId, dataReferences, blankReferenceObj, setSubPanelActive]
	);

	const scrollToClanSidebar = useCallback(
		(event: React.MouseEvent, clanName: string) => {
			event.stopPropagation();

			if (clanName === selectedType) return;
			setSelectedType(clanName);
			const categoryDiv = categoryRefs.current[clanName];
			const container = containerRef.current;
			if (!categoryDiv || !container) return;
			const containerTop = container.getBoundingClientRect().top;
			const categoryTop = categoryDiv.getBoundingClientRect().top;
			const offset = 0;
			const scrollTop = categoryTop - containerTop - offset;

			container.scrollTop += scrollTop;
		},
		[selectedType]
	);

	return (
		<div ref={modalRef} tabIndex={-1} className="outline-none flex h-full w-full md:w-[500px] max-sm:ml-1">
			<div className="overflow-y-auto overflow-x-hidden hide-scrollbar h-[25rem] rounded md:ml-2 ">
				<div className="w-11 flex flex-col gap-y-1 dark:bg-[#1E1F22] bg-bgLightModeSecond pt-1 px-1 md:items-start pb-1 rounded items-center min-h-[25rem]">
					{categoryLogo.map((cat) => (
						<button
							title={cat.type}
							key={cat.id}
							onClick={(e) => scrollToClanSidebar(e, cat.type)}
							className="flex justify-center items-center w-9 h-9 rounded-lg hover:bg-[#41434A]"
						>
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
					<SoundPanel soundList={searchedSounds} onClickSendSound={onClickSendSound} />
				) : (
					<>
						{categoryLogo.map((avt) => (
							<div ref={(el) => (categoryRefs.current[avt.type || ''] = el)} key={avt.id}>
								<CategorizedSounds
									valueInputToCheckHandleSearch={valueInputToCheckHandleSearch}
									soundList={allSounds}
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
	onClickSendSound: (sound: ExtendedApiMessageAttachment) => void;
	valueInputToCheckHandleSearch?: string;
}

const CategorizedSounds: React.FC<ICategorizedSoundProps> = React.memo(
	({ soundList, categoryName, onClickSendSound, valueInputToCheckHandleSearch }) => {
		const soundListByCategoryName = useMemo(() => soundList.filter((sound) => sound.clan_name === categoryName), [soundList, categoryName]);
		const [isShowSoundList, setIsShowSoundList] = useState(true);
		const currentClan = useAppSelector(selectCurrentClan);

		const handleToggleButton = useCallback(() => {
			setIsShowSoundList((prev) => !prev);
		}, []);

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
	}
);
interface ISoundPanelProps {
	soundList: ExtendedApiMessageAttachment[];
	onClickSendSound: (sound: ExtendedApiMessageAttachment) => void;
}

export const SoundPanel: React.FC<ISoundPanelProps> = React.memo(({ soundList, onClickSendSound }) => {
	return (
		<div className="w-auto pb-2 px-2">
			<div className="grid grid-cols-2 gap-4">
				{soundList.map((sound, index) => (
					<div key={sound.id} className="relative flex flex-col items-start rounded-md w-full">
						<MessageAudio audioUrl={sound.url || ''} posInPopUp={true} />
						<div className="border border-gray-600 flex flex-col items-start w-48 rounded-b-md">
							<div className="flex justify-center w-full mt-1" onClick={() => onClickSendSound(sound)} title="Send the sound">
								<Icons.SoundIcon className="w-4 h-4 text-[#2B2D31] dark:text-bgLightModeSecond dark:bg-bgLightModeSecond rounded-md" />
							</div>

							<span title={sound.filename} className="text-xs mx-1 w-full truncate cursor-text dark:text-white">
								{sound.filename}
							</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
});
