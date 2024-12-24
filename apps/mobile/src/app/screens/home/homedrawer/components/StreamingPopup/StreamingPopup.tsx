import { useTheme } from '@mezon/mobile-ui';
import {
	appActions,
	selectAllAccount,
	selectCurrentChannel,
	selectCurrentClan,
	selectHiddenBottomTabMobile,
	selectStatusStream,
	useAppDispatch,
	videoStreamActions
} from '@mezon/store';
import messaging from '@react-native-firebase/messaging';
import { ChannelType } from 'mezon-js';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Keyboard, PanResponder, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { useWebRTCStream } from '../../../../../components/StreamContext/StreamContext';
import StreamingRoom from '../StreamingRoom';
import { style } from './styles';
const { width, height } = Dimensions.get('window');

export const StreamingPopup = () => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
	const [isFullScreen, setIsFullScreen] = useState(true);
	const streamPlay = useSelector(selectStatusStream);

	const [windowSize, setWindowSize] = useState(new Animated.ValueXY({ x: 100, y: 100 }));
	const [isAnimationComplete, setIsAnimationComplete] = useState(true);
	const dispatch = useAppDispatch();
	const isHiddenTab = useSelector(selectHiddenBottomTabMobile);
	const currentClan = useSelector(selectCurrentClan);
	const currentChannel = useSelector(selectCurrentChannel);
	const { handleChannelClick, disconnect } = useWebRTCStream();
	const userProfile = useSelector(selectAllAccount);

	const panResponder = useRef(
		PanResponder.create({
			onMoveShouldSetPanResponder: () => true,
			onPanResponderMove: (event, gestureState) => {
				Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false })(event, gestureState);
			},
			onPanResponderRelease: () => {
				pan.extractOffset();
			}
		})
	).current;

	useEffect(() => {
		if (isFullScreen) {
			Animated.timing(windowSize, {
				toValue: { x: width, y: height },
				duration: 100,
				useNativeDriver: false
			}).start();
		}
		handleJoinStreamingRoom();
	}, []);

	const handleJoinStreamingRoom = useCallback(async () => {
		if (currentClan && currentChannel?.type === ChannelType.CHANNEL_TYPE_STREAMING) {
			const token = await messaging().getToken();
			disconnect();
			handleChannelClick(
				currentClan?.id as string,
				currentChannel.channel_id as string,
				userProfile?.user?.id as string,
				currentChannel.channel_id as string,
				userProfile?.user?.username as string,
				token as string
			);
			dispatch(
				videoStreamActions.startStream({
					clanId: currentClan.id || '',
					clanName: currentClan.clan_name || '',
					streamId: currentChannel.channel_id || '',
					streamName: currentChannel.channel_label || '',
					parentId: currentChannel.parrent_id || ''
				})
			);
			dispatch(appActions.setIsShowChatStream(false));
		}
	}, []);

	const handleResizeStreamRoom = useCallback(
		(isFullScreen: boolean) => {
			if (isFullScreen) {
				pan.setOffset({ x: 0, y: 0 });

				Animated.parallel([
					Animated.spring(pan, {
						toValue: { x: 0, y: 0 },
						useNativeDriver: false
					}),
					Animated.timing(windowSize, {
						toValue: { x: width, y: height },
						duration: 100,
						useNativeDriver: false
					})
				]).start(() => {
					setIsAnimationComplete(true);
				});
			} else {
				Animated.timing(windowSize, {
					toValue: { x: 100, y: 100 },
					duration: 100,
					useNativeDriver: false
				}).start(() => {
					setIsAnimationComplete(false);
				});
			}
			setIsFullScreen(isFullScreen);
			Keyboard.dismiss();
		},
		[isHiddenTab]
	);
	if (!streamPlay) return null;
	return (
		<Animated.View
			style={[
				styles.animatedView,
				{
					width: windowSize.x,
					height: windowSize.y,
					transform: [{ translateX: pan.x }, { translateY: pan.y }],
					position: 'absolute'
				}
			]}
			{...(!isFullScreen ? panResponder.panHandlers : {})}
		>
			<TouchableOpacity activeOpacity={1} onPress={() => !isFullScreen && handleResizeStreamRoom(true)}>
				<StreamingRoom isAnimationComplete={isAnimationComplete} onPressMinimizeRoom={handleResizeStreamRoom} />
			</TouchableOpacity>
		</Animated.View>
	);
};
