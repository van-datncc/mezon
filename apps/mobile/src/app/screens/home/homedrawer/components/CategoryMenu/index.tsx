import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { ICategoryChannel } from "@mezon/utils";
import { MutableRefObject } from "react";
import { Text, View } from "react-native";
import FastImage from "react-native-fast-image";
import styles from "./styles";
import { useClans } from "@mezon/core";
import MezonMenu from "apps/mobile/src/app/temp-ui/MezonMenu";
import { IMezonMenuSectionProps } from "apps/mobile/src/app/temp-ui/MezonMenuSection";
import { IMezonMenuItemProps } from "apps/mobile/src/app/temp-ui/MezonMenuItem";
import { useTranslation } from "react-i18next";
import Clipboard from "@react-native-clipboard/clipboard";
import Toast from "react-native-toast-message";
import { NittroIcon } from "@mezon/mobile-components";

interface ICategoryMenuProps {
    bottomSheetRef: MutableRefObject<BottomSheetModalMethods>;
    category: ICategoryChannel;
}

export default function CategoryMenu({ category }: ICategoryMenuProps) {
    const { currentClan } = useClans();
    const { t } = useTranslation(['categoryMenu']);

    const watchMenu: IMezonMenuItemProps[] = [
        {
            title: t('menu.watchMenu.markAsRead'),
            onPress: () => { },
            icon: <NittroIcon/>
        }
    ]

    const inviteMenu: IMezonMenuItemProps[] = [
        {
            title: t('menu.inviteMenu.invite'),
            onPress: () => { },
            icon: <NittroIcon/>
        }
    ]

    const notificationMenu: IMezonMenuItemProps[] = [
        {
            title: t('menu.notification.muteCategory'),
            onPress: () => { },
            icon: <NittroIcon/>
        },
        {
            title: t('menu.notification.notification'),
            onPress: () => { },
            icon: <NittroIcon/>
        }
    ]

    const organizationMenu: IMezonMenuItemProps[] = [
        {
            title: t('menu.organizationMenu.edit'),
            onPress: () => { },
            icon: <NittroIcon/>
        },
        {
            title: t('menu.organizationMenu.createChannel'),
            onPress: () => { },
            icon: <NittroIcon/>
        }
    ];

    const devMenu: IMezonMenuItemProps[] = [
        {
            title: t('menu.devMode.copyServerID'),
            icon: <NittroIcon/>,
            onPress: () => {
                Clipboard.setString(category.category_id);
                Toast.show({
                    type: 'info',
                    text1: t('menu.notify.serverIDCopied'),
                });
            },
        }
    ];

    const menu: IMezonMenuSectionProps[] = [
        {
            items: watchMenu,
        },
        {
            items: inviteMenu,
        },
        {
            items: notificationMenu,
        },
        {
            items: organizationMenu,
        },
        {
            items: devMenu
        }
    ]

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatarWrapper}>
                    <FastImage
                        source={{ uri: currentClan?.logo }}
                        style={{ width: "100%", height: "100%" }}
                    />
                </View>
                <Text style={styles.serverName}>{category?.category_name}</Text>
            </View>

            <MezonMenu menu={menu} />
        </View>
    )
}