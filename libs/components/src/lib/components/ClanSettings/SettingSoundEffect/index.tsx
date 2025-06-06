import { Icons } from '@mezon/ui';
import { useState } from 'react';
import ModalUploadSound from './ModalUploadSound';

export type SoundType = {
    id: string;
    name: string;
    url: string;
};

const SettingSoundEffect = () => {
    const [showModal, setShowModal] = useState(false);
    const [soundList, setSoundList] = useState<SoundType[]>([]);

    const handleUploadSuccess = (newSound: SoundType) => {
        setSoundList((prev) => [...prev, newSound]);
        setShowModal(false);
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
                <button className="bg-primary text-white rounded-lg py-2.5 px-4 font-semibold hover:bg-blue-600 transition duration-200 shadow-sm hover:shadow-md capitalize" onClick={() => setShowModal(true)}>
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
                                <button className="text-red-500 hover:text-red-600 transition duration-200 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/10">
                                    <Icons.CircleClose className="w-4 h-4" />
                                </button>
                            </div>
                            <audio controls src={sound.url} className="w-full rounded-full border dark:border-borderDivider border-gray-200" />
                        </div>
                    ))}
                </div>
            </div>
            {showModal && <ModalUploadSound onSuccess={handleUploadSuccess} onClose={() => setShowModal(false)} />}
        </div>
    );
};

export default SettingSoundEffect;