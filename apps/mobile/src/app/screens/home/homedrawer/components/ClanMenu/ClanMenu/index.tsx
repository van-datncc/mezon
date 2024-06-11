import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import FastImage from "react-native-fast-image";
import styles from "./styles";
import { AddFillIcon, BellIcon, KeyframeIcon } from "@mezon/mobile-components";
import MezonButtonIcon from "apps/mobile/src/app/temp-ui/MezonButtonIcon";
import MezonMenu from "apps/mobile/src/app/temp-ui/MezonMenu";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";
import { IMezonMenuSectionProps } from "apps/mobile/src/app/temp-ui/MezonMenuSection";
import { IMezonMenuItemProps } from "apps/mobile/src/app/temp-ui/MezonMenuItem";
import { ClansEntity } from "@mezon/store-mobile";
import ClanMenuInfo from "../ClanMenuInfo";
import MezonToggleButton from "apps/mobile/src/app/temp-ui/MezonToggleButton";

interface IServerMenuProps {
    clan: ClansEntity;
}

export default function ClanMenu({ clan }: IServerMenuProps) {
    const { t } = useTranslation(['clanMenu']);

    const reserve = () => {
        Toast.show({
            type: 'info',
            text1: 'Coming soon'
        });

    }

    const ToggleBtn = () => <MezonToggleButton
        onChange={() => { }}
        height={25}
        width={45}
    />

    const Menu1: IMezonMenuItemProps[] = [
        {
            onPress: () => reserve(),
            title: t('menu.menu1.markAsRead'),
        },
        {
            onPress: () => reserve(),
            title: t('menu.menu1.browseChannels'),
        },
    ]

    const Menu2: IMezonMenuItemProps[] = [
        {
            onPress: () => reserve(),
            title: t('menu.menu2.createChannel'),
        },
        {
            onPress: () => reserve(),
            title: t('menu.menu2.createCategory'),
        },
        {
            onPress: () => reserve(),
            title: t('menu.menu2.createEvent'),
        },
    ]

    const Menu3: IMezonMenuItemProps[] = [
        {
            onPress: () => reserve(),
            title: t('menu.menu3.editServerProfile'),
        },
        {
            onPress: () => reserve(),
            title: t('menu.menu3.editServerProfile'),
        },
        {
            title: t('menu.menu3.showAllChannels'),
            component: <ToggleBtn />
        },
        {
            title: t('menu.menu3.hideMutedChannels'),
            component: <ToggleBtn />
        },
        {
            title: t('menu.menu3.allowDirectMessage'),
            component: <ToggleBtn />
        },
        {
            title: t('menu.menu3.allowMessageRequest'),
            component: <ToggleBtn />
        },
        {
            onPress: () => reserve(),
            title: t('menu.menu3.reportServer'),
        },
        {
            onPress: () => reserve(),
            title: t('menu.menu3.leaveServer'),
        },
    ]

    const Menu4: IMezonMenuItemProps[] = [
        {
            onPress: () => reserve(),
            title: t('menu.devMode.copyServerID'),
        }
    ]

    const menu: IMezonMenuSectionProps[] = [
        {
            items: Menu1,
        },
        {
            items: Menu2,
        },
        {
            items: Menu3,
        },
        {
            title: t('menu.devMode.title'),
            items: Menu4,
        },
    ]

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatarWrapper}>
                    <FastImage
                        source={{ uri: clan?.logo }}
                        style={{ width: "100%", height: "100%" }}
                    />
                </View>
                <Text style={styles.serverName}>{clan?.clan_name}</Text>
                <ClanMenuInfo clan={clan} />

                <ScrollView
                    contentContainerStyle={styles.actionWrapper}
                    horizontal>
                    <MezonButtonIcon title={`18 ${t("actions.boot")}`} icon={KeyframeIcon} iconStyle={{ color: "red" }} />
                    <MezonButtonIcon title={t("actions.invite")} icon={AddFillIcon} />
                    <MezonButtonIcon title={t("actions.notifications")} icon={BellIcon} />
                </ScrollView>

                <MezonMenu menu={menu} />
            </View>
        </View>
    )
}