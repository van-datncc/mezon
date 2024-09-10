import { Block, Text, useTheme } from '@mezon/mobile-ui';
import { permissionRoleChannelActions, selectAllPermissionRoleChannel, selectPermissionChannel, useAppDispatch } from '@mezon/store-mobile';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { APP_SCREEN, MenuChannelScreenProps } from '../../../navigation/ScreenTypes';

type AdvancedPermissionOverrides = typeof APP_SCREEN.MENU_CHANNEL.ADVANCED_PERMISSION_OVERRIDES;
export const AdvancedPermissionOverrides = ({ navigation, route }: MenuChannelScreenProps<AdvancedPermissionOverrides>) => {
	const { channelId, roleId } = route.params;
	const { themeValue } = useTheme();
	const channelPermissionList = useSelector(selectPermissionChannel);
	const changedChannelPermissionList = useSelector(selectAllPermissionRoleChannel);
	const dispatch = useAppDispatch();
	console.log('listPermission', channelPermissionList, changedChannelPermissionList);

	useEffect(() => {
		if (channelId && roleId) {
			dispatch(permissionRoleChannelActions.fetchPermissionRoleChannel({ channelId, roleId }));
		}
	}, [channelId, dispatch, roleId]);

	return (
		<Block flex={1} backgroundColor={themeValue.secondary}>
			<Text>
				{channelId}, {roleId}
			</Text>
		</Block>
	);
};
