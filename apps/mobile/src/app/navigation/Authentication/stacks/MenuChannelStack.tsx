import { Colors, Fonts } from '@mezon/mobile-ui';
import { createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import ChannelSetting from '../../../components/ChannelSetting';
import { APP_SCREEN } from '../../ScreenTypes';

type StackMenuChannelScreen = typeof APP_SCREEN.MENU_CHANNEL.STACK;
export function MenuChannelStacks({}: any) {
	const Stack = createStackNavigator();
	const { t } = useTranslation(['screenStack']);

	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: true,
				headerShadowVisible: false,
				gestureEnabled: true,
				gestureDirection: 'horizontal',
				headerTitleAlign: 'center',
				headerTintColor: Colors.white,
				headerStyle: {
					backgroundColor: Colors.primary,
				},
				headerTitleStyle: {
					fontSize: Fonts.size.h6,
					fontWeight: 'bold',
				},
			}}
		>
			<Stack.Screen
				name={APP_SCREEN.MENU_CHANNEL.SETTINGS}
				component={ChannelSetting}
				options={{
					headerTitle: t('menuChannelStack.channelSetting'),
				}}
			/>
		</Stack.Navigator>
	);
}
