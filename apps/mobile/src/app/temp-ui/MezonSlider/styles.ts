import { Colors, Fonts, Metrics } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.secondary,
        padding: Metrics.size.l,
        borderRadius: 10,
        marginBottom: Metrics.size.xl
    },
    title: {
        color: Colors.white,
        fontSize: Fonts.size.h8,
        fontWeight: "bold",

    },
    value: {
        color: Colors.gray72,
        fontSize: Fonts.size.h8,
    },
    header: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingBottom: Metrics.size.l
    },
    thumb: {
        backgroundColor: Colors.white,
        height: 25,
        width: 25,
        borderRadius: 15,
    },
    track: {
        backgroundColor: Colors.gray72,
        height: 4
    },
    miniTrack: {
        backgroundColor: Colors.green
    }
})

export default styles;