import { size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = () =>
	StyleSheet.create({
		scrollView: {
			height: '100%'
		},
		contentContainer: {
			paddingBottom: size.s_65
		}
		// horizontalScrollView: {
		// 	maxWidth: size.s_100 * 1.9,
		// 	height: size.s_60,
		// 	alignSelf: 'center',
		// 	marginBottom: size.s_10
		// },
		// pageItem: {
		// 	width: size.s_30,
		// 	height: size.s_30,
		// 	borderRadius: size.s_15,
		// 	marginHorizontal: size.s_4,
		// 	marginVertical: size.s_10,
		// 	backgroundColor: colors.primary,
		// 	justifyContent: 'center',
		// 	alignItems: 'center'
		// },
		// pageNumber: {
		// 	color: colors.textStrong,
		// 	fontSize: size.medium
		// },
		// selected: {
		// 	borderWidth: size.s_2,
		// 	borderColor: colors.white
		// }
	});
