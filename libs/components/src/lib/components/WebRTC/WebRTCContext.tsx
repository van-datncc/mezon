import { useAuth } from '@mezon/core';
import { selectJoinPTTByChannelId, useAppSelector } from '@mezon/store';
import { useMezon } from '@mezon/transport';
import { WebrtcSignalingType } from 'mezon-js';
import React, { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { compress, decompress } from '../DmList/DMtopbar';

// Define the context value type
interface WebRTCContextType {
	channelId?: string | null;
	localStream: MediaStream | null;
	remoteStream: MediaStream | null;
	initializePeerConnection: () => void;
	startLocalStream: () => Promise<void>;
	stopSession: () => Promise<void>;
	createOffer: () => Promise<void>;
	createAnswer: (offer: RTCSessionDescriptionInit) => Promise<void>;
	addIceCandidate: (candidate: RTCIceCandidateInit) => Promise<void>;
	toggleMicrophone: (value: boolean) => void;
	setChannelId: (value: string) => void;
}

// Create the WebRTC Context
const WebRTCContext = createContext<WebRTCContextType | undefined>(undefined);

// Provider Component Props
interface WebRTCProviderProps {
	children: ReactNode;
}

// WebRTCProvider Implementation
export const WebRTCProvider: React.FC<WebRTCProviderProps> = ({ children }) => {
	const { userId } = useAuth();
	const mezon = useMezon();
	const pushToTalkData = useAppSelector((state) => selectJoinPTTByChannelId(state, userId));
	const [localStream, setLocalStream] = useState<MediaStream | null>(null);
	const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
	const channelId = useRef<string | null>(null);
	const peerConnection = useRef<RTCPeerConnection | null>(null);

	const servers: RTCConfiguration = useMemo(
		() => ({
			iceServers: [
				{
					urls: process.env.NX_WEBRTC_ICESERVERS_URL as string,
					username: process.env.NX_WEBRTC_ICESERVERS_USERNAME,
					credential: process.env.NX_WEBRTC_ICESERVERS_CREDENTIAL
				}
			]
		}),
		[]
	);

	const setChannelId = (id: string) => {
		channelId.current = id;
	};

	const initializePeerConnection = useCallback(() => {
		peerConnection.current = new RTCPeerConnection(servers);

		peerConnection.current.ontrack = (event) => {
			if (event?.streams?.[0]) {
				setRemoteStream(event.streams[0]);
			}
		};

		peerConnection.current.onicecandidate = async (event) => {
			if (event && event.candidate && mezon.socketRef.current?.isOpen() === true) {
				await mezon.socketRef.current?.joinPTTChannel(
					channelId.current || '',
					WebrtcSignalingType.WEBRTC_ICE_CANDIDATE,
					JSON.stringify(event.candidate)
				);
			}
		};
		return peerConnection.current;
	}, [mezon.socketRef, servers]);

	const startLocalStream = async () => {
		try {
			if (!mezon.socketRef.current) {
				return;
			}

			const connection = initializePeerConnection();
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			setLocalStream(stream);
			stream.getTracks().forEach((track) => {
				connection.addTrack(track, stream);
			});
			await mezon.socketRef.current?.joinPTTChannel(channelId.current || '', WebrtcSignalingType.WEBRTC_SDP_OFFER, '');
		} catch (error) {
			console.error('Error accessing audio devices: ', error);
		}
	};

	const stopSession = useCallback(async () => {
		// Stop all tracks in the local stream
		localStream?.getTracks().forEach((track) => track.stop());

		// Close the peer connection
		peerConnection.current?.close();
		peerConnection.current = null;
		// Reset state
		setLocalStream(null);
		setRemoteStream(null);
		mezon.socketRef.current?.joinPTTChannel(channelId.current || '', WebrtcSignalingType.WEBRTC_SDP_QUIT, '{}');
	}, [localStream, mezon.socketRef]);

	const toggleMicrophone = useCallback(
		async (value: boolean) => {
			if (localStream && channelId && mezon.socketRef) {
				await mezon.socketRef.current?.talkPTTChannel(channelId.current || '', 5, JSON.stringify({}), value === true ? 0 : -1);
				localStream.getAudioTracks().forEach((track) => {
					track.enabled = value;
				});
			}
		},
		[localStream, mezon.socketRef]
	);

	const createOffer = useCallback(async () => {
		if (!peerConnection.current) return;
		const offer = await peerConnection.current.createOffer();
		await peerConnection.current.setLocalDescription(offer);
		// Send offer to signaling server
	}, []);

	const createAnswer = useCallback(async (offer: RTCSessionDescriptionInit) => {
		if (!peerConnection.current) return;
		await peerConnection.current.setRemoteDescription(offer);
		const answer = await peerConnection.current.createAnswer();
		await peerConnection.current.setLocalDescription(answer);
		// Send answer to signaling server
	}, []);

	const addIceCandidate = useCallback(async (candidate: RTCIceCandidateInit) => {
		try {
			await peerConnection.current?.addIceCandidate(candidate);
		} catch (error) {
			console.error('Error adding ICE candidate: ', error);
		}
	}, []);

	useEffect(() => {
		if (!peerConnection.current) {
			return;
		}

		const lastData = pushToTalkData?.[pushToTalkData?.length - 1];
		if (!lastData) return;
		const data = lastData?.joinPttData;
		switch (data.data_type) {
			case WebrtcSignalingType.WEBRTC_SDP_OFFER:
				{
					const processData = async () => {
						const dataDec = await decompress(data?.json_data);
						const objData = JSON.parse(dataDec || '{}');

						// Get peerConnection from receiver event.receiverId
						await peerConnection.current?.setRemoteDescription(new RTCSessionDescription(objData));
						const answer = await peerConnection.current?.createAnswer();
						await peerConnection.current?.setLocalDescription(answer);

						const answerEnc = await compress(JSON.stringify(answer));
						await mezon.socketRef.current?.joinPTTChannel(channelId.current || '', WebrtcSignalingType.WEBRTC_SDP_ANSWER, answerEnc);
					};
					processData().catch(console.error);
				}
				break;
			case WebrtcSignalingType.WEBRTC_ICE_CANDIDATE:
				{
					const processData = async () => {
						const objData = JSON.parse(data?.json_data || '{}');
						if (peerConnection.current?.remoteDescription) {
							await peerConnection.current?.addIceCandidate(new RTCIceCandidate(objData));
						}
					};
					processData().catch(console.error);
				}
				break;
			default:
				break;
		}
	}, [mezon.socketRef, pushToTalkData]);

	const value: WebRTCContextType = {
		channelId: channelId.current,
		localStream,
		remoteStream,
		toggleMicrophone,
		initializePeerConnection,
		startLocalStream,
		stopSession,
		createOffer,
		createAnswer,
		addIceCandidate,
		setChannelId
	};

	return <WebRTCContext.Provider value={value}>{children}</WebRTCContext.Provider>;
};

// Custom Hook
export const useWebRTC = (): WebRTCContextType => {
	const context = useContext(WebRTCContext);
	if (!context) {
		throw new Error('useWebRTC must be used within a WebRTCProvider');
	}
	return context;
};
