import { View } from "react-native";
import { APP_SCREEN, SettingScreenProps } from "../../../navigation/ScreenTypes";
import { style } from "./styles";
import { useTheme } from "@mezon/mobile-ui";
import { useMemo } from "react";
import { IMezonMenuSectionProps, IMzoneOptionData, MezonMenu, MezonOption } from "../../../temp-ui";
import { useTranslation } from "react-i18next";

type AppearanceSettingScreen = typeof APP_SCREEN.SETTINGS.APPEARANCE;
export default function AppearanceSetting({ navigation }: SettingScreenProps<AppearanceSettingScreen>) {
    const {theme, themeValue} = useTheme();
    const styles = style(themeValue);
    const { t } = useTranslation(['appearanceSetting']);

    const menuTheme = useMemo(() => ([
        {
            title: t('menu.theme.title'),
            items: [
                {
                    title: t('menu.theme.theme'),
                    expandable: true,
                    previewValue: theme,
                    onPress: ()=>{
                        navigation.navigate(APP_SCREEN.SETTINGS.STACK, {
                            screen: APP_SCREEN.SETTINGS.APP_THEME
                        })
                    }
                },
                {
                    title: t('menu.theme.syncAcrossClients.title'),
                    description: t('menu.theme.syncAcrossClients.description'),
                }
            ]
        }
    ] as IMezonMenuSectionProps[]), [])

    const menuSearch = useMemo(() => ([
        {
            title: t('menu.search.title'),
            items: [
                {
                    title: t('menu.search.showResultCount.title'),
                    description: t('menu.search.showResultCount.description')
                }
            ]
        }
    ]) as IMezonMenuSectionProps[], [])

    const DMMessagePreviewOptions = useMemo(() => ([
        {
            title: t('fields.DMMessagePreview.AllMessages'),
            value: 0
        },
        {
            title: t('fields.DMMessagePreview.UnreadDMOnly'),
            value: 1
        },
        {
            title: t('fields.DMMessagePreview.None'),
            value: 2
        },
    ]) as IMzoneOptionData, [])

    return (
        <View style={styles.container}>
            <MezonMenu menu={menuTheme} />
            <MezonOption data={DMMessagePreviewOptions} title={t('fields.DMMessagePreview.title')} />
            <MezonMenu menu={menuSearch} />
        </View>
    )
}