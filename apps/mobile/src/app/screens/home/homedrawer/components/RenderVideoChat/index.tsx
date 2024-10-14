import { Block, Colors, Metrics, size } from '@mezon/mobile-ui';
import { Audio, Video as ExpoVideo, ResizeMode } from 'expo-av';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';

const widthMedia = Metrics.screenWidth - 150;

export const RenderVideoChat = React.memo(
	({ videoURL }: { videoURL: string }) => {
		const [videoDimensions, setVideoDimensions] = useState({ width: widthMedia + size.s_50, height: 160, isLoading: true });
		useEffect(() => {
			Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
		}, []);
		if (!videoURL) return null;
		const isUploading = !videoURL?.includes('http');

		return (
			<Block marginTop={size.s_10} marginBottom={size.s_6} opacity={isUploading || videoDimensions?.isLoading ? 0.5 : 1}>
				<ExpoVideo
					onError={(err) => {
						console.log('load error', err);
					}}
					onReadyForDisplay={(event) => {
						const { width, height } = event.naturalSize || {};
						const aspectRatio = width / height;
						const calculatedWidth = widthMedia;
						const calculatedHeight = calculatedWidth / aspectRatio;
						setVideoDimensions({ width: calculatedWidth, height: calculatedHeight, isLoading: false });
					}}
					source={{
						uri: videoURL
					}}
					useNativeControls
					resizeMode={ResizeMode.CONTAIN}
					rate={1.0}
					removeClippedSubviews
					shouldRasterizeIOS
					style={{
						width: Math.max(videoDimensions.width, Metrics.screenWidth - size.s_60 * 2),
						height: Math.max(videoDimensions.height, size.s_100 * 2.5),
						borderRadius: size.s_4,
						overflow: 'hidden',
						backgroundColor: Colors.borderDim
					}}
				/>
				{(isUploading || videoDimensions?.isLoading) && (
					<Block
						position="absolute"
						top={0}
						left={0}
						right={0}
						bottom={15}
						width={Math.max(videoDimensions.width, Metrics.screenWidth - size.s_60 * 2)}
						height={Math.max(videoDimensions.height, size.s_100 * 2.5)}
						alignItems="center"
						justifyContent="center"
					>
						<ActivityIndicator />
					</Block>
				)}
			</Block>
		);
	},
	(prevProps, nextProps) => prevProps.videoURL === nextProps.videoURL
);
