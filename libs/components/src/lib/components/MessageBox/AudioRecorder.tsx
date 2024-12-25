import { useChatSending, useCurrentChat } from '@mezon/core';
import { handleUploadFile, useMezon } from '@mezon/transport';
import { ChannelStreamMode, ChannelType } from 'mezon-js';
import { ApiChannelDescription, ApiMessageAttachment } from 'mezon-js/api.gen';
import React, { useEffect, useRef, useState } from 'react';
import { MessageAudio } from '../MessageWithUser/MessageAudio';

type AudioRecorderProps = {
	onSendRecord: () => void;
};

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onSendRecord }) => {
	const [isRecording, setIsRecording] = useState(true);
	const [audioUrl, setAudioUrl] = useState('');
	const [seconds, setSeconds] = useState(0);
	const [audioList, setAudioList] = useState<ApiMessageAttachment[]>([]);
	const [isStopping, setIsStopping] = useState(false);
	const recorderRef = useRef<MediaRecorder | null>(null);
	const chunksRef = useRef<BlobPart[]>([]);
	const timerRef = useRef<NodeJS.Timeout | null>(null);
	const streamRef = useRef<MediaStream | null>(null);
	const { sessionRef, clientRef } = useMezon();
	const { currentChat } = useCurrentChat();

	const getChannelMode = () => {
		switch (currentChat?.type) {
			case ChannelType.CHANNEL_TYPE_TEXT:
				return ChannelStreamMode.STREAM_MODE_CHANNEL;
			case ChannelType.CHANNEL_TYPE_THREAD:
				return ChannelStreamMode.STREAM_MODE_THREAD;
			case ChannelType.CHANNEL_TYPE_DM:
				return ChannelStreamMode.STREAM_MODE_DM;
			case ChannelType.CHANNEL_TYPE_GROUP:
				return ChannelStreamMode.STREAM_MODE_GROUP;
			default:
				return ChannelStreamMode.STREAM_MODE_CHANNEL;
		}
	};

	const { sendMessage } = useChatSending({ channelOrDirect: currentChat as ApiChannelDescription, mode: getChannelMode() });

	const blobToFile = (blob: Blob): File => {
		const timestamp = new Date().getTime();
		return new File([blob], `audio-${timestamp}.ogg`, { type: 'audio/mp3' });
	};

	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			streamRef.current = stream;

			const recorder = new MediaRecorder(stream);
			recorderRef.current = recorder;

			recorder.ondataavailable = (e) => {
				chunksRef.current.push(e.data);
			};

			recorder.onstop = () => {
				const blob = new Blob(chunksRef.current, { type: 'audio/mp3; codecs=opus' });
				const audioUrl = URL.createObjectURL(blob);
				setAudioUrl(audioUrl);
				setIsStopping(true);
				generateAudioList();
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
		setIsStopping(false);
		setIsRecording(false);
		if (timerRef.current) clearInterval(timerRef.current);
		if (streamRef.current) {
			streamRef.current.getTracks().forEach((track) => track.stop());
		}
		streamRef.current = null;
		recorderRef.current = null;

		onSendRecord();
	};

	const generateAudioList = async () => {
		const blob = new Blob(chunksRef.current, { type: 'audio/mp3; codecs=opus' });

		const client = clientRef.current;
		const session = sessionRef.current;
		if (!client || !session) return;
		
		const timestamp = new Date().getTime();
		const fileUploaded = await handleUploadFile(client, session, '', `${currentChat?.id}`, `${currentChat?.id}` + timestamp + 'voice_record', blobToFile(blob));

		const attachmentsArray = [fileUploaded];
		setAudioList(attachmentsArray);

		return attachmentsArray;
	};

	const sendRecording = async () => {
		if (isStopping) {
			await sendMessage({}, [], [...audioList]);
			resetRecording();
			onSendRecord();

			return;
		}

		if (recorderRef.current) {
			recorderRef.current.stop();
			recorderRef.current.onstop = async () => {
				const attachmentsArray = await generateAudioList();
				if (!attachmentsArray) return;

				await sendMessage({}, [], [...attachmentsArray]);

				resetRecording();
				onSendRecord();
			};
		} else if (audioUrl) {
			resetRecording();
		}
	};

	useEffect(() => {
		startRecording();
		return () => {
			resetRecording();
			onSendRecord();
		};
	}, []);

	return (
		<div style={{ paddingBottom: '10px', fontFamily: 'Arial, sans-serif' }}>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: '10px',
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
						color: '#505cdc',
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
					) : audioUrl ? (
						<MessageAudio audioUrl={audioUrl} />
					) : null}

					{isRecording && (
						<button
							onClick={stopRecording}
							style={{
								backgroundColor: 'white',
								color: '#505cdc',
								border: 'none',
								borderRadius: '50%',
								width: '30px',
								height: '30px',
								cursor: 'pointer'
							}}
						>
							⏹
						</button>
					)}
				</div>

				<button
					onClick={sendRecording}
					style={{
						backgroundColor: 'white',
						color: '#505cdc',
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
		</div>
	);
};

export default AudioRecorder;
