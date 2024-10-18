import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@mezon/mobile-ui';
import { selectStreamChannelByChannelId } from '@mezon/store-mobile';
import { memo, default as React, useRef, useState } from 'react';
import { StatusBar, TouchableOpacity, View } from 'react-native';
import Orientation from 'react-native-orientation-locker';
import Video from 'react-native-video';
import { useSelector } from 'react-redux';
import { style } from './styles';

import { ActivityIndicator, Text } from 'react-native';

export function StreamingScreen({
	streamID,
	onFullScreenVideo,
	isAnimationComplete
}: {
	isAnimationComplete: boolean;
	onFullScreenVideo: () => void;
	streamID: string;
}) {
	const channelStream = useSelector(selectStreamChannelByChannelId(streamID || ''));
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const videoRef = useRef(null);
	const [isFullScreen, setIsFullScreen] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	const handleFullScreen = () => {
		setIsFullScreen(!isFullScreen);
		onFullScreenVideo?.();
		if (!isFullScreen) {
			StatusBar.setHidden(true);
			Orientation.lockToLandscapeLeft();
		} else {
			StatusBar.setHidden(false);
			Orientation.lockToPortrait();
		}
	};

	const handleVideoLoadStart = () => {
		setLoading(true);
		setError(false);
	};

	const handleVideoLoad = () => {
		setLoading(false);
	};

	const handleVideoError = (err: any) => {
		setLoading(false);
		setError(true);
	};

	return (
		<View style={styles.container}>
			{loading && !error && (
				<View style={styles.loadingOverlay}>
					<ActivityIndicator size="large" color="white" />
				</View>
			)}

			{error ? (
				<View style={styles.errorContainer}>
					<Text style={styles.errorText}>No streaming available</Text>
				</View>
			) : (
				<Video
					controls={false}
					ref={videoRef}
					source={{
						uri: channelStream?.streaming_url
					}}
					resizeMode={isFullScreen ? 'cover' : 'contain'}
					style={isFullScreen ? styles.fullScreenVideo : styles.video}
					onLoadStart={handleVideoLoadStart}
					onLoad={handleVideoLoad}
					onError={handleVideoError}
				/>
			)}

			{(isAnimationComplete || isFullScreen) && !error && (
				<TouchableOpacity style={styles.fullScreenButton} onPress={handleFullScreen}>
					<Ionicons name={isFullScreen ? 'contract-outline' : 'expand-outline'} size={24} color="white" />
				</TouchableOpacity>
			)}
		</View>
	);
}

export const StreamingScreenComponent = memo(StreamingScreen);
