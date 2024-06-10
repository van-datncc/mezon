import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import FastImage from "react-native-fast-image";
import styles from "./styles";
import MezonBadge from "apps/mobile/src/app/temp-ui/MezonBadge";
import { AddFillIcon, BellIcon, CircleIcon, KeyframeIcon, NittroIcon } from "@mezon/mobile-components";
import MezonButtonIcon from "apps/mobile/src/app/temp-ui/MezonButtonIcon";
import MezonMenu from "apps/mobile/src/app/temp-ui/MezonMenu";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";
import { IMezonMenuSectionProps } from "apps/mobile/src/app/temp-ui/MezonMenuSection";
import { IMezonMenuItemProps } from "apps/mobile/src/app/temp-ui/MezonMenuItem";

export default function ServerMenu() {
    const { t } = useTranslation(['clanMenu']);

    const reserve = () => {
        Toast.show({
            type: 'info',
            text1: 'Coming soon'
        });

    }

    const Menu1: IMezonMenuItemProps[] = [
        {
            onPress: () => reserve(),
            title: t('menu.menu1.markAsRead'),
            icon: <NittroIcon width={20} height={20} />,
        },
        {
            onPress: () => reserve(),
            title: t('menu.menu1.browseChannels'),
            icon: <NittroIcon width={20} height={20} />,
        },
    ]

    const Menu2: IMezonMenuItemProps[] = [
        {
            onPress: () => reserve(),
            title: t('menu.menu2.createChannel'),
            icon: <NittroIcon width={20} height={20} />,
        },
        {
            onPress: () => reserve(),
            title: t('menu.menu2.createCategory'),
            icon: <NittroIcon width={20} height={20} />,
        },
        {
            onPress: () => reserve(),
            title: t('menu.menu2.createEvent'),
            icon: <NittroIcon width={20} height={20} />,
        },
    ]

    const Menu3: IMezonMenuItemProps[] = [
        {
            onPress: () => reserve(),
            title: t('menu.menu3.editServerProfile'),
            icon: <NittroIcon width={20} height={20} />,
        },
        {
            onPress: () => reserve(),
            title: t('menu.menu3.editServerProfile'),
            icon: <NittroIcon width={20} height={20} />,
        },
        {
            onPress: () => reserve(),
            title: t('menu.menu3.showAllChannels'),
            icon: <NittroIcon width={20} height={20} />,
        },
        {
            onPress: () => reserve(),
            title: t('menu.menu3.hideMutedChannels'),
            icon: <NittroIcon width={20} height={20} />,
        },
        {
            onPress: () => reserve(),
            title: t('menu.menu3.allowDirectMessage'),
            icon: <NittroIcon width={20} height={20} />,
        },
        {
            onPress: () => reserve(),
            title: t('menu.menu3.allowMessageRequest'),
            icon: <NittroIcon width={20} height={20} />,
        },
        {
            onPress: () => reserve(),
            title: t('menu.menu3.reportServer'),
            icon: <NittroIcon width={20} height={20} />,
        },
        {
            onPress: () => reserve(),
            title: t('menu.menu3.leaveServer'),
            icon: <NittroIcon width={20} height={20} />,
        },
    ]

    const Menu4: IMezonMenuItemProps[] = [
        {
            onPress: () => reserve(),
            title: t('menu.menu1.copyServerID'),
            icon: <NittroIcon width={20} height={20} />,
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
                        source={{ uri: "https://avatars.githubusercontent.com/u/14251235?s=280&v=4" }}
                        style={{ width: "100%", height: "100%" }}
                    />
                </View>
                <Text style={styles.serverName}>KOMU</Text>
                <View style={styles.info}>
                    <MezonBadge title="Community Server" />
                    <View style={styles.inlineInfo}>
                        <CircleIcon height={10} width={10} color="green" />
                        <Text style={styles.inlineText}>333 Online</Text>
                    </View>

                    <View style={styles.inlineInfo}>
                        <CircleIcon height={10} width={10} color="gray" />
                        <Text style={styles.inlineText}>398 Members</Text>
                    </View>
                </View>

                <ScrollView
                    contentContainerStyle={styles.actionWrapper}
                    horizontal>
                    <MezonButtonIcon title="18 Boots" icon={KeyframeIcon} iconStyle={{ color: "red" }} />
                    <MezonButtonIcon title="Invite" icon={AddFillIcon} />
                    <MezonButtonIcon title="Notifications" icon={BellIcon} />
                </ScrollView>

                <MezonMenu menu={menu} />
            </View>
        </View>
    )
}