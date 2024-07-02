import { Attributes, Colors, size } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

export const style = ({ primary }: Attributes) => StyleSheet.create({
    settingContainer: {
        padding: size.s_20,
        backgroundColor: primary
    }
})
