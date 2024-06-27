import { ScrollView, View } from "react-native";
import { IMezonMenuItemProps, IMezonMenuSectionProps, IMzoneOptionData, MezonConfirm, MezonInput, MezonMenu, MezonOption } from "../../temp-ui";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styles from "./styles";
import { BellIcon, FolderPlusIcon, LinkIcon, PinIcon, TrashIcon, UserShieldIcon, WebhookIcon } from "libs/mobile-components/src/lib/icons2";
import MezonSlider, { IMezonSliderData } from "../../temp-ui/MezonSlider";
import { channelsActions, selectChannelById, useAppDispatch } from "@mezon/store-mobile";
import { APP_SCREEN, MenuChannelScreenProps } from "../../navigation/ScreenTypes";
import { useSelector } from "react-redux";
import { useState } from "react";

type ScreenChannelSetting = typeof APP_SCREEN.MENU_CHANNEL.SETTINGS;
export default function ChannelSetting({ navigation, route }: MenuChannelScreenProps<ScreenChannelSetting>) {
    const { channelId } = route.params;
    const { t } = useTranslation(['channelSetting']);
    const dispatch = useAppDispatch();
    const channel = useSelector(selectChannelById(channelId || ""));

    const [isVisibleDeleteChannelModal, setIsVisibleDeleteChannelModal] = useState<boolean>(false);

    const categoryMenu = useMemo(() => ([
        {
            title: t('fields.channelCategory.title'),
            expandable: true,
            icon: <FolderPlusIcon />
        }
    ]) satisfies IMezonMenuItemProps[], [])

    const permissionMenu = useMemo(() => ([
        {
            title: t('fields.channelPermission.permission'),
            expandable: true,
            icon: <UserShieldIcon />
        }
    ]) satisfies IMezonMenuItemProps[], [])

    const notificationMenu = useMemo(() => ([
        {
            title: t('fields.channelNotifications.notification'),
            expandable: true,
            icon: <BellIcon />
        },
        {
            title: t('fields.channelNotifications.pinned'),
            expandable: true,
            icon: <PinIcon />
        },
        {
            title: t('fields.channelNotifications.invite'),
            expandable: true,
            icon: <LinkIcon />
        },
    ]) satisfies IMezonMenuItemProps[], [])

    const webhookMenu = useMemo(() => ([
        {
            title: t('fields.channelWebhooks.webhook'),
            expandable: true,
            icon: <WebhookIcon />
        },
    ]) satisfies IMezonMenuItemProps[], [])

    const deleteMenu = useMemo(() => ([
        {
            title: t('fields.channelDelete.delete'),
            textStyle: { color: "red" },
            onPress: () => handlePressDeleteChannel(),
            icon: <TrashIcon color="red" />
        },
    ]) satisfies IMezonMenuItemProps[], [])

    const topMenu = useMemo(() => ([
        { items: categoryMenu },
        {
            items: permissionMenu,
            bottomDescription: t('fields.channelPermission.description')
        },
        {
            items: notificationMenu,
            bottomDescription: ""
        },
    ]) satisfies IMezonMenuSectionProps[], [])

    const bottomMenu = useMemo(() => ([
        { items: webhookMenu },
        { items: deleteMenu },
    ]) satisfies IMezonMenuSectionProps[], [])

    const hideInactiveOptions = useMemo(() => ([
        {
            title: t('fields.channelHideInactivity._1hour'),
            value: 0
        },
        {
            title: t('fields.channelHideInactivity._24hours'),
            value: 1
        },
        {
            title: t('fields.channelHideInactivity._3days'),
            value: 2
        },
        {
            title: t('fields.channelHideInactivity._1Week'),
            value: 3
        },
    ]) satisfies IMzoneOptionData, [])

    const slowModeOptions = useMemo(() => ([
        {
            value: 0,
            name: t('fields.channelSlowMode.slowModeOff')
        },
        {
            value: 1,
            name: t('fields.channelSlowMode._5seconds')
        },
        {
            value: 2,
            name: t('fields.channelSlowMode._10seconds')
        },
        {
            value: 3,
            name: t('fields.channelSlowMode._15seconds')
        },
        {
            value: 4,
            name: t('fields.channelSlowMode._30seconds')
        },
        {
            value: 5,
            name: t('fields.channelSlowMode._1minute')
        },
        {
            value: 6,
            name: t('fields.channelSlowMode._1minute')
        },
        {
            value: 7,
            name: t('fields.channelSlowMode._2minutes')
        },
        {
            value: 8,
            name: t('fields.channelSlowMode._5minutes')
        },
        {
            value: 9,
            name: t('fields.channelSlowMode._10minutes')
        },
        {
            value: 10,
            name: t('fields.channelSlowMode._15minutes')
        },
        {
            value: 11,
            name: t('fields.channelSlowMode._30minutes')
        },
        {
            value: 12,
            name: t('fields.channelSlowMode._1hour')
        },
        {
            value: 13,
            name: t('fields.channelSlowMode._2hours')
        },
        {
            value: 14,
            name: t('fields.channelSlowMode._6hours')
        },
    ]) satisfies IMezonSliderData, [])

    const handleDeleteChannel = async () => {
        await dispatch(channelsActions.deleteChannel({
            channelId: channel?.channel_id,
            clanId: channel?.clan_id
        }));

        navigation.navigate(APP_SCREEN.HOME);
    };

    const handleDeleteModalVisibleChange = (visible: boolean) => {
        setIsVisibleDeleteChannelModal(visible);
    }

    const handlePressDeleteChannel = () => {
        setIsVisibleDeleteChannelModal(true);
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.inputWrapper}>
                <MezonInput
                    label={t('fields.channelName.title')}
                    value="uuu"
                />

                <MezonInput
                    label={t('fields.channelDescription.title')}
                    value="uuu"
                    textarea
                />
            </View>

            <MezonMenu menu={topMenu} />

            <MezonSlider
                data={slowModeOptions}
                title={t('fields.channelSlowMode.title')} />

            <MezonOption
                title={t('fields.channelHideInactivity.title')}
                data={hideInactiveOptions}
                bottomDescription={t('fields.channelHideInactivity.description')}
            />

            <MezonMenu menu={bottomMenu} />

            <MezonConfirm
                visible={isVisibleDeleteChannelModal}
                onVisibleChange={handleDeleteModalVisibleChange}
                onConfirm={handleDeleteChannel}
                title={t('confirm.delete.title')}
                confirmText={t('confirm.delete.confirmText')}
                content={t('confirm.delete.content', {
                    channelName: channel?.channel_label
                })}
            />
        </ScrollView>
    )
}