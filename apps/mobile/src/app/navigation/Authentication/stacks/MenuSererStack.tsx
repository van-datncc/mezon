import { createStackNavigator } from "@react-navigation/stack";
import { APP_SCREEN } from "../../ScreenTypes";
import { Colors } from "@mezon/mobile-ui";
import { useTranslation } from "react-i18next";
import CategoryCreator from "../../../components/Category";
import ClanSetting from "../../../components/ClanSettings";

export const MenuClanStacks = ({ }: any) => {
    const Stack = createStackNavigator();
    const { t } = useTranslation(['screenStack']);

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: true,
                headerShadowVisible: false,
                gestureEnabled: true,
                gestureDirection: 'horizontal',
                headerTitleAlign: "center",
                headerTintColor: Colors.white,
                headerStyle: {
                    backgroundColor: Colors.primary
                },
                headerTitleStyle: {
                    fontSize: 14,
                    fontWeight: 'normal'
                },
            }}>

            <Stack.Screen
                name={APP_SCREEN.MENU_CLAN.CREATE_CATEGORY}
                component={CategoryCreator}
                options={{
                    headerTitle: t('menuClanStack.categoryCreator'),
                }}
            />

            <Stack.Screen
                name={APP_SCREEN.MENU_CLAN.SETTINGS}
                component={ClanSetting}
                options={{
                    headerTitle: t('menuClanStack.clanSetting'),
                }}
            />
        </Stack.Navigator>
    );
}
