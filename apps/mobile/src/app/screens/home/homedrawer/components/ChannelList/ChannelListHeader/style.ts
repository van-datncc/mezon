import { Colors } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    listHeader: {
        width: '100%',
        height: 30,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },

    titleNameWrapper: {
        display: "flex",
        flexDirection: "row",
        gap: 5,
        alignItems: "center"
    },

    titleServer: {
        color: Colors.white,
        fontWeight: 'bold',
        fontSize: 16
    },

    infoHeader: {
        width: '100%',
        display: "flex",
        flexDirection: "row",
        gap: 5,
        alignItems: "center"
    },

    textInfo: {
        color: Colors.gray72,
        fontSize: 9,
    },

    container: {
        padding: 10,
    }
});

export default styles;