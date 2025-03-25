import { size, useTheme } from '@mezon/mobile-ui';
import { useNavigation } from '@react-navigation/native';
import { useCallback, useRef } from 'react';
import { Keyboard, Text, TouchableOpacity, View } from 'react-native';
import { APP_SCREEN } from '../../../navigation/ScreenTypes';
import { style } from './styles';

type channelAppHotBarProps = {
	channelId: string;
};

const ChannelAppHotbar = ({ channelId }: channelAppHotBarProps) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const timeoutRef = useRef<any>(null);
	const navigation = useNavigation<any>();

	const handleLauchApp = () => {
		navigation.navigate(APP_SCREEN.MESSAGES.STACK, {
			screen: APP_SCREEN.MESSAGES.CHANNEL_APP,
			params: { channelId: channelId }
		});
	};

	const openBottomSheet = useCallback(() => {
		Keyboard.dismiss();
		handleLauchApp();
		// timeoutRef.current = setTimeout(() => {
		// 	const data = {
		// 		snapPoint: ['100%'],
		// 		children: <ChannelAppScreen channelId={channelId} />
		// 	};
		// 	DeviceEventEmitter.emit(ActionEmitEvent.ON_TRIGGER_BOTTOM_SHEET, { isDismiss: false, data });
		// }, 200);
	}, [channelId]);

	return (
		<View
			style={{
				height: size.s_50,
				flexDirection: 'row',
				justifyContent: 'space-between',
				paddingVertical: size.s_6,
				paddingHorizontal: size.s_10,
				gap: size.s_10,
				backgroundColor: themeValue.primary
			}}
		>
			<TouchableOpacity style={styles.channelAppButton} onPress={openBottomSheet}>
				<Text style={styles.messageText}>Lannch App</Text>
			</TouchableOpacity>
			<TouchableOpacity style={styles.channelAppButton}>
				<Text style={styles.messageText}>Help</Text>
			</TouchableOpacity>
		</View>
	);
};

export default ChannelAppHotbar;
