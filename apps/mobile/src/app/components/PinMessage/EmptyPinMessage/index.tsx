import { EmptyPinIcon } from '@mezon/mobile-components';
import { useTheme } from '@mezon/mobile-ui';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { style } from './EmptyPinMessage.style';

const EmptyPinMessage = () => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const { t } = useTranslation(['pinMessage']);
	return (
		<View style={styles.emptyPinMessageBox}>
			<EmptyPinIcon width={120} height={120} />
			<Text style={styles.emptyPinMessageTitle}>{t('emptyTitle')}</Text>
			<View>
				<Text style={styles.emptyPinMessageHeaderText}> {t('PROTIP')}</Text>
				<Text style={styles.emptyPinMessageDescription}>{t('emptyDescription')}</Text>
			</View>
		</View>
	);
};

export default EmptyPinMessage;
