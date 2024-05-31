import { Colors } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    btnIcon: {
        padding: 7,
        borderRadius: 10,
        backgroundColor: Colors.green
    },
    btnGroup: {
        // backgroundColor: "red",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingHorizontal: 10,
        marginTop: -20
    }
})

export default styles;