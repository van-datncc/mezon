import { Colors, size } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    addFriendContainer: {
        backgroundColor: Colors.secondary,
        flex: 1,
        paddingHorizontal: size.s_18,
        gap: size.s_18
    },
    groupWrapper: {
        borderRadius: size.s_12,
        overflow: 'hidden',
    },
    whiteText: {
        color: Colors.white
    },
    addFriendItem: {
        padding: size.s_10,
        backgroundColor: Colors.bgDarkCharcoal
    },
    addFriendText: {
        color: Colors.white
    }
})
