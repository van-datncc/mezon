import React, { useEffect, useRef, useState } from 'react';
import { handleUploadFile, useMezon } from "@mezon/transport";
import { useChatSending, useCurrentChat } from "@mezon/core";
import { ApiChannelDescription } from "mezon-js/api.gen";

type AudioRecorderProps = {
	onSendRecord: () => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({onSendRecord}) => {
	const [isRecording, setIsRecording] = useState(false);
	const [audioUrl, setAudioUrl] = useState('');
	const [seconds, setSeconds] = useState(0);
	const recorderRef = useRef<MediaRecorder | null>(null);
	const chunksRef = useRef<BlobPart[]>([]);
	const timerRef = useRef<NodeJS.Timeout | null>(null);
	const streamRef = useRef<MediaStream | null>(null);
	const { sessionRef, clientRef } = useMezon();
	const { currentChat } = useCurrentChat();
	const { sendMessage } = useChatSending({channelOrDirect: currentChat as ApiChannelDescription, mode: 2});
	
	
	const blobToFile = (blob: Blob): File => {
		// Generate a timestamp for unique filename
		const timestamp = new Date().getTime();
		return new File([blob], `audio-${timestamp}.ogg`, { type: 'audio/mp3' });
	};

	const startRecording = async () => {
		if (isRecording) return;

		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			streamRef.current = stream;

			const recorder = new MediaRecorder(stream);
			recorderRef.current = recorder;

			recorder.ondataavailable = (e) => {
				chunksRef.current.push(e.data);
			};

			recorder.onstop = () => {
				const blob = new Blob(chunksRef.current, { type: 'audio/ogg; codecs=opus' });
				chunksRef.current = [];
				const audioUrl = URL.createObjectURL(blob);
				setAudioUrl(audioUrl);
				
				sendRecording();
			};

			recorder.start();
			setIsRecording(true);
			setSeconds(0);
			timerRef.current = setInterval(() => setSeconds((prev) => prev + 1), 1000);
		} catch (err) {
			console.error('Không thể truy cập microphone:', err);
		}
	};

	const stopRecording = () => {
		if (!isRecording || !recorderRef.current) return;

		recorderRef.current.stop();
		setIsRecording(false);
		if (timerRef.current) clearInterval(timerRef.current);

		if (streamRef.current) {
			streamRef.current.getTracks().forEach((track) => track.stop());
		}
	};

	const resetRecording = () => {
		setAudioUrl('');
		setSeconds(0);
		setIsRecording(false);
		if (timerRef.current) clearInterval(timerRef.current);
		if (streamRef.current) {
			streamRef.current.getTracks().forEach((track) => track.stop());
		}
		streamRef.current = null;
		recorderRef.current = null;
	};

	const sendRecording = async() => {
		if (isRecording && recorderRef.current) {
			recorderRef.current.stop();
			recorderRef.current.onstop = async () => {
				const blob = new Blob (chunksRef.current, { type: 'audio/ogg; codecs=opus' });
				chunksRef.current = [];
				const client = clientRef.current;
				const session = sessionRef.current;
				if (!client || !session) return;
				
				const fileUploaded = await handleUploadFile (client, session, '', '', 'record', blobToFile (blob))
				const audioUrl = URL.createObjectURL (blob);
				
				setAudioUrl (fileUploaded.url || 'abc');
				
				const attachmentsArray = [fileUploaded];
				
				await sendMessage ({}, [], [...attachmentsArray])
				
				// alert (`Audio URL đã được gửi: ${audioUrl}`);
				
				resetRecording ();
				onSendRecord();
			};
		} else if (audioUrl) {
			// alert(`Audio URL đã được gửi: ${audioUrl}`);

			resetRecording();
		}
	};
	
	useEffect (() => {
		startRecording();
		return (() => {
			resetRecording ();
			onSendRecord();
		})
	}, []);

	return (
		<div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: '10px',
					// backgroundColor: '#ff5252',
					padding: '10px',
					borderRadius: '5px',
					color: 'white',
					width: '400px'
				}}
			>
				<button
					onClick={resetRecording}
					style={{
						backgroundColor: 'white',
						color: '#ff5252',
						border: 'none',
						borderRadius: '50%',
						width: '30px',
						height: '30px',
						cursor: 'pointer'
					}}
				>
					✖
				</button>

				<div
					style={{
						flex: 1,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						gap: '10px'
					}}
				>
					{isRecording ? (
						<span>{new Date(seconds * 1000).toISOString().substring(14, 19)}</span>
					) : (
						<audio src={audioUrl} controls style={{ flex: 1 }} className={'w-full'}/>
					)}
					<button
						onClick={stopRecording}
						style={{
							backgroundColor: 'white',
							color: '#ff5252',
							border: 'none',
							borderRadius: '50%',
							width: '30px',
							height: '30px',
							cursor: 'pointer'
						}}
					>
						⏹
					</button>
				</div>

				<button
					onClick={sendRecording}
					style={{
						backgroundColor: 'white',
						color: '#ff5252',
						border: 'none',
						borderRadius: '50%',
						width: '30px',
						height: '30px',
						cursor: 'pointer'
					}}
				>
					➤
				</button>
			</div>

			{/*{!isRecording && !audioUrl && (*/}
			{/*	<button*/}
			{/*		onClick={startRecording}*/}
			{/*		style={{*/}
			{/*			padding: '10px 20px',*/}
			{/*			backgroundColor: '#ff5252',*/}
			{/*			color: 'white',*/}
			{/*			border: 'none',*/}
			{/*			borderRadius: '5px',*/}
			{/*			cursor: 'pointer',*/}
			{/*			marginTop: '20px'*/}
			{/*		}}*/}
			{/*	>*/}
			{/*		Start Recording*/}
			{/*	</button>*/}
			{/*)}*/}
		</div>
	);
};

export default AudioRecorder;
