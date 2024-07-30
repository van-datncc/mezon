import { Attributes, size } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

export const style = (colors: Attributes) => StyleSheet.create({
    settingContainer: {
        backgroundColor: colors.primary
    },
    settingScroll: {
        padding: size.s_20,
    }
})
