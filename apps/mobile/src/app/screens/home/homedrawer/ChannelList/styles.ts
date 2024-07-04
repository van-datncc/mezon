import { Attributes, Colors, size } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

export const style = (colors: Attributes) => StyleSheet.create({
    mainList: {
        height: '100%',
        width: '78%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
        backgroundColor: colors.secondary
    },
    channelListSearch: {
        width: '100%',
        paddingHorizontal: 8,
        marginBottom: size.s_16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: size.s_8,
    },
    channelListSearchWrapperInput: {
        backgroundColor: Colors.tertiaryWeight,
        flex: 1,
        borderRadius: size.s_16,
        alignItems: 'center',
        paddingHorizontal: size.s_6,
        gap: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    channelListSearchInput: {
        height: size.s_34,
        padding: 0,
        flex: 1,
    },
    inviteIconWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        backgroundColor: colors.primary,
        width: 40,
        height: 40,
    },
})