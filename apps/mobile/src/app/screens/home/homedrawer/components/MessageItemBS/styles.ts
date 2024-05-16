import { Colors, size } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    bottomSheetWrapper: {
        flex: 1,
		backgroundColor: Colors.bgCharcoal,
		width: '100%',
		borderTopRightRadius: 8,
		borderTopLeftRadius: 8
    },
	messageActionsWrapper: {
		paddingTop: size.s_2
	},
	actionItem: {
		flexDirection: 'row',
		gap: 20,
		paddingHorizontal: size.s_16,
		paddingVertical: size.s_12
	},
	actionText: {
		color: Colors.white
	},
	actionIcon: {
		color: Colors.white,
	}
});
