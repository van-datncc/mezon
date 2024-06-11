import { createStackNavigator } from "@react-navigation/stack";
import { APP_SCREEN } from "../../ScreenTypes";
import CategoryCreator from "../../../components/Category";
import { Colors } from "@mezon/mobile-ui";
import { useTranslation } from "react-i18next";

export const MenuClanStacks = ({ }: any) => {
    const Stack = createStackNavigator();
    const { t } = useTranslation(['screenStack']);

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: true,
                headerShadowVisible: false,
                gestureEnabled: true,
                gestureDirection: 'horizontal'
            }}>

            <Stack.Screen
                name={APP_SCREEN.MENU_CLAN.CREATE_CATEGORY}
                component={CategoryCreator}
                options={{
                    headerTitle: t('menuClanStack.categoryCreator'),
                    headerTitleAlign: "center",
                    headerTintColor: Colors.white,
                    headerStyle: {
                        backgroundColor: Colors.primary
                    }
                }}
            />
        </Stack.Navigator>
    );
}

