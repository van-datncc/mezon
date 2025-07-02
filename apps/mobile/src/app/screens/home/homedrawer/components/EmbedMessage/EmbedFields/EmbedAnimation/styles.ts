import { size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (isPortrait: boolean) =>
	StyleSheet.create({
		loading: {
			flex: 1,
			alignItems: 'center',
			justifyContent: 'center'
		},
		pool: {
			flex: 1,
			alignItems: 'center',
			justifyContent: 'center',
			flexDirection: 'row',
			gap: size.s_10,
			paddingVertical: isPortrait ? 0 : size.s_40
		}
	});
