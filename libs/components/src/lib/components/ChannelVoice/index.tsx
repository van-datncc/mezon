import { selectShowScreen } from '@mezon/store';
import { useMezonVoice } from '@mezon/transport';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export type ChannelVoiceProps = {
	clanId: string;
	clanName: string;
	channelId: string;
	channelLabel: string;
	userName: string;
	jwt: string;
};

function ChannelVoice({ clanId, clanName, channelId, channelLabel, userName, jwt }: ChannelVoiceProps) {
	const voice = useMezonVoice();
	const showScreen = useSelector(selectShowScreen);
	const [isSelectScreen, setIsSelectScreen] = useState(false);

	const voiceChannelName = clanName?.replace(' ', '-') + '-' + channelLabel.replace(' ', '-');

	useEffect(() => {
		voice.setVoiceChannelName(voiceChannelName.toLowerCase());
		voice.setVoiceChannelId(channelId);
		voice.setUserDisplayName(userName);
		voice.setClanId(clanId);
		voice.setClanName(clanName);
		const targetNode = document.getElementById('meet');
		voice.setTargetTrackNode(targetNode as HTMLElement);

		const canvasTrack = document.getElementById('canvas');
		if (canvasTrack !== undefined) {
			voice.setScreenCanvasElement(canvasTrack as HTMLCanvasElement);
			voice.setScreenCanvasCtx((canvasTrack as HTMLCanvasElement).getContext('2d') as CanvasRenderingContext2D);
		}

		const videoShareElem = document.getElementById('screenvideo');
		videoShareElem!.style.display = 'none';
		voice.setScreenVideoElement(videoShareElem as HTMLVideoElement);
		voice.createVoiceConnection(voiceChannelName.toLowerCase(), jwt);
	}, [voice]);

	const handleClick = (event: any) => {
		setIsSelectScreen(true);
		const oldElementSelect = document.querySelector('.showScreen');
		if (oldElementSelect) {
			oldElementSelect.classList.remove('showScreen');
		}

		const selectedElement = event.target;
		selectedElement.classList.add('showScreen');
	};

	const handleCloseScreen = () => {
		setIsSelectScreen(false);
		const elementSelect = document.querySelector('.showScreen');
		if (elementSelect) {
			elementSelect.classList.remove('showScreen');
		}
	};

	return (
		<div className="relative flex items-center h-full">
			<button
				className={`absolute top-0 right-5 bg-[#AEAEAE] w-[30px] h-[30px] rounded-[50px] font-bold transform hover:scale-105 hover:bg-slate-400 transition duration-300 ease-in-out ${isSelectScreen ? 'block' : 'hidden'}`}
				onClick={handleCloseScreen}
			>
				x
			</button>
			<div
				id="meet"
				className={`fixed grid items-stretch gap-[10px] p-[10px] ${isSelectScreen ? 'grid-cols-5' : 'grid-cols-3'}`}
				onClick={handleClick}
			>
				<div className={`contents ${showScreen ? 'block' : 'hidden'}`}>
					<canvas id="canvas" className="w-full bg-black rounded-[10px] h-full"></canvas>
				</div>
				<div className={`localTrack contents`}></div>
				<div className={`remoteTrack contents`}></div>
				<video id="screenvideo" autoPlay width={460} height={640} />
			</div>
		</div>
	);
}

export default ChannelVoice;
