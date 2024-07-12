import { createStackNavigator } from "@react-navigation/stack";
import { APP_SCREEN } from "../../ScreenTypes";
import { Fonts, useTheme } from "@mezon/mobile-ui";
import { useTranslation } from "react-i18next";
import CategoryCreator from "../../../components/Category";
import ClanSetting from "../../../components/ClanSettings";
import ClanOverviewSetting from "../../../components/ClanSettings/Overview";
import ChannelCreator from "../../../components/ChannelCreator";
import EventCreatorType from "../../../components/EventCreator/EventCreatorType";
import EventCreatorDetails from "../../../components/EventCreator/EventCreatorDetails";
import EventCreatorPreview from "../../../components/EventCreator/EventCreatorPreview";
import { ServerRoles } from "../../../screens/serverRoles/ServerRoles";
import { CreateNewRole } from "../../../screens/serverRoles/CreateNewRole";
import { SetupPermissions } from "../../../screens/serverRoles/SetupPermissions";
import { SetupMembers } from "../../../screens/serverRoles/SetupMembers";
import { RoleDetail } from "../../../screens/serverRoles/RoleDetail";

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

            <Stack.Screen
                name={APP_SCREEN.MENU_CLAN.ROLE_SETTING}
                component={ServerRoles}
                options={{
                    headerTitle: t('menuClanStack.serverRoles'),
                }}
            />

            <Stack.Screen
                name={APP_SCREEN.MENU_CLAN.CREATE_NEW_ROLE}
                component={CreateNewRole}
            />

            <Stack.Screen
                name={APP_SCREEN.MENU_CLAN.SETUP_PERMISSIONS}
                component={SetupPermissions}
            />

            <Stack.Screen
                name={APP_SCREEN.MENU_CLAN.SETUP_ROLE_MEMBERS}
                component={SetupMembers}
            />

            <Stack.Screen
                name={APP_SCREEN.MENU_CLAN.ROLE_DETAIL}
                component={RoleDetail}
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
}
