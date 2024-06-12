import { ScrollView, Text, View } from "react-native";
import { APP_SCREEN, MenuClanScreenProps } from "../../../navigation/ScreenTypes";
import styles from "./styles";
import { useClans } from "@mezon/core";
import MezonImagePicker from "../../../temp-ui/MezonImagePicker";
import MezonInput from "../../../temp-ui/MezonInput";
import MezonMenu, { reserve } from "../../../temp-ui/MezonMenu";
import { IMezonMenuSectionProps } from "../../../temp-ui/MezonMenuSection";
import { useTranslation } from "react-i18next";
import { IMezonMenuItemProps } from "../../../temp-ui/MezonMenuItem";
import MezonToggleButton from "../../../temp-ui/MezonToggleButton";

type ClanSettingsScreen = typeof APP_SCREEN.MENU_CLAN.OVERVIEW_SETTING;
export default function ClanOverviewSetting({ navigation }: MenuClanScreenProps<ClanSettingsScreen>) {
    const { currentClan, updateClan } = useClans();
    const { t } = useTranslation(['clanOverviewSetting']);

    const inactiveMenu: IMezonMenuItemProps[] = [
        {
            title: t("menu.inactive.inactiveChannel"),
            expandable: true,
            component: <Text style={{ color: "white", fontSize: 11 }}>No Active channel</Text>,
            onPress: () => reserve()
        },
        {
            title: t("menu.inactive.inactiveTimeout"),
            expandable: true,
            component: <Text style={{ color: "white", fontSize: 11 }}>5 mins</Text>,
            disabled: true
        },
    ]

    const systemMessageMenu: IMezonMenuItemProps[] = [
        {
            title: t("menu.systemMessage.channel"),
            expandable: true,
            component: <Text style={{ color: "white", fontSize: 11 }}>general</Text>,
            onPress: () => reserve()
        },
        {
            title: t("menu.systemMessage.sendRandomWelcome"),
            component: <MezonToggleButton height={24} width={40} onChange={() => { }} />,
            onPress: () => reserve()
        },
        {
            title: t("menu.systemMessage.promptMembersReply"),
            component: <MezonToggleButton height={24} width={40} onChange={() => { }} />,
            onPress: () => reserve()
        },
        {
            title: t("menu.systemMessage.sendMessageBoost"),
            component: <MezonToggleButton height={24} width={40} onChange={() => { }} />,
            onPress: () => reserve()
        },
        {
            title: t("menu.systemMessage.sendHelpfulTips"),
            component: <MezonToggleButton height={24} width={40} onChange={() => { }} />,
            onPress: () => reserve()
        },
    ]

    const deleteMenu: IMezonMenuItemProps[] = [
        {
            title: t("menu.deleteServer.delete"),
            textStyle: { color: "red" },
            onPress: () => reserve()
        },
    ]

    const menu: IMezonMenuSectionProps[] = [
        {
            items: inactiveMenu,
            title: t("menu.inactive.title"),
            bottomDescription: t("menu.inactive.description")
        },
        {
            items: systemMessageMenu,
            title: t("menu.systemMessage.title"),
            bottomDescription: t("menu.systemMessage.description")
        },
        {
            items: deleteMenu
        }
    ]

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <MezonImagePicker defaultValue={currentClan.banner} height={200} width={"100%"} />
            <View style={{ marginVertical: 10 }}>
                <MezonInput value={currentClan.clan_name} label={t("menu.serverName.title")} />
            </View>

            <MezonMenu menu={menu} />
        </ScrollView>
    )
}