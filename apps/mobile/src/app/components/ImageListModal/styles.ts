import { Attributes, Colors, horizontalScale, size, verticalScale } from '@mezon/mobile-ui';
import { Dimensions, Platform, StyleSheet } from 'react-native';
const width = Dimensions.get('window').width;

export const style = (colors: Attributes) => StyleSheet.create({
	wrapperFooterImagesModal: {
		flex: 1,
		alignSelf: 'center',
		alignItems: 'center',
		width: width,
		paddingBottom: verticalScale(60),
		paddingTop: verticalScale(20),
		backgroundColor: colors.primary,
	},
	footerImagesModal: {
		maxWidth: '70%',
	},
	imageFooterModal: {
		width: horizontalScale(40),
		height: verticalScale(50),
		marginHorizontal: horizontalScale(5),
		borderRadius: horizontalScale(5),
		borderWidth: 1,
		borderColor: colors.primary,
	},
	imageFooterModalActive: {
		width: horizontalScale(80),
		height: verticalScale(50),
		borderWidth: 1,
		borderColor: Colors.bgViolet,
	},
	headerImagesModal: {
		padding: size.s_10,
		position: 'absolute',
		zIndex: 1000,
		top: Platform.OS === 'ios' ? size.s_40 : size.s_20,
		right: size.s_10,
		width: size.s_50,
		height: size.s_50,
		borderRadius: size.s_50,
		backgroundColor: 'rgba(0,0,0,0.5)',
	},
	messageBoxTop: {
		gap: size.s_6,
	},
	userNameMessageBox: {
		fontSize: size.medium,
		marginRight: size.s_10,
		fontWeight: '600',
		color: colors.textStrong,
	},
	dateMessageBox: {
		fontSize: size.small,
		color: colors.text,
	},
	logoUser: {
		width: '100%',
		height: '100%',
	},
	wrapperAvatar: {
		width: size.s_40,
		height: size.s_40,
		borderRadius: size.s_40,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: Colors.gray72,
		overflow: 'hidden',
	},
	textAvatar: {
		fontSize: size.s_16,
		color: Colors.white,
	},
});
