import { Attributes, Colors, Fonts, Metrics } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

export const style = ({ secondary, text }: Attributes) => StyleSheet.create({
    sectionWrapper: {
        marginBottom: Metrics.size.xl,
    },

    sectionTitle: {
        color: text,
        fontSize: Fonts.size.h8,
        fontWeight: '600',
        marginBottom: Fonts.size.s_10
    },

    sectionDescription: {
        color: Colors.gray72,
        fontSize: Fonts.size.h8,
    },

    section: {
        marginBottom: Metrics.size.m,
        backgroundColor: secondary,
        borderRadius: 10,
        overflow: 'hidden',
    },
})