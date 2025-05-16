import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

const style = (colors: Attributes) =>
	StyleSheet.create({
		container: {
			marginTop: size.s_10,
			paddingHorizontal: size.s_20,
			flex: 1
		},
		title: {
			fontSize: size.medium,
			color: colors.white,
			fontWeight: '600',
			marginBottom: size.s_20
		},
		listBox: {
			flex: 1,
			marginBottom: size.s_20
		}
	});

export default style;
