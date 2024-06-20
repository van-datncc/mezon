import { Colors, size, verticalScale } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        gap: size.s_10,
    },
    groupAvatar: {
        backgroundColor: Colors.orange,
        width: size.s_50,
        height: size.s_50,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    badge: {
        backgroundColor: Colors.red,
        paddingHorizontal: size.s_2,
        position: 'absolute',
        borderRadius: size.s_14,
        borderWidth: 3,
        borderColor: Colors.secondary,
        minWidth: size.s_24,
        height: size.s_24,
        alignItems: 'center',
        justifyContent: 'center',
        bottom: -3,
        right: -5
    },
    badgeText: {
        color: Colors.white,
        fontWeight: 'bold',
        top: -2
    }
})