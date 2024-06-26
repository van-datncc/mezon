import { ScrollView, View } from "react-native";
import { IMezonMenuItemProps, IMezonMenuSectionProps, IMzoneOptionData, MezonInput, MezonMenu, MezonOption } from "../../temp-ui";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styles from "./styles";
import { BellIcon, FolderPlusIcon, LinkIcon, PinIcon, TrashIcon, UserShieldIcon, WebhookIcon } from "libs/mobile-components/src/lib/icons2";

export default function ChannelSetting() {
    const { t } = useTranslation(['channelSetting']);

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

            <MezonOption
                title={t('fields.channelHideInactivity.title')}
                data={hideInactiveOptions}
                bottomDescription={t('fields.channelHideInactivity.description')}
            />

            <MezonMenu menu={bottomMenu} />
        </ScrollView>
    )
}