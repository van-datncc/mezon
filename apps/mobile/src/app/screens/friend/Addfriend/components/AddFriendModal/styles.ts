import { Colors, size } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    addFriendModalContainer: {
        paddingHorizontal: size.s_18,
        gap: size.s_18,
        flex: 1
    },
    whiteText: {
        color: Colors.white
    },
    addByUsernameContainer: {
        flex: 1,
    },
    searchInput: {
        borderRadius: size.s_10,
		color: Colors.white,
        paddingVertical: size.s_6   
    },
    searchUsernameWrapper: {
        backgroundColor: Colors.primary,
        borderRadius: size.s_10,
        alignItems: 'center',
        paddingHorizontal: size.s_12,
        flexDirection: 'row',
    },
    fill: {
        flex: 1
    }
})
