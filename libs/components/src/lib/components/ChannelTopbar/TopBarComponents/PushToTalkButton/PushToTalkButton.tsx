import { Icons } from '@mezon/ui';
import { Tooltip } from 'flowbite-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useWebRTC } from '../../../WebRTC/WebRTCContext';
import { MicIcon } from './MicIcon';

export interface IPushToTalkBtnProps {
	isLightMode: boolean;
}

export function PushToTalkBtn({ isLightMode }: IPushToTalkBtnProps) {
	const { localStream, remoteStream, startLocalStream, stopSession, toggleMicrophone } = useWebRTC();
	const [isJoined, setIsJoined] = useState<boolean>(false);
	const [isTalking, setIsTalking] = useState<boolean>(false);
	const location = useLocation();
	const locationPathNameRef = useRef<string>(location.pathname);

	const localAudioRef = useRef<HTMLAudioElement | null>(null);
	const remoteAudioRef = useRef<HTMLAudioElement | null>(null);

	const startJoinPTT = async () => {
		try {
			setIsJoined(true);
			startLocalStream();
		} catch (err) {
			console.error('Failed to get local media:', err);
		}
	};

	const quitPTT = useCallback(async () => {
		setIsTalking(false);
		setIsJoined(false);
		toggleMicrophone(false);
		stopSession();
	}, [stopSession, toggleMicrophone]);

	useEffect(() => {
		if (localStream && localAudioRef.current) {
			localAudioRef.current.srcObject = localStream;
		}
	}, [localStream]);

	useEffect(() => {
		if (remoteStream && remoteAudioRef.current) {
			remoteAudioRef.current.srcObject = remoteStream;
		}
	}, [remoteStream]);

	useEffect(() => {
		toggleMicrophone(isTalking);
	}, [isTalking, toggleMicrophone]);

	useEffect(() => {
		if (location.pathname === locationPathNameRef.current) {
			return;
		}
		locationPathNameRef.current = location.pathname;
		if (isJoined) {
			quitPTT();
		}
	}, [isJoined, location, quitPTT]);

	return (
		<div className="relative flex gap-[15px] leading-5 h-5">
			{isJoined && <MicIcon isTalking={isTalking} onClick={() => setIsTalking((value) => !value)} />}

			<Tooltip
				className={`w-[140px] flex justify-center items-center`}
				content={isJoined ? 'Push to end' : 'Push to talk'}
				trigger="hover"
				animation="duration-500"
				style={isLightMode ? 'light' : 'dark'}
			>
				<button onClick={!isJoined ? startJoinPTT : quitPTT} className="focus-visible:outline-none" onContextMenu={(e) => e.preventDefault()}>
					{isJoined ? (
						<>
							<div className="size-6 flex items-center justify-center">
								<Icons.JoinedPTT className="size-4 dark:hover:text-white hover:text-black dark:text-[#B5BAC1] text-colorTextLightMode" />
							</div>
							<div className="invisible fixed w-[1px] h-[1px] z-0 pointer-events-none">
								<audio ref={localAudioRef} autoPlay muted />
								<audio ref={remoteAudioRef} autoPlay />
							</div>
						</>
					) : (
						<Icons.NotJoinedPTT className="size-6 dark:hover:text-white hover:text-black dark:text-[#B5BAC1] text-colorTextLightMode" />
					)}
				</button>
			</Tooltip>
		</div>
	);
}
