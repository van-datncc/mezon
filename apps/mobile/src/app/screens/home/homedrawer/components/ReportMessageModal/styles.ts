import { Colors, size } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    reportMessageModalContainer: {
        gap: size.s_18,
        flex: 1,
        justifyContent: 'space-between'
    },
    cancelButtonWrapper: {
        borderTopWidth: 1,
        borderTopColor: Colors.borderDim,
    },
    cannelText: {
        paddingVertical: size.s_18,
        color: Colors.white,
        textAlign: 'center'
    }
})