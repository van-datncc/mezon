import { MediaType, selectAudioByCurrentUser, selectCurrentClanId, selectCurrentUserId, soundEffectActions, useAppDispatch } from '@mezon/store';
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
};

const isAudioFile = (url: string): boolean => {
	const lowerUrl = url.toLowerCase();
	return lowerUrl.endsWith('.mp3') || lowerUrl.endsWith('.wav') || lowerUrl.endsWith('.mpeg');
};

const SettingSoundEffect = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedSound, setSelectedSound] = useState<SoundType | null>(null);
    const dispatch = useAppDispatch();
    const currentClanId = useSelector(selectCurrentClanId) || '';
    const currentUserId = useSelector(selectCurrentUserId) || '';
    const currentClan = useSelector(selectCurrentClan);
    const userProfile = useSelector(selectAllAccount);

	const sounds = useSelector(selectAudioByCurrentUser(currentClanId, currentUserId));

	const soundList: SoundType[] = sounds.map((sound) => ({
		id: sound.id || '',
		name: sound.shortname || '',
		url: sound.source || ''
	}));

	useEffect(() => {
		dispatch(soundEffectActions.fetchSoundByUserId({ noCache: false }));
	}, [dispatch, currentClanId]);

	const handleUploadSuccess = (newSound: SoundType) => {
		setShowModal(false);

		dispatch(soundEffectActions.fetchSoundByUserId({ noCache: true }));
	};

	const handleDeleteSound = async (soundId: string, soundName: string) => {
		try {
			await dispatch(
				soundEffectActions.deleteSound({
					soundId: soundId,
					clan_id: currentClanId,
					soundLabel: soundName
				})
			);

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
                <div className="flex items-center gap-2 font-bold text-xs uppercase">
                    <span>UPLOAD INSTRUCTIONS</span>
                </div>
                <p>
                    Only accepts .mp3, .wav files, maximum 1MB. Use memorable names for sound effects. Sound effects will be used in clan notifications or events.
                </p>
            </div>
            <div className="flex p-4 dark:bg-bgSecondary bg-bgLightSecondary rounded-lg shadow-sm hover:shadow-md transition duration-200 border dark:border-borderDivider border-gray-200">
                <div className="flex-1 w-full flex flex-col">
                    <div className="flex items-center gap-2 text-base font-bold dark:text-textPrimary text-textLightTheme">
                        <span>Upload it here!</span>
                    </div>
                    <p className="text-xs mt-1 dark:text-textSecondary text-textSecondary800">Personalize sound effects for your clan!</p>
                </div>
                <button className="bg-primary text-white rounded-lg py-2.5 px-4 font-semibold hover:bg-blue-600 transition duration-200 shadow-sm hover:shadow-md capitalize" onClick={() => { setSelectedSound(null); setShowModal(true); }}>
                    <span className="flex items-center gap-2">
                        Upload sound
                    </span>
                </button>
            </div>
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 font-semibold text-sm dark:text-textPrimary text-textLightTheme">
                    <Icons.Speaker className="w-5 h-5 text-primary" />
                    <span>Sound Effect List</span>
                </div>
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {soundList.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-10 border-2 border-dashed dark:border-borderDivider border-gray-300 rounded-lg bg-gray-50 dark:bg-bgPrimary text-center">
                            <Icons.Speaker className="w-10 h-10 text-gray-400 dark:text-gray-500 mb-2" />
                            <p className="text-gray-500 dark:text-gray-400 text-sm">No sound effects yet. Click "Upload sound" to add!</p>
                        </div>
                    )}
                    {soundList.map((sound) => (
                        <div key={sound.id} className="flex flex-col w-full p-4 border rounded-lg bg-white dark:bg-bgSecondary shadow-sm hover:shadow-md transition duration-200 dark:border-borderDivider border-gray-200">
                            <div className="flex items-center justify-between mb-3">
                                <p className="font-semibold truncate w-full text-center dark:text-textPrimary text-textLightTheme">{sound.name}</p>
                                {canManageSound(sound.creator_id || '') && (
                                    <div className="flex items-center gap-1">
                                        <button
                                            className="aspect-square w-6 rounded-full text-textPrimaryLight dark:text-textPrimary bg-bgLightModeSecond hover:bg-bgLightModeThird dark:bg-bgSecondary600 dark:hover:bg-bgSurface flex items-center justify-center shadow-sm"
                                            onClick={() => handleEditSound(sound)}
                                        >
                                            <Icons.EditMessageRightClick defaultSize="w-3 h-3" />
                                        </button>
                                        <button
                                            className="aspect-square w-6 text-sm rounded-full bg-bgLightModeSecond hover:bg-bgLightModeThird dark:bg-bgSecondary600 dark:hover:bg-bgSurface flex items-center justify-center mb-[1px] font-medium text-red-600 shadow-sm"
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

export default SettingSoundEffect;
