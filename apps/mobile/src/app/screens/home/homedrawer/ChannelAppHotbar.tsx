import { size, useTheme } from '@mezon/mobile-ui';
import { useCallback, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import ChannelAppScreen from './ChannelApp';
import { style } from './styles';

type channelAppHotBarProps = {
	channelId: string;
};

const ChannelAppHotbar = ({ channelId }: channelAppHotBarProps) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const [isShowChannelApp, setIsShowChannelApp] = useState<boolean>(false);
	const openChannelApp = useCallback(() => {
		setIsShowChannelApp(true);
	}, []);
	const closeChannelApp = useCallback(() => {
		setIsShowChannelApp(false);
	}, []);

	if (isShowChannelApp) {
		return <ChannelAppScreen channelId={channelId} closeChannelApp={closeChannelApp} />;
	}

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
