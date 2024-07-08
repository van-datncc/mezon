import { Metrics, useTheme } from "@mezon/mobile-ui";
import { View } from "react-native";
import { IMezonMenuSectionProps, MezonMenu } from "../../../temp-ui";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Icons } from "@mezon/mobile-components";
import { memo } from "react";

export default memo(function NotificationItemOption({ onDelete }: { onDelete: () => void }) {
    const { t } = useTranslation(["notification"]);
    const { themeValue } = useTheme();

    const menu = useMemo(() => ([
        {
            items: [
                {
                    title: t('removeNotification'),
                    icon: <Icons.TrashIcon height={20} width={20} color={themeValue.textStrong} />,
                    onPress: () => { onDelete() }
                }
            ]
        }
    ]) satisfies IMezonMenuSectionProps[], [])

    return (
        <View style={{ padding: Metrics.size.xl }}>
            <MezonMenu menu={menu} />
        </View>
    )
});