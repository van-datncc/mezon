import { EmptyPinIcon } from '@mezon/mobile-components';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { styles } from './EmptyPinMessage.style';

const EmptyPinMessage = () => {
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
