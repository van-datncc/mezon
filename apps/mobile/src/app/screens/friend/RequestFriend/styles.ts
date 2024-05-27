import { Colors, size } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    requestFriendContainer: {
        backgroundColor: Colors.secondary,
        flex: 1,
        paddingHorizontal: size.s_18,
        gap: size.s_18
    },
    toggleWrapper: {
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        padding: size.s_2,
        borderRadius: size.s_16,
        gap: size.s_6
    },
    tab: {
        paddingVertical: size.s_6,
        backgroundColor: Colors.primary,
        borderRadius: size.s_16,
        flex: 1
    },
    activeTab: {
        backgroundColor: Colors.secondary,
    },
    tabTitle: {
        textAlign: 'center',
        color: Colors.textGray
    },
    activeTabTitle: {
        color: Colors.white
    },
    groupWrapper: {
        borderRadius: size.s_12,
        overflow: 'hidden',
    },
})
