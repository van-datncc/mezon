import { Pressable, ScrollView, Text, View } from "react-native";
import { APP_SCREEN, MenuClanScreenProps } from "../../../navigation/ScreenTypes";
import styles from "./styles";
import { useClans } from "@mezon/core";
import { MezonMenu, reserve, IMezonMenuSectionProps, IMezonMenuItemProps, MezonInput, MezonImagePicker, MezonOption } from "../../../temp-ui";
import { useTranslation } from "react-i18next";
import MezonToggleButton from "../../../temp-ui/MezonToggleButton";
import { useState } from "react";
import Toast from "react-native-toast-message";
import { baseColor } from "@mezon/mobile-ui";

type ClanSettingsScreen = typeof APP_SCREEN.MENU_CLAN.OVERVIEW_SETTING;
export default function ClanOverviewSetting({ navigation }: MenuClanScreenProps<ClanSettingsScreen>) {
    const { currentClan, updateClan } = useClans();
    const { t } = useTranslation(['clanOverviewSetting']);

    const [clanName, setClanName] = useState<string>(currentClan?.clan_name ?? '');
    const [banner, setBanner] = useState<string>(currentClan?.banner ?? '');
    const [loading, setLoading] = useState<boolean>(false);

    navigation.setOptions({
        headerBackTitleVisible: false,
        headerRight: () => <Pressable onPress={handleSave} disabled={loading}>
            <Text style={{ ...styles.headerActionTitle, opacity: loading ? 0.5 : 1 }}>
                {t("header.save")}
            </Text>
        </Pressable>
    })

    async function handleSave() {
        setLoading(true);
        const name = clanName.trim();
        setClanName(name);

        if (name?.length === 0) {
            Toast.show({
                type: "error",
                text1: t("toast.notBlank")
            });
            setLoading(false);
            return;
        }

        await updateClan({
            banner: banner || (currentClan?.banner ?? ''),
            clan_name: name || (currentClan?.clan_name ?? ''),
            clan_id: currentClan?.clan_id ?? '',
            creator_id: currentClan?.creator_id ?? '',
            logo: currentClan?.logo ?? '',
        });

        setLoading(false);
        Toast.show({
            type: "info",
            text1: t("toast.saveSuccess")
        });

        navigation.goBack();
    }

    function handleLoad(url: string) {
        setBanner(url);
    }

    const inactiveMenu: IMezonMenuItemProps[] = [
        {
            title: t("menu.inactive.inactiveChannel"),
            expandable: true,
            previewValue: "No Active channel",
            onPress: () => reserve()
        },
        {
            title: t("menu.inactive.inactiveTimeout"),
            expandable: true,
            previewValue: "5 mins",
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

    const generalMenu: IMezonMenuSectionProps[] = [
        {
            items: inactiveMenu,
            title: t("menu.inactive.title"),
            bottomDescription: t("menu.inactive.description")
        },
        {
            items: systemMessageMenu,
            title: t("menu.systemMessage.title"),
            bottomDescription: t("menu.systemMessage.description")
        }
    ]

    const dangerMenu: IMezonMenuSectionProps[] = [
        {
            items: deleteMenu
        }
    ]

    const optionData = [
        {
            title: t("fields.defaultNotification.allMessages"),
            value: 0,
        },
        {
            title: t("fields.defaultNotification.onlyMentions"),
            value: 1,
        }
    ]

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <MezonImagePicker defaultValue={banner} height={200} width={"100%"} onLoad={handleLoad} showHelpText autoUpload />

            <View style={{ marginVertical: 10 }}>
                <MezonInput
                    value={clanName}
                    onTextChange={setClanName}
                    label={t("menu.serverName.title")} />
            </View>

            <MezonMenu menu={generalMenu} />

            <MezonOption
                title={t('fields.defaultNotification.title')}
                bottomDescription={t('fields.defaultNotification.description')}
                data={optionData} />

            <MezonMenu menu={dangerMenu} />
        </ScrollView>
    )
}
