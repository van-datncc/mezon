import { ChannelsEntity } from '@mezon/store';
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

interface WebRTCContextType {
	isSupported: boolean;
	isConnected: boolean;
	connectionState: RTCIceConnectionState;
	connect: () => Promise<void>;
	disconnect: () => void;
	sendMessage: (message: Record<string, unknown>) => void;
	errors: string[];
	messages: string[];
	handleChannelClick: (clanId: string, channelId: string, userId: string, channel: ChannelsEntity) => void;
	streamVideoRef: React.RefObject<HTMLVideoElement>;
	connectSocket: () => void;
}

interface WebRTCProviderProps {
	children: React.ReactNode;
}

const WebRTCStreamContext = createContext<WebRTCContextType | null>(null);

export const WebRTCStreamProvider: React.FC<WebRTCProviderProps> = ({ children }) => {
	const [ws, setWs] = useState<WebSocket | null>(null);
	const [isSupported, setIsSupported] = useState(true);
	const [isConnected, setIsConnected] = useState(false);
	const [connectionState, setConnectionState] = useState<RTCIceConnectionState>('new');
	const [errors, setErrors] = useState<string[]>([]);
	const [messages, setMessages] = useState<string[]>([]);
	const streamVideoRef = useRef<HTMLVideoElement>(null);
	const pcRef = useRef<RTCPeerConnection | null>(null);

	const debug = useCallback((...args: string[]) => {
		console.log(...args);
		addMessage(args.join(' '));
	}, []);

	const addError = useCallback((...msgs: string[]) => {
		console.log(...msgs);
		setErrors((prev) => [...prev, ...msgs]);
	}, []);

	const addMessage = useCallback((message: string) => {
		const timestamp = new Date().toISOString();
		setMessages((prev) => [`${timestamp} ${message}`, ...prev]);
	}, []);

	useEffect(() => {
		const checkSupport = () => {
			const supported = !!(
				navigator.mediaDevices?.getUserMedia ||
				(navigator as any).webkitGetUserMedia ||
				(navigator as any).mozGetUserMedia ||
				(navigator as any).msGetUserMedia ||
				window.RTCPeerConnection
			);
			setIsSupported(supported);

			if (!supported) {
				addError('WebRTC is not supported in your browser');
			}
		};
		checkSupport();
	}, [addError]);

	// WebSocket handling
	const wsSend = useCallback(
		(message: Record<string, unknown>) => {
			const jsonStr = JSON.stringify(message);
			if (ws?.readyState === WebSocket.OPEN) {
				ws.send(jsonStr);
			} else {
				debug('ws: send not ready, skipping...', jsonStr);
			}
		},
		[ws, debug]
	);

	const connectSocket = () => {
		const websocket = new WebSocket('wss://stn.nccsoft.vn/ws');
		try {
			const peerConnection = initPeerConnection();
			websocket.onopen = () => {
				debug('ws: connection open');
				const f = () => {
					console.log('webrtc: create offer');
					peerConnection
						?.createOffer()
						.then((d) => {
							console.log('webrtc: set local description');
							peerConnection?.setLocalDescription(d);
							websocket.send(
								JSON.stringify({
									Key: 'session_subscriber',
									ClanId: '1',
									ChannelId: '2',
									UserId: '3',
									Value: d
								})
							);
							websocket.send(
								JSON.stringify({
									Key: 'get_channels'
								})
							);
							// websocket.send(JSON.stringify({ Key: 'connect_subscriber', Value: { ChannelId: 'ggg' } }));
						})
						.catch((e) => {
							console.log(e, 'error');
						});
				};
				websocket.readyState === WebSocket.OPEN ? f() : websocket.addEventListener('open', f);
			};

			websocket.onmessage = (event) => {
				const data = JSON.parse(event.data);
				if ('Key' in data) {
					switch (data.Key) {
						case 'channels':
							console.log(data.Value, 'vào channel');
							// setChannels(data.Value);
							break;
						case 'session_received':
							console.log('session_received');
							// setLoading(false);
							break;
						case 'error':
							console.log('error');
							// setError(data.Value);
							break;
						case 'sd_answer':
							startSession(data.Value);
							break;
						case 'ice_candidate':
							pcRef.current?.addIceCandidate(data.Value);
							break;
						default:
							console.log('Unhandled message:', data);
					}
				}
			};

			websocket.onerror = (error) => {
				addError('WebSocket error:', error.toString());
			};

			setWs(websocket);
		} catch (error) {
			console.log(error, 'error');
		}
	};

	// RTCPeerConnection handling
	const initPeerConnection = useCallback(() => {
		const peerConnection = new RTCPeerConnection({
			iceServers: [
				{
					urls: 'stun:stun.l.google.com:19302'
				}
			]
		});

		peerConnection.oniceconnectionstatechange = () => {
			debug('ICE state:', peerConnection.iceConnectionState);
			setConnectionState(peerConnection.iceConnectionState);
			setIsConnected(peerConnection.iceConnectionState === 'connected');
			// Handle spinner visibility based on connection state
			const states = ['new', 'checking', 'failed', 'disconnected', 'closed', 'completed', 'connected'];
			if (states.includes(peerConnection.iceConnectionState)) {
				// You might want to handle spinner visibility through a state
				debug(`ICE connection state changed to: ${peerConnection.iceConnectionState}`);
			}
		};

		peerConnection.onicecandidate = (event) => {
			if (event.candidate && event.candidate.candidate !== '') {
				const message = {
					Key: 'ice_candidate',
					Value: event.candidate
				};
				wsSend(message);
			}
		};

		peerConnection.ontrack = (event) => {
			const remoteStream = event.streams[0];
			console.log(remoteStream, 'remoteStream');
			if (streamVideoRef.current) {
				streamVideoRef.current.srcObject = remoteStream;
				streamVideoRef.current.autoplay = true;
				streamVideoRef.current.controls = true;
			}
		};

		peerConnection.addTransceiver('audio');

		pcRef.current = peerConnection;
		return peerConnection;
	}, [wsSend, debug]);

	const startSession = useCallback(
		(sd: string) => {
			if (pcRef.current) {
				try {
					console.log('webrtc: set remote description');
					pcRef.current.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: sd }));
				} catch (e) {
					alert(e);
				}
			}
		},
		[pcRef.current]
	);

	const connect = useCallback(async () => {
		if (!isSupported) {
			throw new Error('WebRTC is not supported');
		}

		const peerConnection = pcRef.current || initPeerConnection();

		try {
			const offer = await peerConnection.createOffer();
			console.log(offer, 'offer');
			await peerConnection.setLocalDescription(offer);

			wsSend({
				Key: 'offer',
				Value: offer
			});
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error during connection';
			addError(errorMessage);
			throw error;
		}
	}, [pcRef.current, wsSend, isSupported, initPeerConnection, addError]);

	const disconnect = useCallback(() => {
		pcRef.current?.close();
		// setPc(null);
		pcRef.current = null;
		setIsConnected(false);
		setConnectionState('closed');
		debug('WebRTC connection closed');
	}, [pcRef.current, debug]);

	const handleChannelClick = useCallback(
		(clanId: string, channelId: string, userId: string, channel: ChannelsEntity) => {
			if (ws) {
				// websocket.send(JSON.stringify({ Key: 'connect_subscriber', Value: { ChannelId: 'ggg' } }));
				wsSend({ Key: 'connect_subscriber', ClanId: clanId, ChannelId: channelId, UserId: userId, Value: { ChannelId: 'xxxx' } });
			}
		},
		[ws]
	);

	const value = {
		isSupported,
		isConnected,
		connectionState,
		connect,
		disconnect,
		sendMessage: wsSend,
		errors,
		messages,
		handleChannelClick,
		streamVideoRef,
		connectSocket
	};

	return <WebRTCStreamContext.Provider value={value}>{children}</WebRTCStreamContext.Provider>;
};

export const useWebRTCStream = () => {
	const context = useContext(WebRTCStreamContext);
	if (!context) {
		throw new Error('useWebRTC must be used within a WebRTCProvider');
	}
	return context;
};
