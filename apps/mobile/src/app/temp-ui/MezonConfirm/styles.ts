import { Colors, Fonts, Metrics } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.secondary,
        padding: Metrics.size.xl,
        margin: Metrics.size.l,
        borderRadius: 10,
        overflow: 'hidden'
    },

    title: {
        color: Colors.white,
        fontSize: Fonts.size.h7,
        fontWeight: 'bold'
    },

    header: {
        paddingBottom: Metrics.size.m,
        borderBottomColor: Colors.borderDim,
        borderBottomWidth: 1,
        marginBottom: Metrics.size.xl
    },

    btnWrapper: {
        display: "flex",
        gap: Metrics.size.m,
        paddingVertical: Metrics.size.m,
        paddingTop: Metrics.size.xl
    },

    btn: {
        borderRadius: 20,
        padding: Metrics.size.m,
        backgroundColor: Colors.gray48
    },
    btnDanger: {
        backgroundColor: Colors.red
    },
    btnText: {
        color: Colors.white,
        fontSize: Fonts.size.h8,
        textAlign: "center"
    },

    contentText: {
        color: Colors.white,
        fontSize: Fonts.size.h8,
        textAlign: "center"
    }
})

export default styles;