import { useAuth } from '@mezon/core';
import { Icons } from '@mezon/mobile-components';
import { size, useTheme } from '@mezon/mobile-ui';
import { selectAllRolesClan, selectCurrentClan, selectMemberByUserId } from '@mezon/store-mobile';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { APP_SCREEN } from '../../../navigation/ScreenTypes';
import { getUserPermissionsStatus } from '../../../utils/helpers';
export default function ThreadAddButton() {
	const navigation = useNavigation<any>();
	const { themeValue } = useTheme();
	const { userId, userProfile } = useAuth();
	const userById = useSelector(selectMemberByUserId(userId || ''));
	const RolesClan = useSelector(selectAllRolesClan);
	const currentClan = useSelector(selectCurrentClan);
	const userPermissionsStatus = getUserPermissionsStatus(userById?.role_id, RolesClan);
	if (!(userPermissionsStatus['manage-thread'] || currentClan?.creator_id === userProfile?.user?.id)) {
		return <View />;
	}
	return (
		<TouchableOpacity
			onPress={() => navigation.navigate(APP_SCREEN.MENU_THREAD.STACK, { screen: APP_SCREEN.MENU_THREAD.CREATE_THREAD_FORM_MODAL })}
			style={{ padding: size.s_10 }}
		>
			<Icons.PlusLargeIcon width={22} height={22} color={themeValue.text} />
		</TouchableOpacity>
	);
}
