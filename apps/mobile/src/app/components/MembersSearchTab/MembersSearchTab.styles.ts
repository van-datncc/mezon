import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

const style = (colors: Attributes) =>
	StyleSheet.create({
		container: {
			backgroundColor: colors.primary,
			paddingHorizontal: size.s_20,
			flex: 1
		},
		boxMembers: {
			marginTop: size.s_10,
			borderRadius: size.s_14,
			backgroundColor: colors.secondary,
			flex: 1,
			marginBottom: size.s_20
		}
	});

export default style;
