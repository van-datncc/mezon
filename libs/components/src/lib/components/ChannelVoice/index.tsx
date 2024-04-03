import { selectShowScreen } from '@mezon/store';
import { useMezonVoice } from '@mezon/transport';
import { useEffect } from 'react';
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

	return (
		<div className="px-4 mb-4 h-full flex items-center justify-center ">
			<div id="meet">
				<canvas id="canvas" className={`w-full max-h-[60%] ${showScreen ? 'block mb-2' : 'hidden'}`}></canvas>
				<div className="flex gap-x-3 overflow-x-auto hide-scrollbar">
					<div className={`localTrack w-fit h-fit flex gap-x-3 ${showScreen ? 'hasVideo' : ''}`}></div>
					<div className={`remoteTrack w-fit h-fit flex gap-x-3 ${showScreen ? 'hasVideo' : ''}`}></div>
				</div>
				<video id="screenvideo" autoPlay width={460} height={640} />
			</div>
		</div>
	);
}

export default ChannelVoice;
