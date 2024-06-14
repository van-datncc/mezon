import { useReference, useThreads } from '@mezon/core';
import { ThreadIcon } from '@mezon/mobile-components';
import { useNavigation } from '@react-navigation/native';
import { Text, TouchableOpacity, View } from 'react-native';
import { APP_SCREEN } from '../../../navigation/ScreenTypes';
import { styles } from './EmptyThread.style';
import { useTranslation } from 'react-i18next';

const EmptyThread = () => {
	const { setValueThread } = useThreads();
	const { setOpenThreadMessageState } = useReference();
	const navigation = useNavigation<any>();
  const { t } = useTranslation(["createThread"]);

	const handleNavigateCreateForm = () => {
		setOpenThreadMessageState(false);
		setValueThread(null);
		navigation.navigate(APP_SCREEN.MENU_THREAD.STACK, { screen: APP_SCREEN.MENU_THREAD.CREATE_THREAD_FORM_MODAL });
	};
	return (
		<View style={styles.emptyThreadContainer}>
			<View style={styles.emptyThreadContent}>
				<View style={styles.iconContainer}>
					<ThreadIcon width={22} height={22} />
				</View>
				<Text style={styles.textNoThread}>{t("emptyThread.textNoThread")}</Text>
				<Text style={styles.textNotify}>{t("emptyThread.textNotify")}</Text>
				<TouchableOpacity onPress={handleNavigateCreateForm} style={[styles.button]}>
					<Text style={[styles.buttonText]}>{t("emptyThread.createThreads")}</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default EmptyThread;
