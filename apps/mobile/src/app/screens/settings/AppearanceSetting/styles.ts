import { Attributes } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

export const style = ({bg_backdrop}: Attributes) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: bg_backdrop
    }
});