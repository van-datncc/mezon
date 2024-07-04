import { Attributes, Fonts, Metrics, baseColor, size } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

export const style = (colors: Attributes) => StyleSheet.create({
    channelListLink: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingRight: Metrics.size.l
	},

	threadItem: {
		flexDirection: 'row',
		flexGrow: 1,
		alignItems: 'flex-end',
	},

	threadItemActive: {
		backgroundColor: colors.secondaryLight,
		borderRadius: size.s_10,
		// borderWidth: 0.4,
		// borderColor: Colors.gray48,
		position: 'absolute',
		width: '95%',
		height: '90%',
		right: 0,
		top: size.s_18,
	},

	titleThread: {
		flex: 1,
		fontSize: size.s_14,
		fontWeight: '600',
		marginLeft: size.s_6,
		color: colors.text,
		top: size.s_6,
	},

	channelListItemTitleActive: {
		color: colors.textStrong,
	},

	threadFirstItemActive: {
		height: '160%',
		right: 0,
		top: size.s_2,
		backgroundColor: colors.secondaryLight,
		borderRadius: size.s_10,
		// borderWidth: 0.4,
		// borderColor: Colors.gray48
	},

	channelDotWrapper: {
		backgroundColor: baseColor.red,
		height: 20,
		width: 20,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 10,
	},

	channelDot: {
		color: baseColor.white,
		fontSize: Fonts.size.h8,
	},
	
	
});
