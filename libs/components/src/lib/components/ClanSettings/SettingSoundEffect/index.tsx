import {
	MediaType,
	selectAllAccount,
	selectAudioByClanId,
	selectCurrentClan,
	selectCurrentClanId,
	selectCurrentUserId,
	selectMemberClanByUserId,
	soundEffectActions,
	useAppDispatch,
	useAppSelector
} from '@mezon/store';
import { Icons } from '@mezon/ui';
import { ClanSticker } from 'mezon-js';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ModalUploadSound from './ModalUploadSound';
interface ExtendedClanSticker extends ClanSticker {
	media_type?: MediaType;
}

export type SoundType = {
	id: string;
	name: string;
	url: string;
	creator_id?: string;
};


const isAudioFile = (url: string): boolean => {
	const lowerUrl = url.toLowerCase();
	return lowerUrl.endsWith('.mp3') || lowerUrl.endsWith('.wav') || lowerUrl.endsWith('.mpeg');
}

const SettingSoundEffect = () => {
	const [showModal, setShowModal] = useState(false);
	const [selectedSound, setSelectedSound] = useState<SoundType | null>(null);
	const dispatch = useAppDispatch();
	const currentClanId = useAppSelector(selectCurrentClanId) || '';
	const currentUserId = useAppSelector(selectCurrentUserId) || '';
	const currentClan = useAppSelector(selectCurrentClan);
	const userProfile = useAppSelector(selectAllAccount);

	const sounds = useAppSelector((state: any) => selectAudioByClanId(state, currentClanId));

	const isClanOwner = currentClan?.creator_id === userProfile?.user?.id;


	const soundList: SoundType[] = sounds.map(sound => ({
		id: sound.id || '',
		name: sound.shortname || '',
		url: sound.source || '',
		creator_id: sound.creator_id || '',
	}));

	useEffect(() => {
		dispatch(soundEffectActions.fetchSoundByUserId({ noCache: false }));
	}, [dispatch, currentClanId]);

	const handleUploadSuccess = (newSound: SoundType) => {
		setShowModal(false);
		setSelectedSound(null);
		dispatch(soundEffectActions.fetchSoundByUserId({ noCache: true }));
	};

	const handleEditSound = (sound: SoundType) => {
		setSelectedSound(sound);
		setShowModal(true);
	};

	const handleDeleteSound = async (soundId: string, soundName: string) => {
		try {
			await dispatch(soundEffectActions.deleteSound({
				soundId: soundId,
				clan_id: currentClanId,
				soundLabel: soundName
			}));

			dispatch(soundEffectActions.fetchSoundByUserId({ noCache: true }));
		} catch (error) {
			console.error("Error deleting sound:", error);
		}
	};

	const canManageSound = (creatorId: string) => {
		return isClanOwner || creatorId === currentUserId;
	};

	return (
		<div className="flex flex-col gap-6 pb-[40px] dark:text-textSecondary text-textSecondary800 text-sm">
			<div className="flex flex-col gap-2 pb-6 border-b-[0.08px] dark:border-borderDividerLight border-bgModifierHoverLight">
				<div className="flex items-center text-theme-primary-active gap-2 font-bold text-xs uppercase">
					<span>UPLOAD INSTRUCTIONS</span>
				</div>
				<p className="text-theme-primary">
					Only accepts .mp3, .wav files, maximum 1MB. Use memorable names for sound effects. Sound effects will be used in clan notifications or events.
				</p>
			</div>
			<div className="flex p-4 bg-theme-setting-nav rounded-lg shadow-sm hover:shadow-md transition duration-200  border-theme-primary">
				<div className="flex-1 w-full flex flex-col">
					<div className="flex items-center gap-2 text-base font-bold text-theme-primary-active">
						<span>Upload it here!</span>
					</div>
					<p className="text-xs mt-1 text-theme-primary">Personalize sound effects for your clan!</p>
				</div>
				<button className=" rounded-lg py-2.5 px-4 btn-primary btn-primary-hover font-semibold  transition duration-200 shadow-sm hover:shadow-md capitalize" onClick={() => { setSelectedSound(null); setShowModal(true); }}>
					<span className="flex items-center gap-2">
						Upload sound
					</span>
				</button>
			</div>
			<div className="flex flex-col gap-4">
				<div className="flex items-center gap-2 font-semibold text-sm text-theme-primary-active">
					<Icons.Speaker className="w-5 h-5 text-theme-primary" />
					<span>Sound Effect List</span>
				</div>
				<div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{soundList.length === 0 && (
						<div className="col-span-full flex flex-col items-center justify-center py-10 border-2 border-dashed border-theme-primary bg-theme-setting-nav text-center">
							<Icons.Speaker className="w-10 h-10 text-theme-primary mb-2" />
							<p className="text-theme-primary text-sm">No sound effects yet. Click "Upload sound" to add!</p>
						</div>
					)}
					{soundList.map((sound) => (
						<div key={sound.id} className="flex flex-col w-full p-4 border rounded-lg bg-theme-setting-nav shadow-sm hover:shadow-md transition duration-200 border-theme-primary">
							<div className="flex items-center justify-between mb-3">
								<p className="font-semibold truncate w-full text-center text-theme-primary-active">{sound.name}</p>
								{canManageSound(sound.creator_id || '') && (
									<div className="flex items-center gap-1">
										<button
											className="aspect-square w-6 rounded-full text-theme-primary-active bg-theme-setting-primary flex items-center justify-center shadow-sm"
											onClick={() => handleEditSound(sound)}
										>
											<Icons.EditMessageRightClick defaultSize="w-3 h-3" />
										</button>
										<button
											className="aspect-square w-6 text-sm rounded-full bg-theme-setting-primary hover:bg-theme-setting-primary flex items-center justify-center mb-[1px] font-medium text-red-600 shadow-sm"
											onClick={() => handleDeleteSound(sound.id, sound.name)}
										>
											x
										</button>
									</div>
								)}
							</div>
							<audio controls src={sound.url} className="w-full rounded-full border dark:border-borderDivider border-gray-200 mb-2" />
							{sound.creator_id && (
								<CreatorInfo creatorId={sound.creator_id} />
							)}
						</div>
					))}
				</div>
			</div>
			{showModal && <ModalUploadSound sound={selectedSound} onSuccess={handleUploadSuccess} onClose={() => { setShowModal(false); setSelectedSound(null); }} />}
		</div>
	);
};

const CreatorInfo = ({ creatorId }: { creatorId: string }) => {
	const creator = useSelector(selectMemberClanByUserId(creatorId));

	if (!creator) return null;

	return (
		<div className="flex items-center justify-center gap-1 mt-1">
			<img
				className="w-4 h-4 rounded-full select-none object-cover"
				src={creator?.user?.avatar_url ?? process.env.NX_LOGO_MEZON}
				alt=""
			/>
			<p className="text-xs text-theme-primary max-w-20 truncate">{creator?.user?.username}</p>
		</div>
	);
};

export default SettingSoundEffect;