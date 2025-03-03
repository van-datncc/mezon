import { Ionicons } from '@expo/vector-icons';
import { Colors, Metrics, size } from '@mezon/mobile-ui';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, Modal, Text, TouchableOpacity, View } from 'react-native';
import { createThumbnail } from 'react-native-create-thumbnail';
import Toast from 'react-native-toast-message';
import Video from 'react-native-video';

const widthMedia = Metrics.screenWidth - 150;

export const RenderVideoChat = React.memo(
	({ videoURL }: { videoURL: string }) => {
		const videoRef = useRef(null);
		const [isFullscreen, setIsFullscreen] = useState(false);
		const [hasError, setHasError] = useState(false);
		const [isBuffering, setIsBuffering] = useState(false);
		const [thumbnail, setThumbnail] = useState<string | null>(null);
		const [loading, setLoading] = useState(true);
		const [isPlaying, setIsPlaying] = useState(false);

		useEffect(() => {
			if (videoURL) {
				createThumbnail({ url: videoURL, timeStamp: 1000 })
					.then((response) => setThumbnail(response.path))
					.catch(() => {
						setThumbnail(null);
						Toast.show({ type: 'error', text1: 'Failed to generate thumbnail.' });
					})
					.finally(() => setLoading(false));
			}
		}, [videoURL]);

		const handlePlayVideo = () => setIsFullscreen(true);
		const handleCloseFullscreen = () => setIsFullscreen(false);
		const handleRetry = () => {
			setHasError(false);
		};

		const onError = () => {
			setHasError(true);
			Toast.show({ type: 'error', text1: 'Failed to load video.' });
		};

		const onBuffer = ({ isBuffering }: { isBuffering: boolean }) => {
			setIsBuffering(isBuffering);
		};

		const onLoad = () => {
			setHasError(false);
		};

		if (!videoURL) return null;
		const isUploading = !videoURL.startsWith('http');

		return (
			<View style={{ marginTop: size.s_10, marginBottom: size.s_6, opacity: isUploading ? 0.5 : 1 }}>
				{loading || isUploading ? (
					<View
						style={{
							width: Math.max(widthMedia, Metrics.screenWidth - size.s_60 * 2),
							height: Math.max(160, size.s_100 * 2.5),
							alignItems: 'center',
							justifyContent: 'center',
							backgroundColor: Colors.borderDim
						}}
					>
						<ActivityIndicator />
					</View>
				) : (
					<TouchableOpacity onPress={handlePlayVideo}>
						<Image
							source={{ uri: thumbnail || '' }}
							style={{
								width: Math.max(widthMedia, Metrics.screenWidth - size.s_60 * 2),
								height: Math.max(160, size.s_100 * 2.5),
								borderRadius: size.s_4,
								backgroundColor: Colors.borderDim
							}}
							resizeMode="contain"
						/>
						<View
							style={{
								position: 'absolute',
								top: '50%',
								left: '40%',
								transform: [{ translateX: -25 }, { translateY: -25 }],
								backgroundColor: 'rgba(0, 0, 0, 0.5)',
								borderRadius: size.s_50,
								width: size.s_50,
								height: size.s_50,
								justifyContent: 'center',
								alignItems: 'center'
							}}
						>
							<Ionicons name="play" size={size.s_32} color="#fff" />
						</View>
					</TouchableOpacity>
				)}

				<Modal visible={isFullscreen} animationType="slide" supportedOrientations={['portrait', 'landscape']}>
					<View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
						<Video
							ref={videoRef}
							source={{ uri: videoURL }}
							style={{ width: '100%', height: '100%' }}
							resizeMode="contain"
							controls
							paused={false}
							onError={onError}
							onBuffer={onBuffer}
							onLoad={onLoad}
							ignoreSilentSwitch="ignore"
							onReadyForDisplay={() => setIsPlaying(true)}
						/>

						<TouchableOpacity
							onPress={handleCloseFullscreen}
							style={{ position: 'absolute', top: size.s_4, right: size.s_4, padding: size.s_10 }}
						>
							<Ionicons name="close" size={size.s_32} color="#fff" />
						</TouchableOpacity>

						{(isBuffering || !isPlaying) && (
							<ActivityIndicator
								style={{ position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -15 }, { translateY: -15 }] }}
							/>
						)}

						{hasError && (
							<TouchableOpacity
								onPress={handleRetry}
								style={{ position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -40 }, { translateY: -10 }] }}
							>
								<Text style={{ color: 'white' }}>Retry</Text>
							</TouchableOpacity>
						)}
					</View>
				</Modal>
			</View>
		);
	},
	(prevProps, nextProps) => prevProps.videoURL === nextProps.videoURL
);
