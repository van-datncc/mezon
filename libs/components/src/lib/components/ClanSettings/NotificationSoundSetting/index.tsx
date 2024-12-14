import { useState } from 'react';
import SoundItem from './SoundItem';

type SoundType = {
	id: number;
	fileName: string;
	src: string;
	isSelected: boolean;
};

const initialSoundList: SoundType[] = [
	{
		id: 1,
		fileName: 'alert-1',
		src: 'https://www2.cs.uic.edu/~i101/SoundFiles/taunt.wav',
		isSelected: true
	},
	{
		id: 2,
		fileName: 'alert-2',
		src: 'https://www2.cs.uic.edu/~i101/SoundFiles/StarWars3.wav',
		isSelected: false
	},
	{
		id: 3,
		fileName: 'alert-3',
		src: 'https://www2.cs.uic.edu/~i101/SoundFiles/CantinaBand3.wav',
		isSelected: false
	},
	{
		id: 4,
		fileName: 'alert-4',
		src: 'https://www2.cs.uic.edu/~i101/SoundFiles/preamble10.wav',
		isSelected: false
	},
	{
		id: 5,
		fileName: 'alert-5',
		src: 'https://www2.cs.uic.edu/~i101/SoundFiles/gettysburg10.wav',
		isSelected: false
	},
	{
		id: 6,
		fileName: 'alert-6',
		src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
		isSelected: false
	},
	{
		id: 7,
		fileName: 'alert-7',
		src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
		isSelected: false
	},
	{
		id: 8,
		fileName: 'alert-8',
		src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
		isSelected: false
	},
	{
		id: 9,
		fileName: 'alert-9',
		src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
		isSelected: false
	},
	{
		id: 10,
		fileName: 'alert-10',
		src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
		isSelected: false
	}
];

const NotificationSoundSetting = () => {
	const [soundList, setSoundList] = useState<SoundType[]>(initialSoundList);
	const [currentSound, setCurrentSound] = useState<SoundType | null>(initialSoundList.find((sound) => sound.isSelected) || null);
	const [playingSound, setPlayingSound] = useState<SoundType | null>(null);

	const handleSelectSound = (selectedSound: SoundType) => {
		const updatedSoundList = soundList.map((sound) => ({
			...sound,
			isSelected: sound.id === selectedSound.id
		}));
		setSoundList(updatedSoundList);
		setCurrentSound(selectedSound);
	};

	const handlePlaySound = (sound: SoundType) => {
		setPlayingSound(sound);
	};

	return (
		<>
			<div className={'flex w-full p-2 dark:text-textDarkTheme text-textLightTheme font-bold'}>
				<p className={'w-1/2'}>Name</p>
				<p className={'w-1/3'}>Duration</p>
				<p className={'ml-auto'}>Play</p>
			</div>
			<div>
				{soundList.map((sound) => (
					<SoundItem
						key={sound.id}
						sound={sound}
						isSelected={sound.id === currentSound?.id}
						onPlay={() => handlePlaySound(sound)}
						onSelect={() => handleSelectSound(sound)}
						isPlaying={playingSound?.id === sound.id}
					/>
				))}
			</div>
			<div className={'w-full h-[1px] red'}></div>
		</>
	);
};

export default NotificationSoundSetting;
