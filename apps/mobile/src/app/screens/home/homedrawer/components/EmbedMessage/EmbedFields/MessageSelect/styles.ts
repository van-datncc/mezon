import { Attributes, Metrics, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		bsContainer: {
			padding: Metrics.size.xl
		},
		input: {
			borderWidth: 1,
			borderColor: colors.border,
			borderRadius: size.s_12
		}
	});
