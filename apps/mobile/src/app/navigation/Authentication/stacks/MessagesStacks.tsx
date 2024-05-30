import React from 'react';
import {
	CardStyleInterpolators,
	createStackNavigator,
	TransitionSpecs,
} from '@react-navigation/stack';

import { APP_SCREEN } from "../../ScreenTypes";
import { DirectMessageDetailScreen } from '../../../screens/messages/DirectMessageDetail';

// eslint-disable-next-line no-empty-pattern
export const MessagesStacks = ({ }: any) => {
	const Stack = createStackNavigator();

	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: false,
				headerShadowVisible: false,
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
			/>
		</Stack.Navigator>
	);
};
