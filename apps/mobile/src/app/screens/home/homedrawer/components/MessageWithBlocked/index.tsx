import { useTheme } from '@mezon/mobile-ui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { style } from './styles';

const MessageWithBlocked = () => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const { t } = useTranslation(['dmMessage']);

	return (
		<View style={styles.container}>
			<Text style={styles.text}>{t('blockedUserMessage')}</Text>
		</View>
	);
};

export default MessageWithBlocked;
