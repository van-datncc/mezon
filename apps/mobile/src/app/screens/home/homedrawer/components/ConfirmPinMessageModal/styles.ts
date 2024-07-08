import { Colors, size } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
		backgroundColor: Colors.bgDarkCharcoal,
		alignSelf: 'center',
		borderRadius: size.s_10,
		padding: size.s_10,
		maxHeight: '40%',
		maxWidth: '90%',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
        gap: size.s_10
    },
    button: {
        paddingVertical: size.s_10,
        borderRadius: 50
    },
    borderRadius: {
        borderRadius: 50
    },
    buttonsWrapper: {
        maxHeight: 90,
        gap: size.s_10
    },
    title: {
        fontSize: size.h6,
        color: Colors.white,
        paddingBottom: size.s_10
    },
    descriptionText: {
        color: Colors.tertiary,
    }
})