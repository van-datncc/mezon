import { CrossIcon } from "@mezon/mobile-components";
import { Pressable, View } from "react-native";
import { APP_SCREEN, MenuClanScreenProps } from "../../navigation/ScreenTypes";

type ClanSettingsScreen = typeof APP_SCREEN.MENU_CLAN.SETTINGS;

export default function ClanSetting({ navigation }: MenuClanScreenProps<ClanSettingsScreen>) {
    navigation.setOptions({
        headerLeft: () => (
            <Pressable style={{ padding: 20 }} onPress={handleClose}>
                <CrossIcon height={16} width={16} />
            </Pressable>
        ),
    });

    function handleClose() {
        navigation.goBack();
    }

    return (
        <View>

        </View>
    )
}