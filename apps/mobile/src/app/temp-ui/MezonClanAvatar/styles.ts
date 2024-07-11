import { Attributes } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

export const style = (colors: Attributes) => StyleSheet.create({
    image: {
        height: '100%',
        width: '100%',
    },

    fakeBox: {
        height: '100%',
        width: '100%',
        justifyContent: "center",
        alignItems: 'center'
    },

    altText: {
        color: colors.textDisabled,
        fontSize: 14,
        textAlign: 'center',
        fontWeight: "bold",
    }
})
