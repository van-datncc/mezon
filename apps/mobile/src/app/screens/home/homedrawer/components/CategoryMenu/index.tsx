import { ICategoryChannel, IChannel } from "@mezon/utils";
import React, { MutableRefObject } from "react";
import { Text, View } from "react-native";
import FastImage from "react-native-fast-image";
import styles from "./styles";
import { useClans } from "@mezon/core";
import { reserve, IMezonMenuSectionProps, MezonMenu, IMezonMenuItemProps } from "../../../../../../app/temp-ui";
import { useTranslation } from "react-i18next";
import Clipboard from "@react-native-clipboard/clipboard";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { APP_SCREEN, AppStackScreenProps } from "../../../../../../app/navigation/ScreenTypes";
import { useBottomSheetModal } from "@gorhom/bottom-sheet";
import { BellSlashIcon, ChannelNotificationIcon, EyeIcon, GroupPlusIcon, IDIcon, PlusLargeIcon, SettingsIcon }
    // @ts-ignore
    from "libs/mobile-components/src/lib/icons2";


interface ICategoryMenuProps {
    inviteRef: MutableRefObject<any>;
    category: ICategoryChannel;
}

type StackMenuClanScreen = typeof APP_SCREEN.MENU_CLAN.STACK;
export default function CategoryMenu({ category, inviteRef }: ICategoryMenuProps) {
    const { currentClan } = useClans();
    const { dismiss } = useBottomSheetModal();

    const { t } = useTranslation(['categoryMenu']);
    const navigation = useNavigation<AppStackScreenProps<StackMenuClanScreen>['navigation']>()

    const watchMenu: IMezonMenuItemProps[] = [
        {
            title: t('menu.watchMenu.markAsRead'),
            onPress: () => reserve(),
            icon: <EyeIcon />
        }
    ]

    const inviteMenu: IMezonMenuItemProps[] = [
        {
            title: t('menu.inviteMenu.invite'),
            onPress: () => {
                inviteRef.current.open()
                dismiss();
            },
            icon: <GroupPlusIcon />
        }
    ]

    const notificationMenu: IMezonMenuItemProps[] = [
        {
            title: t('menu.notification.muteCategory'),
            onPress: () => reserve(),
            icon: <BellSlashIcon />
        },
        {
            title: t('menu.notification.notification'),
            onPress: () => reserve(),
            icon: <ChannelNotificationIcon />
        }
    ]

    const organizationMenu: IMezonMenuItemProps[] = [
        {
            title: t('menu.organizationMenu.edit'),
            onPress: () => reserve(),
            icon: <SettingsIcon />
        },
        {
            title: t('menu.organizationMenu.createChannel'),
            onPress: () => {
                dismiss();
                navigation.navigate(APP_SCREEN.MENU_CLAN.STACK, {
                    screen: APP_SCREEN.MENU_CLAN.CREATE_CHANNEL,
                    params: {
                        categoryId: category?.category_id
                    }
                });
            },
            icon: <PlusLargeIcon />
        }
    ];

    const devMenu: IMezonMenuItemProps[] = [
        {
            title: t('menu.devMode.copyServerID'),
            icon: <IDIcon />,
            onPress: () => {
                Clipboard.setString(category?.category_id);
                Toast.show({
                    type: 'info',
                    text1: t('notify.serverIDCopied'),
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

            <View>
                <MezonMenu menu={menu} />
            </View>
        </View>
    )
}
