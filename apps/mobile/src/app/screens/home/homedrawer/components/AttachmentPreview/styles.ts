import { Colors, size, verticalScale } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	container: {
		backgroundColor: Colors.secondary,
		borderTopColor: Colors.gray72,
		padding: size.s_16,
	},
	attachmentItem: {
		marginRight: size.s_14,
		borderRadius: size.s_6,
		width: verticalScale(70),
		height: verticalScale(80),
		paddingTop: size.s_10,
	},
	attachmentItemImage: {
		width: '100%',
		height: '100%',
		borderRadius: size.s_6,
	},
	iconClose: {
		position: 'absolute',
		top: 0,
		right: -size.s_10,
		backgroundColor: Colors.tertiary,
		borderWidth: 2,
		borderColor: Colors.secondary,
		borderRadius: size.s_20,
		padding: size.s_2,
		zIndex: size.s_2,
	},
	videoOverlay: {
		position: 'absolute',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		alignItems: 'center',
		justifyContent: 'center',
		bottom: 0,
		height: '100%',
		width: '100%',
		borderRadius: size.s_6,
	},
});

export default styles;
