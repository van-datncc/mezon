import { ActionEmitEvent } from '@mezon/mobile-components';
import { size, useTheme } from '@mezon/mobile-ui';
import { sleep } from '@mezon/utils';
import { useCallback } from 'react';
import { DeviceEventEmitter, Text, TouchableOpacity, View } from 'react-native';
import ChannelAppScreen from './ChannelApp';
import { style } from './styles';

type channelAppHotBarProps = {
	channelId: string;
};

const ChannelAppHotbar = ({ channelId }: channelAppHotBarProps) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);

	const openChannelApp = useCallback(async () => {
		DeviceEventEmitter.emit(ActionEmitEvent.ON_TRIGGER_BOTTOM_SHEET, { isDismiss: true });
		await sleep(500);
		const data = {
			children: <ChannelAppScreen channelId={channelId} />
		};
		DeviceEventEmitter.emit(ActionEmitEvent.ON_TRIGGER_MODAL, { isDismiss: false, data });
	}, [channelId]);

	return (
		<View
			style={{
				flexDirection: 'row',
				justifyContent: 'space-between',
				paddingVertical: size.s_6,
				paddingHorizontal: size.s_10,
				gap: size.s_10,
				backgroundColor: themeValue.primary
			}}
		>
			<TouchableOpacity style={styles.channelAppButton} onPress={openChannelApp}>
				<Text style={styles.messageText}>Launch App</Text>
			</TouchableOpacity>
			<TouchableOpacity style={styles.channelAppButton}>
				<Text style={styles.messageText}>Help</Text>
			</TouchableOpacity>
		</View>
	);
};

export default ChannelAppHotbar;
