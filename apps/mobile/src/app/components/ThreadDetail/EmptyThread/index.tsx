import { useAuth, useReference, useThreads } from '@mezon/core';
import { Icons } from '@mezon/mobile-components';
import { useTheme } from '@mezon/mobile-ui';
import { selectAllRolesClan, selectCurrentClan, selectMemberByUserId } from '@mezon/store-mobile';
import { useNavigation } from '@react-navigation/native';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { APP_SCREEN } from '../../../navigation/ScreenTypes';
import { getUserPermissionsStatus } from '../../../utils/helpers';
import { style } from './EmptyThread.style';

const EmptyThread = () => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const { setValueThread } = useThreads();
	const { setOpenThreadMessageState } = useReference();
	const navigation = useNavigation<any>();
	const { t } = useTranslation(['createThread']);
	const { userId, userProfile } = useAuth();
	const userById = useSelector(selectMemberByUserId(userId || ''));
	const RolesClan = useSelector(selectAllRolesClan);
	const currentClan = useSelector(selectCurrentClan);

	const showCreateThreadButton = useMemo(() => {
		const userPermissionsStatus = getUserPermissionsStatus(userById?.role_id, RolesClan);
		return userPermissionsStatus['manage-thread'] || currentClan?.creator_id === userProfile?.user?.id;
	}, [userById?.role_id, RolesClan, currentClan?.creator_id, userProfile?.user?.id])

	const handleNavigateCreateForm = () => {
		setOpenThreadMessageState(false);
		setValueThread(null);
		navigation.navigate(APP_SCREEN.MENU_THREAD.STACK, { screen: APP_SCREEN.MENU_THREAD.CREATE_THREAD_FORM_MODAL });
	};
	return (
		<View style={styles.emptyThreadContainer}>
			<View style={styles.emptyThreadContent}>
				<View style={styles.iconContainer}>
					<Icons.ThreadPlusIcon width={22} height={22} color={themeValue.textStrong} />
				</View>
				<Text style={styles.textNoThread}>{t('emptyThread.textNoThread')}</Text>
				<Text style={styles.textNotify}>{t('emptyThread.textNotify')}</Text>
				{showCreateThreadButton ? (
					<TouchableOpacity onPress={handleNavigateCreateForm} style={[styles.button]}>
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
