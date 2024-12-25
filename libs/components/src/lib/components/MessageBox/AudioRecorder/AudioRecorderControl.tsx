import { useChatSending, useCurrentInbox } from '@mezon/core';
import { handleUploadFile, useMezon } from '@mezon/transport';
import { blobToFile, getChannelMode } from '@mezon/utils';
import { ApiChannelDescription, ApiMessageAttachment } from 'mezon-js/api.gen';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AudioRecorderUI } from './AudioRecorderUI';

type AudioRecorderProps = {
	onSendRecord: () => void;
};

const AudioRecorderControl: React.FC<AudioRecorderProps> = React.memo(({ onSendRecord }) => {
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
	const currentInbox = useCurrentInbox();
	const { sendMessage } = useChatSending({
		channelOrDirect: currentInbox as ApiChannelDescription,
		mode: getChannelMode(currentInbox?.type as number)
	});

	const startRecording = useCallback(async () => {
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
	}, []);

	const stopRecording = useCallback(() => {
		if (!isRecording || !recorderRef.current) return;

		recorderRef.current.stop();
		setIsRecording(false);
		if (timerRef.current) clearInterval(timerRef.current);

		if (streamRef.current) {
			streamRef.current.getTracks().forEach((track) => track.stop());
		}
	}, [isRecording]);

	const resetRecording = useCallback(() => {
		// Revoke blob URL
		if (audioUrl) {
			URL.revokeObjectURL(audioUrl);
		}

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
		// Clear chunks
		chunksRef.current = [];
		onSendRecord();
	}, [audioUrl, onSendRecord]);

	const generateAudioList = useCallback(async () => {
		const blob = new Blob(chunksRef.current, { type: 'audio/mp3; codecs=opus' });

		const client = clientRef.current;
		const session = sessionRef.current;
		if (!client || !session) return;

		const timestamp = new Date().getTime();
		const fileUploaded = await handleUploadFile(
			client,
			session,
			'',
			`${currentInbox?.id}`,
			`${currentInbox?.id}` + timestamp + 'voice_record.mp3',
			blobToFile(blob)
		);

		const attachmentsArray = [fileUploaded];
		setAudioList(attachmentsArray);

		return attachmentsArray;
	}, [clientRef, sessionRef, currentInbox]);

	const sendRecording = useCallback(async () => {
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
	}, [audioUrl, audioList, isStopping, generateAudioList, sendMessage, resetRecording, onSendRecord]);

	useEffect(() => {
		startRecording();
		return () => {
			if (audioUrl) {
				URL.revokeObjectURL(audioUrl);
			}
			resetRecording();
			onSendRecord();
		};
	}, []);

	return (
		<AudioRecorderUI
			isRecording={isRecording}
			seconds={seconds}
			audioUrl={audioUrl}
			onStopRecording={stopRecording}
			onSendRecording={sendRecording}
			onResetRecording={resetRecording}
		/>
	);
});

export default AudioRecorderControl;
