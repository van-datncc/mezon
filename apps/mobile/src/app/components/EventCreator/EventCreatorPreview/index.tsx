import { View } from "react-native";
import { APP_SCREEN, MenuClanScreenProps } from "../../../navigation/ScreenTypes";
import { useTranslation } from "react-i18next";

type CreateEventScreenType = typeof APP_SCREEN.MENU_CLAN.CREATE_EVENT;
export default function EventCreatorPreview({ navigation }: MenuClanScreenProps<CreateEventScreenType>) {
    const { t } = useTranslation(['eventCreator']);

    navigation.setOptions({
        headerTitle: t('screens.eventPreview.headerTitle')
    })

    return (
        <View>

        </View>
    )
}