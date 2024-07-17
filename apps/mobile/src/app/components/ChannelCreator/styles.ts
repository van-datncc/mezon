import { Attributes, Metrics } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

export const style = (colors: Attributes) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
        paddingVertical: Metrics.size.xl,
        display: 'flex',
        flexDirection: 'column',
        paddingHorizontal: Metrics.size.xl
    },
});