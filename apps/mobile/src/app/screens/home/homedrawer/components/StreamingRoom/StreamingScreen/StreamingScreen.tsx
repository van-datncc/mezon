import { Block, useTheme } from '@mezon/mobile-ui';
import { default as React, memo } from 'react';
// import Orientation from 'react-native-orientation-locker';
import { style } from './styles';

import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { RTCView } from 'react-native-webrtc';
import Images from '../../../../../../../assets/Images';
import { useWebRTCStream } from '../../../../../../components/StreamContext/StreamContext';
export function StreamingScreen() {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const { isStream, isRemoteVideoStream, remoteStream } = useWebRTCStream();
	const { t } = useTranslation(['streamingRoom']);

	return (
		<View style={styles.container}>
			{remoteStream && isStream ? (
				<Block width={'100%'} height={'100%'} justifyContent="center" alignItems="center">
					{!isRemoteVideoStream && <FastImage source={Images.RADIO_NCC8} style={{ width: '100%', height: 400 }} resizeMode={'contain'} />}
					<RTCView streamURL={remoteStream?.toURL?.()} style={{ flex: 1 }} mirror={true} objectFit={'cover'} />
				</Block>
			) : (
				<Block width={'100%'} height={'100%'} justifyContent="center" alignItems="center">
					<Text style={styles.errorText}>{t('noDisplay')}</Text>
				</Block>
			)}
		</View>
	);
}

export const StreamingScreenComponent = memo(StreamingScreen);
