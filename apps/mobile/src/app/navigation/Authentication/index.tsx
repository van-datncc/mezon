import React, { memo } from 'react';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import CallingModal from '../../components/CallingModal';
import HomeDefaultWrapper from '../../screens/home/homedrawer/HomeDefaultWrapper';
import StreamingPopup from '../../screens/home/homedrawer/components/StreamingPopup/StreamingPopup';
import { APP_SCREEN } from '../ScreenTypes';
import BottomNavigatorWrapper from './BottomNavigatorWrapper';
import { FriendStacks } from './stacks/FriendStacks';
import { MenuChannelStacks } from './stacks/MenuChannelStack';
import { MenuClanStacks } from './stacks/MenuSererStack';
import { MenuThreadDetailStacks } from './stacks/MenuThreadDetailStacks';
import { MessagesStacks } from './stacks/MessagesStacks';
import { NotificationStacks } from './stacks/NotificationStacks';
import { ServersStacks } from './stacks/ServersStacks';
import { SettingStacks } from './stacks/SettingStacks';
const RootStack = createNativeStackNavigator();

export const Authentication = memo(() => {
	const Stack = createStackNavigator();

	return (
		<BottomSheetModalProvider>
			<RootStack.Navigator
				initialRouteName={APP_SCREEN.BOTTOM_BAR}
				screenOptions={{
					headerShown: false,
					gestureEnabled: true,
					animation: 'ios_from_right'
				}}
			>
				<RootStack.Screen name={APP_SCREEN.BOTTOM_BAR} component={BottomNavigatorWrapper} />
				<Stack.Screen
					name={APP_SCREEN.HOME_DEFAULT}
					component={HomeDefaultWrapper}
					options={{
						cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
						headerShown: false,
						gestureDirection: 'horizontal'
					}}
				/>
				<RootStack.Screen name={APP_SCREEN.SERVERS.STACK} children={(props) => <ServersStacks {...props} />} />
				<RootStack.Screen name={APP_SCREEN.MESSAGES.STACK} children={(props) => <MessagesStacks {...props} />} />
				<RootStack.Screen name={APP_SCREEN.NOTIFICATION.STACK} children={(props) => <NotificationStacks {...props} />} />
				<RootStack.Screen name={APP_SCREEN.MENU_CHANNEL.STACK} children={(props) => <MenuChannelStacks {...props} />} />

				<RootStack.Screen name={APP_SCREEN.MENU_THREAD.STACK} children={(props) => <MenuThreadDetailStacks {...props} />} />

				<RootStack.Screen name={APP_SCREEN.MENU_CLAN.STACK} children={(props) => <MenuClanStacks {...props} />} />

				<RootStack.Screen name={APP_SCREEN.SETTINGS.STACK} children={(props) => <SettingStacks {...props} />} />

				<RootStack.Screen name={APP_SCREEN.FRIENDS.STACK} children={(props) => <FriendStacks {...props} />} />
			</RootStack.Navigator>
			<CallingModal />
			<StreamingPopup />
		</BottomSheetModalProvider>
	);
});
