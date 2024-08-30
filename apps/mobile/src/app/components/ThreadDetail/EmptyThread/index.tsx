import { useUserPermission } from '@mezon/core';
import { Icons } from '@mezon/mobile-components';
import { useTheme } from '@mezon/mobile-ui';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { style } from './EmptyThread.style';

const EmptyThread = ({ onPress }: { onPress: () => void }) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const { t } = useTranslation(['createThread']);
	const { isCanManageThread } = useUserPermission();
	return (
		<View style={styles.emptyThreadContainer}>
			<View style={styles.emptyThreadContent}>
				<View style={styles.iconContainer}>
					<Icons.ThreadPlusIcon width={22} height={22} color={themeValue.textStrong} />
				</View>
				<Text style={styles.textNoThread}>{t('emptyThread.textNoThread')}</Text>
				<Text style={styles.textNotify}>{t('emptyThread.textNotify')}</Text>
				{isCanManageThread ? (
					<TouchableOpacity onPress={onPress} style={[styles.button]}>
						<Text style={[styles.buttonText]}>{t('emptyThread.createThreads')}</Text>
					</TouchableOpacity>
				) : (
					<View />
				)}
			</View>
		</View>
	);
};

export default EmptyThread;
