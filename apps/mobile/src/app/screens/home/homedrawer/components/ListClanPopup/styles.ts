import { Attributes, size, verticalScale } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) => StyleSheet.create({
	clansBox: {
		width: 250,
		maxHeight: 300,
		borderRadius: 10,
		backgroundColor: colors.primary,
    paddingHorizontal: size.s_4,
    paddingVertical: size.s_2
	},
	serverItem: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		borderRadius: 8,
		padding: size.s_6,
    backgroundColor: colors.primary,
	},
	serverName: {
		flexDirection: 'row',
		gap: size.s_16,
		alignItems: 'center',
	},
	wrapperPlusClan: {
		height: verticalScale(45),
		width: verticalScale(45),
		borderRadius: verticalScale(50),
		overflow: 'hidden',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: colors.secondary,
	},
	createClan: {
		width: '100%',
		padding: size.s_4,
		paddingTop: size.s_8,
		flexDirection: 'row',
		alignItems: 'center',
		borderRadius: 8,
    gap: size.s_16,
	},
	clanName: {
		color: colors.textStrong,
		fontSize: size.label,
		fontWeight: '400',
		maxWidth: 150,
	},
	clanIcon: {
		width: verticalScale(45),
		height: verticalScale(45)
	},
  activeClanItem: {
    backgroundColor: colors.secondaryLight
  },
  activeClanName: {
		fontWeight: '700',
    color: colors.white
  }
});
