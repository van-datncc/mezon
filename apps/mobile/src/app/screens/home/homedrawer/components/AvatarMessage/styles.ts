import {Attributes, Colors, size, verticalScale} from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';
export const style = (colors: Attributes) => StyleSheet.create({
	wrapperAvatar: {
		width: size.s_40,
		height: size.s_40,
		borderRadius: size.s_40,
		overflow: 'hidden',
	},
	wrapperAvatarCombine: {
		width: size.s_40,
	},
	btnScrollDown: {
		position: 'absolute',
		right: size.s_10,
		bottom: size.s_20,
		backgroundColor: colors.primary,
		width: size.s_50,
		height: size.s_50,
		borderRadius: size.s_50,
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: Colors.black,
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.3,
		shadowRadius: 4.65,
		elevation: 8,
		zIndex: 1000,
	},
	avatarMessageBoxDefault: {
		width: '100%',
		height: '100%',
		borderRadius: size.s_50,
		backgroundColor: Colors.titleReset,
		justifyContent: 'center',
		alignItems: 'center',
	},
	textAvatarMessageBoxDefault: {
		fontSize: size.s_22,
		color: Colors.white,
	},
	logoUser: {
		width: '100%',
		height: '100%',
	},
})
