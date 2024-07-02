import { Attributes, size } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

export const style = (colors: Attributes) => StyleSheet.create({
    settingContainer: {
        padding: size.s_20,
        backgroundColor: colors.primary
    }
})
