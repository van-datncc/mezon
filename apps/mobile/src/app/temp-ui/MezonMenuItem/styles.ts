import { StyleSheet } from "react-native";
import { Colors, size } from "@mezon/mobile-ui";

const styles = StyleSheet.create({
    btn: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: size.s_10,
        backgroundColor: Colors.secondary,
        paddingLeft: 20
    },
    btnTitle: {
        color: Colors.tertiary,
        fontSize: 14,
        flexBasis: 10,
        flexGrow: 1,
    },

    btnTitleWrapper: {
        padding: 15,
        paddingLeft: 0,
        flexGrow: 1,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 5
    },
    borderBottom: {
        borderBottomColor: Colors.borderDim,
        borderBottomWidth: 1,
    },

    disable: {
        opacity: 0.8
    }
})

export default styles;