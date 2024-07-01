import { View } from "react-native";
import { APP_SCREEN, SettingScreenProps } from "../../../navigation/ScreenTypes";
import { style } from "./styles";
import { useTheme } from "@mezon/mobile-ui";
import { useMemo } from "react";
import { IMezonMenuSectionProps, IMzoneOptionData, MezonMenu, MezonOption } from "../../../temp-ui";

type AppearanceSettingScreen = typeof APP_SCREEN.SETTINGS.APPEARANCE;
export default function AppearanceSetting({ navigation }: SettingScreenProps<AppearanceSettingScreen>) {
    const styles = style(useTheme());

    const menuTheme = useMemo(() => ([
        {

            title: "a",
            items: [
                {
                    title: "a",
                    expandable: true,
                },
                {
                    title: "b",
                    description: "b",
                }
            ]
        }
    ] as IMezonMenuSectionProps[]), [])

    const menuSearch = useMemo(() => ([
        {
            title: "",
            items: [
                {
                    title: "",
                }
            ]
        }
    ]) as IMezonMenuSectionProps[], [])

    const DMMessagePreviewOptions = useMemo(() => ([
        {
            title: "",
            value: 0
        }
    ]) as IMzoneOptionData, [])

    return (
        <View style={styles.container}>
            <MezonMenu menu={menuTheme} />
            <MezonOption data={DMMessagePreviewOptions} title=""/>
            <MezonMenu menu={menuSearch} />
        </View>
    )
}