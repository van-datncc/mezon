import { Attributes, size } from '@mezon/mobile-ui';
import { Dimensions, StyleSheet } from 'react-native';

const style = (colors: Attributes) => StyleSheet.create({
	container: {
		backgroundColor: colors.primary,
		paddingHorizontal: size.s_20,
		width: Dimensions.get('screen').width,
	},
	title: {
		fontSize: size.label,
		color: colors.white,
		fontWeight: '600',
		marginBottom: size.s_20,
	},
});

export default style;
