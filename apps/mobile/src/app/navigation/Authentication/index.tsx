import React, { useEffect } from 'react';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { fcmActions } from '@mezon/store';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';
import { handleFCMToken, setupNotificationListeners } from '../../utils/pushNotificationHelpers';
import { APP_SCREEN } from '../ScreenTypes';
import BottomNavigator from './BottomNavigator';
import { MenuThreadDetailStacks } from './stacks/MenuThreadDetailStacks';
import { MessagesStacks } from './stacks/MessagesStacks';
import { NotificationStacks } from './stacks/NotificationStacks';
import { ServersStacks } from './stacks/ServersStacks';
import { MenuClanStacks } from './stacks/MenuSererStack';
const RootStack = createNativeStackNavigator();

export const Authentication = () => {
	const getInitialRouteName = APP_SCREEN.BOTTOM_BAR;
	const navigation = useNavigation();
	const dispatch = useDispatch();
	useEffect(() => {
		loadFRMConfig();
	}, []);

	const loadFRMConfig = async () => {
		const fcmtoken = await handleFCMToken();
		if (fcmtoken) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			dispatch(fcmActions.registFcmDeviceToken(fcmtoken));
		}
		setupNotificationListeners(navigation, dispatch);
	};

	return (
		<BottomSheetModalProvider>
			<RootStack.Navigator initialRouteName={getInitialRouteName} screenOptions={{ headerShown: false, gestureEnabled: true }}>
				<RootStack.Screen name={APP_SCREEN.BOTTOM_BAR} component={BottomNavigator} options={{ gestureEnabled: false }} />
				<RootStack.Screen
					name={APP_SCREEN.SERVERS.STACK}
					children={(props) => <ServersStacks {...props} />}
					options={{
						gestureEnabled: true,
						gestureDirection: 'horizontal',
					}}
				/>
				<RootStack.Screen
					name={APP_SCREEN.MESSAGES.STACK}
					children={(props) => <MessagesStacks {...props} />}
					options={{
						gestureEnabled: true,
						gestureDirection: 'horizontal',
					}}
				/>
				<RootStack.Screen
					name={APP_SCREEN.NOTIFICATION.STACK}
					children={(props) => <NotificationStacks {...props} />}
					options={{
						gestureEnabled: true,
						gestureDirection: 'horizontal',
					}}
				/>
				<RootStack.Screen
					name={APP_SCREEN.MENU_THREAD.STACK}
					children={props =>
					(
						<MenuThreadDetailStacks {...props} />
					)}
					options={{
						gestureEnabled: true,
						gestureDirection: 'horizontal',
					}}
				/>

				<RootStack.Screen
					name={APP_SCREEN.MENU_CLAN.STACK}
					children={props => (
						<MenuClanStacks {...props} />
					)}
					options={{
						gestureEnabled: true,
						gestureDirection: 'horizontal',
					}}
				/>
			</RootStack.Navigator>
		</BottomSheetModalProvider>
	);
};
