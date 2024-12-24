import { TouchableOpacity } from '@gorhom/bottom-sheet';
import { PauseIcon, PlayIcon } from '@mezon/mobile-components';
import { Block, size, useTheme } from '@mezon/mobile-ui';
import { AVPlaybackStatusSuccess, Audio } from 'expo-av';
import LottieView from 'lottie-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Text } from 'react-native';
import { RECORD_WAVE } from '../../../../../../assets/lottie';
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
	const [currentTime, setCurrentTime] = useState(0);
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
		if (status?.durationMillis && status?.positionMillis === 0) {
			setTotalTime(status.durationMillis);
		}

		if (status?.isLoaded && status?.didJustFinish) {
			soundRef.current?.setPositionAsync(0);
			soundRef.current.pauseAsync();
			recordingWaveRef?.current?.reset();
			setIsPlaying(false);
		}
		setCurrentTime(status.positionMillis);
	}, []);

	const playSound = async () => {
		if (soundRef.current) {
			await soundRef.current.playAsync();
			setIsPlaying(true);
			recordingWaveRef?.current?.play();
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
		<Block
			marginHorizontal={size.s_6}
			marginVertical={size.s_4}
			width={'60%'}
			backgroundColor={themeValue.secondaryLight}
			padding={size.s_10}
			borderRadius={size.s_10}
		>
			<Block flexDirection="row" alignItems="center" gap={size.s_10} marginBottom={size.s_8}>
				<TouchableOpacity onPress={isPlaying ? pauseSound : playSound}>
					{isPlaying ? (
						<PauseIcon width={size.s_20} height={size.s_20} color={themeValue.textDisabled} />
					) : (
						<PlayIcon width={size.s_20} height={size.s_20} color={themeValue.textDisabled} />
					)}
				</TouchableOpacity>
				<LottieView source={RECORD_WAVE} ref={recordingWaveRef} resizeMode="cover" style={styles.soundLottie} />
				<Text style={styles.totalTime}>{`${formatTime(totalTime)}`}</Text>
			</Block>
			<Text style={styles.currentTime}>{`${formatTime(currentTime)}`}</Text>
		</Block>
	);
});

export default RenderAudioChat;
