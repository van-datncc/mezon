import { Colors } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	closeIcon: {
		color: '#FFFFFF',
	},
    container: {
        flex: 1,
        backgroundColor: '#313338'
    },
    headerWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 40,
        paddingBottom: 15,
        paddingHorizontal: 8,
        backgroundColor: '#2a2e31'
    },
    headerContent: {
        flexDirection: 'row'
    },
    textTitle: {
        color: Colors.white,
        fontSize: 20,
        marginLeft: 10,
        fontWeight: 600
    },
    confirm: {
        color: Colors.white,
        fontSize: 18,
        marginLeft: 10,
    }
})