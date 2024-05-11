import { Colors } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    buttonWrapper: {
        backgroundColor: Colors.bg_Primary,
        borderRadius: 3,
        elevation: 1
    },
    text: {
        color: Colors.white,
        textAlign: 'center',
    },
    disable: {
        opacity: .4,
    }
})