import { Attributes, Colors } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: Colors.bgCharcoal
		},
		scrollView: {
			flexGrow: 1
		}
	});
