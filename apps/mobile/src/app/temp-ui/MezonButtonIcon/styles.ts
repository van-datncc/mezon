import { Attributes, Colors } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

export const style = ({ secondary, textStrong, borderDim }: Attributes) => StyleSheet.create({
    iconWrapper: {
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        padding: 10,
        backgroundColor: secondary,
        borderWidth: 1,
        borderColor: borderDim,
        borderRadius: 999
    },

    container: {
        gap: 10,
        alignItems: 'center',
    },

    title: {
        color: textStrong,
        fontSize: 9,
    }
})