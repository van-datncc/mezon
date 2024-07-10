import { useTheme } from "@mezon/mobile-ui";
import { APP_SCREEN, SettingScreenProps } from "apps/mobile/src/app/navigation/ScreenTypes";
import { View, Text } from "react-native";
import { style } from "./styles";
import { useTranslation } from "react-i18next";

type BlockedUsersScreen = typeof APP_SCREEN.SETTINGS.BLOCKED_USERS;
export const BlockedUsers = ({ navigation }: SettingScreenProps<BlockedUsersScreen>) => {
    const { themeValue } = useTheme();
    const styles = style(themeValue);
    const { t } = useTranslation('accountSetting');
    return (
        <View style={styles.container}>
            {/* TODO: update later */}
            <Text style={{textAlign: 'center'}}>{t('doNotHaveBlockedUser')}</Text>
        </View>
    )
}