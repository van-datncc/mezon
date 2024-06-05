import React from 'react';
import {
	CardStyleInterpolators,
	createStackNavigator,
	TransitionSpecs,
} from '@react-navigation/stack';

import { APP_SCREEN } from "../../ScreenTypes";
import { DirectMessageDetailScreen } from '../../../screens/messages/DirectMessageDetail';
import { NewMessageScreen } from '../../../screens/messages/NewMessage';
import { NewGroupScreen } from '../../../screens/messages/NewGroup';
import { Colors } from '@mezon/mobile-ui';
import { useTranslation } from 'react-i18next';

// eslint-disable-next-line no-empty-pattern
export const MessagesStacks = ({ }: any) => {
	const Stack = createStackNavigator();
	const { t } = useTranslation('screen');
	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: true,
				headerShadowVisible: true,
				gestureEnabled: true,
				gestureDirection: 'horizontal',
				transitionSpec: {
					open: TransitionSpecs.TransitionIOSSpec,
					close: TransitionSpecs.TransitionIOSSpec,
				},
				cardStyle: { backgroundColor: 'white' },
				cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
		}}>
			<Stack.Screen
				name={APP_SCREEN.MESSAGES.MESSAGE_DETAIL}
				component={DirectMessageDetailScreen}
				options={{
					headerShown: false,
					headerShadowVisible: false,
				}}
			/>
			<Stack.Screen
				name={APP_SCREEN.MESSAGES.NEW_MESSAGE}
				component={NewMessageScreen}
				options={{
                    headerTitle: t('headerTitle.newMessage'),
                    headerTitleAlign: "center",
                    headerTintColor: Colors.white,
                    headerStyle: {
                        backgroundColor: Colors.secondary
                    }
                }}
			/>
			<Stack.Screen
				name={APP_SCREEN.MESSAGES.NEW_GROUP}
				component={NewGroupScreen}
				options={{
					headerShown: false,
					headerShadowVisible: false,
				}}
			/>
		</Stack.Navigator>
	);
};
