import { size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (isPortrait: boolean, isSlotGame: boolean) =>
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
			gap: isSlotGame ? size.s_10 : 0,
			paddingVertical: isPortrait ? 0 : size.s_40,
			marginVertical: isSlotGame ? -size.s_10 : -size.s_80
		}
	});
