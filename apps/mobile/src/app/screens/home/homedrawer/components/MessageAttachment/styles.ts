import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';
export const style = (colors: Attributes) =>
	StyleSheet.create({
		gridContainer: {
			flexDirection: 'row',
			flexWrap: 'wrap',
			gap: size.s_10
		},
		list: {
			paddingHorizontal: 10,
			paddingVertical: 10
		},
		imageContainer: {
			flex: 1,
			margin: 5,
			aspectRatio: 1
		}
	});
