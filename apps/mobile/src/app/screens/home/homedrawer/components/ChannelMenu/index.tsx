import { IChannel } from "@mezon/utils";
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
import { Icons } from "@mezon/mobile-components";

interface IChannelMenuProps {
    inviteRef: MutableRefObject<any>;
    channel: IChannel;
}

type StackMenuClanScreen = typeof APP_SCREEN.MENU_CHANNEL.STACK;
export default function ChannelMenu({ channel, inviteRef }: IChannelMenuProps) {
    const { currentClan } = useClans();
    const { dismiss } = useBottomSheetModal();

    const { t } = useTranslation(['channelMenu']);
    const navigation = useNavigation<AppStackScreenProps<StackMenuClanScreen>['navigation']>()

    const watchMenu: IMezonMenuItemProps[] = [
        {
            title: t('menu.watchMenu.markAsRead'),
            onPress: () => reserve(),
            icon: <Icons.EyeIcon />
        }
    ]

    const inviteMenu: IMezonMenuItemProps[] = [
        {
            title: t('menu.inviteMenu.invite'),
            onPress: () => {
                inviteRef.current.open()
                dismiss();
            },
            icon: <Icons.GroupPlusIcon />
        },
        {
            title: t('menu.inviteMenu.favorite'),
            onPress: () => {
                inviteRef.current.open()
                dismiss();
            },
            icon: <Icons.StarIcon />
        },
        {
            title: t('menu.inviteMenu.copyLink'),
            onPress: () => {
                inviteRef.current.open()
                dismiss();
            },
            icon: <Icons.LinkIcon />
        }
    ]

    const notificationMenu: IMezonMenuItemProps[] = [
        {
            title: t('menu.notification.muteCategory'),
            onPress: () => reserve(),
            icon: <Icons.BellSlashIcon />
        },
        {
            title: t('menu.notification.notification'),
            onPress: () => reserve(),
            icon: <Icons.ChannelNotificationIcon />
        }
    ]

    const organizationMenu: IMezonMenuItemProps[] = [
        {
            title: t('menu.organizationMenu.edit'),
            onPress: () => {
                dismiss();
                navigation.navigate(APP_SCREEN.MENU_CHANNEL.STACK, {
                    screen: APP_SCREEN.MENU_CHANNEL.SETTINGS,
                    params: {
                        channelId: channel?.channel_id
                    }
                });
            },
            icon: <SettingsIcon />
        },
        {
            title: t('menu.organizationMenu.duplicateChannel'),
            onPress: () => reserve(),
            icon: <Icons.CopyIcon />
        }
    ];

    const devMenu: IMezonMenuItemProps[] = [
        {
            title: t('menu.devMode.copyChannelID'),
            icon: <Icons.IDIcon />,
            onPress: () => {
                Clipboard.setString(channel?.channel_id);
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
                <Text style={styles.serverName}>{channel?.channel_label}</Text>
            </View>

            <View>
                <MezonMenu menu={menu} />
            </View>
        </View>
    )
}
