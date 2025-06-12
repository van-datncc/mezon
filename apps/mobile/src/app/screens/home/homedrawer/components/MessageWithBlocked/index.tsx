import { useTheme } from '@mezon/mobile-ui';
import React from 'react';
import { Text, View } from 'react-native';
import { style } from './styles';

const MessageWithBlocked = () => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);

	return (
		<View style={styles.container}>
			<Text style={styles.text}>Blocked message</Text>
		</View>
	);
};

export default MessageWithBlocked;
