import { Colors, size } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    reportMessageModalContainer: {
        gap: size.s_18,
        flex: 1,
        justifyContent: 'space-between',
    },
    cancelButtonWrapper: {
        borderTopWidth: 1,
        borderTopColor: Colors.borderNeutralDisable,
    },
    cannelText: {
        paddingVertical: size.s_18,
        color: Colors.white,
        textAlign: 'center'
    },
    messageBox: {
        paddingTop: size.s_10,
        borderRadius: size.s_4,
        borderWidth: 1,
        borderColor: Colors.borderNeutralDisable
    },
    selectedMessageText: {
        color: Colors.tertiary,
        marginBottom: size.s_10
    },
    contentWrapper: {
        marginHorizontal: size.s_10,
    }
})