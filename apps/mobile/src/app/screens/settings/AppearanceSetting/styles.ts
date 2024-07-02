import { Attributes, Metrics } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

export const style = ({ primary }: Attributes) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: primary,
        padding: Metrics.size.xl
    }
});