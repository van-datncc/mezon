import { Attributes, Metrics } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

export const style = ({ primary }: Attributes) => StyleSheet.create({
    container: {
        flex: 1,
        padding: Metrics.size.xl,
        backgroundColor: primary,
    },

    box: {
        height: 80,
        width: 55,
        borderRadius: 10,
        borderWidth: 1,
    },
});