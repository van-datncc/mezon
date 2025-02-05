import {
	AudioSession,
	LiveKitRoom,
	TrackReferenceOrPlaceholder,
	VideoTrack,
	isTrackReference,
	useRoomContext,
	useTracks
} from '@livekit/react-native';
import { ActionEmitEvent, Icons } from '@mezon/mobile-components';
import { Block, baseColor, size, useTheme } from '@mezon/mobile-ui';
import { useNavigation } from '@react-navigation/native';
import { Track } from 'livekit-client';
import React, { useCallback, useEffect, useRef } from 'react';
import { DeviceEventEmitter, Dimensions, FlatList, ListRenderItem, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { style } from './styles';

const { width, height } = Dimensions.get('window');

function ChannelVoice({
	token,
	serverUrl,
	onPressMinimizeRoom,
	isAnimationComplete
}: {
	onPressMinimizeRoom?: () => void;
	token: string;
	serverUrl: string;
	isAnimationComplete: boolean;
}) {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const bottomSheetInviteRef = useRef(null);

	useEffect(() => {
		const start = async () => {
			await AudioSession.startAudioSession();
		};

		start();
		return () => {
			AudioSession.stopAudioSession();
		};
	}, []);

	const handleAddPeopleToVoice = () => {
		bottomSheetInviteRef.current.present();
	};

	return (
		<SafeAreaView>
			<Block
				style={{ width: isAnimationComplete ? width : 200, height: isAnimationComplete ? height : 100, backgroundColor: themeValue?.primary }}
			>
				{/* Header */}
				{isAnimationComplete && (
					<Block style={[styles.menuHeader]}>
						<Block flexDirection="row" alignItems="center" gap={size.s_20} flexGrow={1} flexShrink={1}>
							<TouchableOpacity
								onPress={() => {
									onPressMinimizeRoom();
								}}
								style={styles.buttonCircle}
							>
								<Icons.ChevronSmallDownIcon />
							</TouchableOpacity>
							<Text numberOfLines={1} style={[styles.text, { flexGrow: 1, flexShrink: 1 }]}>
								Voice Channel
							</Text>
						</Block>
						<Block flexDirection="row" alignItems="center" gap={size.s_20}>
							<TouchableOpacity onPress={handleAddPeopleToVoice} style={styles.buttonCircle}>
								<Icons.UserPlusIcon />
							</TouchableOpacity>
						</Block>
					</Block>
				)}

				{/* LiveKit Room */}
				<LiveKitRoom
					serverUrl={serverUrl}
					token={token}
					connect={true}
					audio={true}
					video={true}
					options={{
						adaptiveStream: { pixelDensity: 'screen' }
					}}
				>
					<RoomView isAnimationComplete={isAnimationComplete} />
				</LiveKitRoom>

				{/* Controls */}
			</Block>
		</SafeAreaView>
	);
}

const RoomView = ({ isAnimationComplete }: { isAnimationComplete: boolean }) => {
	const tracks = useTracks([Track.Source.Camera]);
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const room = useRoomContext();
	const navigation = useNavigation<any>();

	const renderTrack: ListRenderItem<TrackReferenceOrPlaceholder> = ({ item }) => {
		if (isTrackReference(item)) {
			return <VideoTrack trackRef={item} style={styles.participantView} />;
		} else {
			return <View style={styles.participantView} />;
		}
	};

	const handleEndCall = useCallback(() => {
		room.disconnect();
		DeviceEventEmitter.emit(ActionEmitEvent.ON_OPEN_MEZON_MEET, { isEndCall: true });
	}, [room]);

	return (
		<View style={styles.roomViewcontainer}>
			<FlatList data={tracks} renderItem={renderTrack} />
			{isAnimationComplete && (
				<Block style={[styles.menuFooter]}>
					<Block gap={size.s_20} flexDirection="row" alignItems="center" justifyContent="space-between" padding={size.s_14}>
						<TouchableOpacity style={styles.menuIcon}>
							<Icons.VideoIcon />
						</TouchableOpacity>
						<TouchableOpacity style={styles.menuIcon}>
							<Icons.MicrophoneIcon />
						</TouchableOpacity>
						<TouchableOpacity style={styles.menuIcon}>
							<Icons.ChatIcon />
						</TouchableOpacity>
						<TouchableOpacity style={styles.menuIcon}>
							<Icons.ShareIcon />
						</TouchableOpacity>
						<TouchableOpacity onPress={handleEndCall} style={{ ...styles.menuIcon, backgroundColor: baseColor.redStrong }}>
							<Icons.PhoneCallIcon />
						</TouchableOpacity>
					</Block>
				</Block>
			)}
		</View>
	);
};

export default React.memo(ChannelVoice);
