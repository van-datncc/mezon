import { Block, Text } from '@mezon/mobile-ui';
import { APP_SCREEN, MenuChannelScreenProps } from '../../../navigation/ScreenTypes';

type AdvancedPermissionOverrides = typeof APP_SCREEN.MENU_CHANNEL.ADVANCED_PERMISSION_OVERRIDES;
export const AdvancedPermissionOverrides = ({ navigation, route }: MenuChannelScreenProps<AdvancedPermissionOverrides>) => {
	const { channelId, roleId } = route.params;

	return (
		<Block>
			<Text>
				{channelId}, {roleId}
			</Text>
		</Block>
	);
};
