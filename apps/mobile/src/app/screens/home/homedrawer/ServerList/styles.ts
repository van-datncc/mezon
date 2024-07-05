import { Attributes, Colors, baseColor, size, verticalScale } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

export const style = (colors: Attributes)=> StyleSheet.create({
    wrapperServerList: {
		height: '100%',
		paddingTop: size.s_20,
		width: '18%',
		justifyContent: 'flex-start',
		backgroundColor: colors.primary,
		alignItems: 'center',
		gap: size.s_10
	},

    badge: {
		backgroundColor: Colors.red,
		position: 'absolute',
		borderRadius: size.s_14,
		borderWidth: 3,
		borderColor: Colors.secondary,
		minWidth: size.s_22,
		height: size.s_22,
		alignItems: 'center',
		justifyContent: 'center',
		bottom: -3,
		right: -5
	},

    badgeText: {
		color: Colors.white,
		fontWeight: 'bold',
		fontSize: size.small
	},

    wrapperPlusClan: {
		marginTop: verticalScale(5),
		height: verticalScale(50),
		width: verticalScale(50),
		borderRadius: 50,
		overflow: 'hidden',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: colors.secondary,
	},
})
