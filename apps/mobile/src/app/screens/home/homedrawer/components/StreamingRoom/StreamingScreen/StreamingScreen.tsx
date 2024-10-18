import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@mezon/mobile-ui';
import { selectStreamChannelByChannelId } from '@mezon/store-mobile';
import { memo, default as React, useRef, useState } from 'react';
import { StatusBar, TouchableOpacity, View } from 'react-native';
import Orientation from 'react-native-orientation-locker';
import Video from 'react-native-video';
import { useSelector } from 'react-redux';
import { style } from './styles';

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

	return (
		<View style={styles.container}>
			<Video
				controls={false}
				ref={videoRef}
				source={{
					uri: channelStream?.streaming_url
				}}
				resizeMode={isFullScreen ? 'cover' : 'contain'}
				style={isFullScreen ? styles.fullScreenVideo : styles.video}
				onError={(err) => {
					console.log('Video error', err);
				}}
			/>

			{(isAnimationComplete || isFullScreen) && (
				<TouchableOpacity style={styles.fullScreenButton} onPress={handleFullScreen}>
					<Ionicons name={isFullScreen ? 'contract-outline' : 'expand-outline'} size={24} color="white" />
				</TouchableOpacity>
			)}
		</View>
	);
}

export const MemoizedStreamingScreen = memo(StreamingScreen);
