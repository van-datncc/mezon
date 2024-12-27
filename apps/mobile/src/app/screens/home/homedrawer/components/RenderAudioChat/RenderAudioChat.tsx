import { PauseIcon, PlayIcon } from '@mezon/mobile-components';
import { Block, baseColor, size, useTheme } from '@mezon/mobile-ui';
import { AVPlaybackStatusSuccess, Audio } from 'expo-av';
import LottieView from 'lottie-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { WAY_AUDIO } from '../../../../../../assets/lottie';
import { style } from './styles';
const formatTime = (millis: number) => {
	const minutes = Math.floor(millis / 60000);
	const seconds = Math.floor((millis % 60000) / 1000);
	return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};
const RenderAudioChat = React.memo(({ audioURL }: { audioURL: string }) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const recordingWaveRef = useRef(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const soundRef = useRef<Audio.Sound | null>(null);
	const [totalTime, setTotalTime] = useState(0);
	useEffect(() => {
		const loadSound = async () => {
			try {
				const { sound: newSound } = await Audio.Sound.createAsync({ uri: audioURL });
				soundRef.current = newSound;
				newSound.setOnPlaybackStatusUpdate(handlePlaybackStatusUpdate);
			} catch (error) {
				console.error('Failed to load sound:', error);
			}
		};

		loadSound();

		return () => {
			if (soundRef.current) {
				soundRef.current.unloadAsync();
			}
		};
	}, [audioURL]);

	const handlePlaybackStatusUpdate = useCallback((status: AVPlaybackStatusSuccess) => {
		setTotalTime(status?.durationMillis - status?.positionMillis);
		if (status?.isLoaded && status?.didJustFinish) {
			soundRef.current?.setPositionAsync(0);
			soundRef.current.pauseAsync();
			recordingWaveRef?.current?.reset();
			setIsPlaying(false);
		}
	}, []);

	const playSound = async () => {
		if (soundRef.current) {
			await soundRef.current.playAsync();
			setIsPlaying(true);
			recordingWaveRef?.current?.play(0, 45);
		}
	};

	const pauseSound = async () => {
		if (soundRef.current) {
			recordingWaveRef?.current?.pause();
			await soundRef.current.pauseAsync();
			setIsPlaying(false);
		}
	};
	return (
		<TouchableOpacity onPress={isPlaying ? pauseSound : playSound} activeOpacity={0.6} style={styles.container}>
			<Block flexDirection="row" alignItems="center" gap={size.s_10}>
				<Block
					backgroundColor={baseColor.white}
					borderRadius={size.s_30}
					padding={size.s_8}
					alignItems="center"
					gap={size.s_10}
					justifyContent="center"
				>
					{isPlaying ? (
						<PauseIcon width={size.s_20} height={size.s_20} color={baseColor.bgDeepLavender} />
					) : (
						<PlayIcon width={size.s_20} height={size.s_20} color={baseColor.bgDeepLavender} />
					)}
				</Block>
				<LottieView source={WAY_AUDIO} ref={recordingWaveRef} resizeMode="cover" style={styles.soundLottie} />
				<Text style={styles.currentTime}>{`${formatTime(totalTime)}`}</Text>
			</Block>
		</TouchableOpacity>
	);
});

export default RenderAudioChat;
