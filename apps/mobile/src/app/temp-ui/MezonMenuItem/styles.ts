import { StyleSheet } from "react-native";
import { Attributes, Fonts, Metrics, size } from "@mezon/mobile-ui";

export const style = ({ secondary, textStrong, text, borderDim }: Attributes) => StyleSheet.create({
    btn: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: size.s_10,
        backgroundColor: secondary,
        paddingLeft: Metrics.size.xl,
    },

    btnTextWrapper: {
        flexBasis: 10,
        flexGrow: 1,
    },

    btnTitle: {
        color: textStrong,
        fontSize: Fonts.size.h85,
        fontWeight: "600"
    },

    btnDescription: {
        color: text,
        fontSize: Fonts.size.h9,
    },

    btnTitleWrapper: {
        padding: Metrics.size.l,
        paddingLeft: 0,
        flexGrow: 1,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: Metrics.size.s,
        flexBasis: 10
    },
    borderBottom: {
        borderBottomColor: borderDim,
        borderBottomWidth: 1,
    },

    disable: {
        opacity: 0.8
    },

    previewValue: {
        color: text,
        fontSize: Fonts.size.h8
    }
})