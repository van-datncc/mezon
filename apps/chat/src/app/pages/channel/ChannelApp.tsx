import { LiveKitRoom, RoomAudioRenderer, useLocalParticipant, VideoConference } from '@livekit/components-react';
import { useAuth } from '@mezon/core';
import {
	channelAppActions,
	giveCoffeeActions,
	handleParticipantMeetState,
	selectAllChannelMembers,
	selectAllRolesClan,
	selectChannelAppChannelId,
	selectChannelAppClanId,
	selectEnableMic,
	selectEnableVideo,
	selectInfoSendToken,
	selectJoinChannelAppData,
	selectLiveToken,
	selectSendTokenEvent,
	TOKEN_FAILED_STATUS,
	TOKEN_SUCCESS_STATUS,
	useAppDispatch,
	useAppSelector
} from '@mezon/store';
import { Loading } from '@mezon/ui';
import { ParticipantMeetState } from '@mezon/utils';
import { safeJSONParse } from 'mezon-js';
import { ApiChannelAppResponse, ApiTokenSentEvent } from 'mezon-js/api.gen';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

export function VideoRoom({ token, serverUrl }: { token: string; serverUrl: string | undefined }) {
	const enableMic = useSelector(selectEnableMic);

	return (
		<LiveKitRoom
			video={false}
			audio={enableMic}
			token={token}
			serverUrl={serverUrl}
			data-lk-theme="empty"
			className="w-full h-full flex justify-center items-center"
		>
			<RoomAudioRenderer />
			<div
				style={{
					position: 'relative',
					width: '100%',
					height: '100%',
					backgroundColor: '#000',
					overflow: 'hidden'
				}}
			>
				<VideoConference
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						width: '100%',
						height: '100%',
						objectFit: 'cover'
					}}
				/>
				<VideoControls />
			</div>
		</LiveKitRoom>
	);
}

export function ChannelApps({ appChannel }: { appChannel: ApiChannelAppResponse }) {
	const serverUrl = process.env.NX_CHAT_APP_MEET_WS_URL;
	const dispatch = useAppDispatch();
	const { userProfile } = useAuth();
	const [loading, setLoading] = useState<boolean>(false);

	const userChannels = useAppSelector((state) => selectAllChannelMembers(state, appChannel?.channel_id));
	const miniAppRef = useRef<HTMLIFrameElement>(null);
	const currentUser = useAuth();
	const allRolesInClan = useSelector(selectAllRolesClan);
	const sendTokenEvent = useSelector(selectSendTokenEvent);
	const infoSendToken = useSelector(selectInfoSendToken);
	const currentChannelAppClanId = useSelector(selectChannelAppClanId);
	const currentChannelAppId = useSelector(selectChannelAppChannelId);

	const channelAppUserData = useSelector(selectJoinChannelAppData);

	const miniAppDataHash = useMemo(() => {
		return `userChannels=${JSON.stringify(userChannels)}`;
	}, [userChannels]);

	useEffect(() => {
		if (currentChannelAppId && currentChannelAppClanId) {
			dispatch(channelAppActions.setJoinChannelAppData({ dataUpdate: undefined }));
			dispatch(
				handleParticipantMeetState({
					clan_id: currentChannelAppClanId,
					channel_id: currentChannelAppId,
					user_id: userProfile?.user?.id,
					display_name: userProfile?.user?.display_name,
					state: ParticipantMeetState.LEAVE
				})
			);
		}
		dispatch(channelAppActions.setRoomId(null));
		dispatch(channelAppActions.setChannelId(appChannel.channel_id || ''));
		dispatch(channelAppActions.setClanId(appChannel?.clan_id || null));
	}, []);

	const getUserHashInfo = useCallback(
		async (appId: string) => {
			try {
				const response = await dispatch(channelAppActions.generateAppUserHash({ appId: appId })).unwrap();

				return response;
			} catch (error) {
				console.error('Error:', error);
				return null;
			}
		},
		[dispatch, appChannel?.url]
	);

	useEffect(() => {
		if (appChannel?.url) {
			const compareHost = (url1: string, url2: string) => {
				try {
					const parsedURL1 = new URL(url1);
					const parsedURL2 = new URL(url2);
					return parsedURL1.hostname === parsedURL2.hostname;
				} catch (error) {
					return false;
				}
			};

			const handleMessage = async (event: MessageEvent) => {
				if (appChannel?.url && compareHost(event.origin, appChannel?.url ?? '')) {
					const eventData = safeJSONParse(event.data ?? '{}') || {};
					// eslint-disable-next-line no-console
					console.log('[MEZON] < ', eventData);

					const { eventType } = eventData;

					if (!eventType) return;

					if (eventType === 'PING') {
						miniAppRef.current?.contentWindow?.postMessage(
							JSON.stringify({ eventType: 'PONG', eventData: { message: 'PONG' } }),
							appChannel.url ?? ''
						);
						miniAppRef.current?.contentWindow?.postMessage(
							JSON.stringify({ eventType: 'CURRENT_USER_INFO', eventData: currentUser?.userProfile }),
							appChannel.url ?? ''
						);
					} else if (eventType === 'SEND_TOKEN') {
						const { amount, note, receiver_id, extra_attribute } = (eventData.eventData || {}) as any;
						const tokenEvent: ApiTokenSentEvent = {
							sender_id: currentUser.userId as string,
							sender_name: currentUser?.userProfile?.user?.username as string,
							receiver_id,
							amount,
							note,
							extra_attribute
						};
						dispatch(giveCoffeeActions.setInfoSendToken(tokenEvent));
						dispatch(giveCoffeeActions.setShowModalSendToken(true));
					} else if (eventType === 'GET_CLAN_ROLES') {
						miniAppRef.current?.contentWindow?.postMessage(
							JSON.stringify({ eventType: 'CLAN_ROLES_RESPONSE', eventData: allRolesInClan }),
							appChannel.url ?? ''
						);
					} else if (eventType === 'SEND_BOT_ID') {
						const { appId } = (eventData.eventData || {}) as any;
						const hashData = await getUserHashInfo(appId);
						miniAppRef.current?.contentWindow?.postMessage(
							JSON.stringify({ eventType: 'USER_HASH_INFO', eventData: { message: hashData } }),
							appChannel.url ?? ''
						);
					} else if (eventType === 'GET_CLAN_USERS') {
						miniAppRef.current?.contentWindow?.postMessage(
							JSON.stringify({ eventType: 'CLAN_USERS_RESPONSE', eventData: userChannels }),
							appChannel.url ?? ''
						);
					} else if (eventType === 'JOIN_ROOM') {
						const { roomId } = (eventData.eventData || {}) as any;
						dispatch(channelAppActions.setRoomId(roomId));
					} else if (eventType === 'LEAVE_ROOM') {
						dispatch(channelAppActions.setRoomId(null));
					} else if (eventType === 'CREATE_VOICE_ROOM') {
						// eslint-disable-next-line no-console
						const { roomId } = (eventData.eventData || {}) as any;
						dispatch(channelAppActions.createChannelAppMeet({ channelId: appChannel?.channel_id as string, roomName: roomId }));
					}
				}
			};
			window.addEventListener('message', handleMessage);
			return () => window.removeEventListener('message', handleMessage);
		}
	}, [appChannel?.url, channelAppUserData]);

	const handleTokenResponse = () => {
		if (sendTokenEvent?.status === TOKEN_SUCCESS_STATUS) {
			miniAppRef.current?.contentWindow?.postMessage(
				JSON.stringify({ eventType: 'SEND_TOKEN_RESPONSE_SUCCESS', eventData: infoSendToken?.sender_id }),
				appChannel.url ?? ''
			);
		} else if (sendTokenEvent?.status === TOKEN_FAILED_STATUS) {
			miniAppRef.current?.contentWindow?.postMessage(
				JSON.stringify({ eventType: 'SEND_TOKEN_RESPONSE_FAILED', eventData: infoSendToken?.sender_id }),
				appChannel.url ?? ''
			);
		}
	};

	useEffect(() => {
		handleTokenResponse();
		dispatch(giveCoffeeActions.setSendTokenEvent(null));
		dispatch(giveCoffeeActions.setInfoSendToken(null));
	}, [sendTokenEvent]);

	const token = useSelector(selectLiveToken);
	const participantMeetState = useCallback(
		async (state: ParticipantMeetState, channelId: string) => {
			try {
				await dispatch(
					handleParticipantMeetState({
						clan_id: appChannel.clan_id,
						channel_id: channelId,
						user_id: userProfile?.user?.id,
						display_name: userProfile?.user?.display_name,
						state
					})
				);
			} catch (err) {
				console.error('Failed to update participant state:', err);
			}
		},
		[dispatch, appChannel, userProfile]
	);

	useEffect(() => {
		if (!appChannel?.url) return;
		setLoading(true);

		const joinRoom = async () => {
			try {
				await participantMeetState(ParticipantMeetState.JOIN, appChannel.channel_id as string);
			} catch (err) {
				console.error('Failed to join room:', err);
			} finally {
				setLoading(false);
			}
		};

		joinRoom();
	}, [appChannel, participantMeetState]);
	return appChannel?.url ? (
		<>
			<div className="w-full h-full border border-red-600">
				<iframe
					allow="clipboard-read; clipboard-write"
					ref={miniAppRef}
					title={appChannel?.url}
					src={`${appChannel?.url}#${miniAppDataHash}`}
					style={{
						width: '100vw',
						height: '100vh'
					}}
				/>
			</div>

			{token ? (
				<div className="hidden">
					<VideoRoom token={token} serverUrl={serverUrl} />
				</div>
			) : null}
		</>
	) : (
		<div className="w-full h-full flex items-center justify-center">
			<Loading />
		</div>
	);
}

function VideoControls() {
	const enableVideo = useSelector(selectEnableVideo);
	const enableMic = useSelector(selectEnableMic);
	const { localParticipant } = useLocalParticipant();

	useEffect(() => {
		if (localParticipant) {
			localParticipant.setCameraEnabled(enableVideo).catch(console.error);
			localParticipant.setMicrophoneEnabled(enableMic).catch(console.error);
		}
	}, [enableVideo, enableMic, localParticipant]);

	return null;
}
