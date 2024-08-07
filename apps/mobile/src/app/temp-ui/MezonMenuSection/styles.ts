import { Attributes, Colors, Fonts } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

export const style = (colors: Attributes) => StyleSheet.create({
    sectionTitle: {
        color: colors.text,
        fontSize: Fonts.size.h8,
        fontWeight: '600',
        marginBottom: Fonts.size.s_10
    },

    sectionDescription: {
        color: Colors.gray72,
        fontSize: Fonts.size.h8,
    },

    section: {
        backgroundColor: colors.secondary,
        borderRadius: 10,
        overflow: 'hidden',
    },
})
