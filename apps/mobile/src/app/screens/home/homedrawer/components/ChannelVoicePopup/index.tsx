import { useAuth } from '@mezon/core';
import { ActionEmitEvent } from '@mezon/mobile-components';
import { generateMeetToken, handleParticipantMeetState, selectChannelById2, voiceActions } from '@mezon/store';
import { useAppDispatch } from '@mezon/store-mobile';
import { ParticipantMeetState } from '@mezon/utils';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, DeviceEventEmitter, PanResponder } from 'react-native';
import { useSelector } from 'react-redux';
import ChannelVoice from '../ChannelVoice';

const ChannelVoicePopup = () => {
	const serverUrl = 'wss://meet.mezon.vn';
	const pan = useRef(new Animated.ValueXY()).current;
	const isDragging = useRef(false);
	const isFullScreen = useRef(true);
	const [isAnimationComplete, setIsAnimationComplete] = useState(true);
	const [voicePlay, setVoicePlay] = useState(false);
	const dispatch = useAppDispatch();
	const [channelId, setChannelId] = useState();
	const [roomName, setRoomName] = useState('');
	const [token, setToken] = useState<string | null>(null);
	const channel = useSelector((state) => selectChannelById2(state, channelId));
	const { userProfile } = useAuth();

	const panResponder = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onPanResponderGrant: () => {
				isDragging.current = false;
				if (!isFullScreen.current) {
					pan?.setOffset({
						x: (pan?.x as any)?._value,
						y: (pan?.y as any)?._value
					});
					pan?.setValue({ x: 0, y: 0 });
				}
			},
			onPanResponderMove: (e, gestureState) => {
				if (!isFullScreen.current) {
					if (Math.abs(gestureState?.dx) > 10 || Math.abs(gestureState?.dy) > 10) {
						isDragging.current = true;
					}
					Animated.event([null, { dx: pan?.x, dy: pan?.y }], { useNativeDriver: false })(e, gestureState);
				}
			},
			onPanResponderRelease: (e, gestureState) => {
				const totalDistance = Math.sqrt(gestureState?.dx ** 2 + gestureState?.dy ** 2);
				if (totalDistance > 10) {
					isDragging.current = true;
				}

				if (!isDragging.current) {
					isFullScreen.current = !isFullScreen.current;
					handleResizeStreamRoom();
				}

				if (!isFullScreen.current) {
					pan?.flattenOffset();
				}
			}
		})
	).current;

	const participantMeetState = async (state: ParticipantMeetState, channelId: string): Promise<void> => {
		await dispatch(
			handleParticipantMeetState({
				clan_id: channel.clan_id,
				channel_id: channelId,
				user_id: userProfile?.user?.id,
				display_name: userProfile?.user?.display_name,
				state
			})
		);
	};

	const handleLeaveRoom = async (voiceChannelId: string) => {
		if (voiceChannelId) {
			await participantMeetState(ParticipantMeetState.LEAVE, voiceChannelId as string);
			dispatch(voiceActions.resetVoiceSettings());
		}
	};

	useEffect(() => {
		const eventOpenMezonMeet = DeviceEventEmitter.addListener(ActionEmitEvent.ON_OPEN_MEZON_MEET, async (data) => {
			if (data?.isEndCall || data?.voiceChannelId) {
				setVoicePlay(false);
				handleLeaveRoom(data?.voiceChannelId);
			}
			setChannelId(data.channelId);
			setRoomName(data.roomName);
		});
		return () => {
			eventOpenMezonMeet.remove();
		};
	}, [channelId, roomName]);

	const handleJoinStreamingRoom = useCallback(async () => {
		if (!roomName) return;

		try {
			const result = await dispatch(
				generateMeetToken({
					channelId,
					roomName
				})
			).unwrap();

			if (result) {
				dispatch(voiceActions.setVoiceChannelId(channelId));
				await participantMeetState(ParticipantMeetState.JOIN, channelId as string);
				setToken(result);
				setVoicePlay(true);
			} else {
				setToken(null);
			}
		} catch (err) {
			console.error('Failed to join room:', err);
			setToken(null);
		}
	}, [channelId, dispatch, roomName]);

	useEffect(() => {
		if (roomName && channelId) {
			handleJoinStreamingRoom();
		}
	}, [channelId, handleJoinStreamingRoom, roomName]);

	const handleResizeStreamRoom = () => {
		if (isFullScreen.current) {
			pan?.flattenOffset();
			Animated.timing(pan, {
				toValue: { x: 0, y: 0 },
				duration: 300,
				useNativeDriver: false
			}).start(() => {
				setIsAnimationComplete(true);
			});
		} else {
			pan?.flattenOffset();
			Animated.timing(pan, {
				toValue: { x: 0, y: 0 },
				duration: 300,
				useNativeDriver: false
			}).start(() => {
				setIsAnimationComplete(false);
			});
		}
	};

	const handlePressMinimizeRoom = useCallback(() => {
		isFullScreen.current = false;
		handleResizeStreamRoom();
	}, []);

	if (!voicePlay) return null;
	return (
		<Animated.View
			{...panResponder.panHandlers}
			style={[
				pan?.getLayout(),
				{
					zIndex: 999999,
					position: 'absolute'
				}
			]}
		>
			<ChannelVoice
				channelId={channelId}
				token={token}
				serverUrl={serverUrl}
				isAnimationComplete={isAnimationComplete}
				onPressMinimizeRoom={handlePressMinimizeRoom}
			/>
		</Animated.View>
	);
};

export default ChannelVoicePopup;
