import { Fonts, useTheme } from '@mezon/mobile-ui';
import { createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import CategoryCreator from '../../../components/Category';
import ChannelCreator from '../../../components/ChannelCreator';
import ClanSetting from '../../../components/ClanSettings';
import ClanOverviewSetting from '../../../components/ClanSettings/Overview';
import EventCreatorDetails from '../../../components/EventCreator/EventCreatorDetails';
import EventCreatorPreview from '../../../components/EventCreator/EventCreatorPreview';
import EventCreatorType from '../../../components/EventCreator/EventCreatorType';
import { APP_SCREEN } from '../../ScreenTypes';

export const MenuClanStacks = ({}: any) => {
	const { themeValue } = useTheme();
	const Stack = createStackNavigator();
	const { t } = useTranslation(['screenStack']);

	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: true,
				headerShadowVisible: false,
				headerBackTitleVisible: false,
				gestureEnabled: true,
				gestureDirection: 'horizontal',
				headerTitleAlign: 'center',
				headerTintColor: themeValue.white,
				headerStyle: {
					backgroundColor: themeValue.secondary,
				},
				headerTitleStyle: {
					fontSize: Fonts.size.h6,
					fontWeight: 'bold',
					color: themeValue.textStrong,
				},
			}}
		>
			<Stack.Screen
				name={APP_SCREEN.MENU_CLAN.CREATE_CATEGORY}
				component={CategoryCreator}
				options={{
					headerTitle: t('menuClanStack.categoryCreator'),
				}}
			/>

			<Stack.Screen
				name={APP_SCREEN.MENU_CLAN.CREATE_CHANNEL}
				component={ChannelCreator}
				options={{
					headerTitle: t('menuClanStack.channelCreator'),
				}}
			/>

			<Stack.Screen
				name={APP_SCREEN.MENU_CLAN.CREATE_EVENT}
				component={EventCreatorType}
				options={{
					headerTitle: t('menuClanStack.eventCreator'),
					headerLeftLabelVisible: false,
				}}
			/>

			<Stack.Screen
				name={APP_SCREEN.MENU_CLAN.CREATE_EVENT_DETAILS}
				component={EventCreatorDetails}
				options={{
					headerTitle: t('menuClanStack.eventCreator'),
					headerLeftLabelVisible: false,
				}}
			/>

			<Stack.Screen
				name={APP_SCREEN.MENU_CLAN.CREATE_EVENT_PREVIEW}
				component={EventCreatorPreview}
				options={{
					headerTitle: t('menuClanStack.eventCreator'),
					headerLeftLabelVisible: false,
				}}
			/>

			<Stack.Screen
				name={APP_SCREEN.MENU_CLAN.SETTINGS}
				component={ClanSetting}
				options={{
					headerTitle: t('menuClanStack.clanSetting'),
				}}
			/>

			<Stack.Screen
				name={APP_SCREEN.MENU_CLAN.OVERVIEW_SETTING}
				component={ClanOverviewSetting}
				options={{
					headerTitle: t('menuClanStack.clanOverviewSetting'),
				}}
			/>
		</Stack.Navigator>
	);
};
