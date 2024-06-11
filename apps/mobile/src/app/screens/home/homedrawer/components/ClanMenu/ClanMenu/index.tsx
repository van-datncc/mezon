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
import { APP_SCREEN } from "apps/mobile/src/app/navigation/ScreenTypes";
import { useNavigation } from "@react-navigation/native";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { MutableRefObject } from "react";

interface IServerMenuProps {
    clan: ClansEntity;
    bottomSheetRef: MutableRefObject<BottomSheetModalMethods>;
}

export default function ClanMenu({ clan, bottomSheetRef }: IServerMenuProps) {
    const { t } = useTranslation(['clanMenu']);
    const navigation = useNavigation();

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

    const watchMenu: IMezonMenuItemProps[] = [
        {
            onPress: () => reserve(),
            title: t('menu.watchMenu.markAsRead'),
        },
        {
            onPress: () => reserve(),
            title: t('menu.watchMenu.browseChannels'),
        },
    ]

    const organizationMenu: IMezonMenuItemProps[] = [
        {
            onPress: () => reserve(),
            title: t('menu.organizationMenu.createChannel'),
        },
        {
            onPress: () => {
                // @ts-ignore
                navigation.navigate(APP_SCREEN.MENU_CLAN.STACK, { screen: APP_SCREEN.MENU_CLAN.CREATE_CATEGORY });
                console.log(bottomSheetRef?.current?.dismiss());

            },
            title: t('menu.organizationMenu.createCategory'),
        },
        {
            onPress: () => reserve(),
            title: t('menu.organizationMenu.createEvent'),
        },
    ]

    const optionsMenu: IMezonMenuItemProps[] = [
        {
            onPress: () => reserve(),
            title: t('menu.optionsMenu.editServerProfile'),
        },
        {
            onPress: () => reserve(),
            title: t('menu.optionsMenu.editServerProfile'),
        },
        {
            title: t('menu.optionsMenu.showAllChannels'),
            component: <ToggleBtn />
        },
        {
            title: t('menu.optionsMenu.hideMutedChannels'),
            component: <ToggleBtn />
        },
        {
            title: t('menu.optionsMenu.allowDirectMessage'),
            component: <ToggleBtn />
        },
        {
            title: t('menu.optionsMenu.allowMessageRequest'),
            component: <ToggleBtn />
        },
        {
            onPress: () => reserve(),
            title: t('menu.optionsMenu.reportServer'),
        },
        {
            onPress: () => reserve(),
            title: t('menu.optionsMenu.leaveServer'),
        },
    ]

    const devMenu: IMezonMenuItemProps[] = [
        {
            onPress: () => reserve(),
            title: t('menu.devMode.copyServerID'),
        }
    ]

    const menu: IMezonMenuSectionProps[] = [
        {
            items: watchMenu,
        },
        {
            items: organizationMenu,
        },
        {
            items: optionsMenu,
        },
        {
            title: t('menu.devMode.title'),
            items: devMenu,
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