import { AudioSession, LiveKitRoom } from '@livekit/react-native';
import { Icons } from '@mezon/mobile-components';
import { Block, size, useTheme } from '@mezon/mobile-ui';
import React, { useEffect, useRef } from 'react';
import { Dimensions, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RoomView from './RoomView';
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
				<LiveKitRoom serverUrl={serverUrl} token={token} connect={true}>
					<RoomView onPressMinimizeRoom={onPressMinimizeRoom} isAnimationComplete={isAnimationComplete} />
				</LiveKitRoom>
			</Block>
		</SafeAreaView>
	);
}

export default React.memo(ChannelVoice);
