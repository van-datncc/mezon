import { Colors, size } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    logoutButton: {
        backgroundColor: Colors.secondary,
        flexDirection: 'row',
        alignItems: 'center',
        padding: size.s_10,
        gap: size.s_10
    },
    logoutText: {
        color: Colors.textRed,
        fontSize: size.label
    },
    settingContainer: {
        paddingHorizontal: size.s_20
    },
    logoutIconWrapper: {
        height: 20,
        width: 20,
    }
})
