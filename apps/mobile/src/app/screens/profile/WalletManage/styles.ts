import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colors.primary
		},
		modalContainer: {
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: colors.primary,
			paddingHorizontal: size.s_10,
			paddingTop: size.s_20,
			paddingBottom: size.s_30,
			borderRadius: size.s_10
		},
		form: {
			flex: 1,
			backgroundColor: colors.primary,
			borderRadius: size.s_10,
			paddingHorizontal: size.s_20,
			paddingVertical: size.s_20,
			gap: size.s_10
		},
		textField: {
			backgroundColor: colors.secondaryLight,
			borderRadius: size.s_6,
			justifyContent: 'center',
			paddingHorizontal: size.s_4,
			borderWidth: 0.3,
			borderColor: colors.textDisabled
		},
		title: {
			color: colors.text,
			marginTop: size.s_10,
			marginBottom: size.s_10
		},
		heading: {
			color: colors.textStrong,
			marginBottom: size.s_15,
			fontSize: size.s_18,
			fontWeight: 'bold'
		},
		textInput: {
			paddingHorizontal: size.s_10,
			fontSize: size.s_14,
			height: size.s_40,
			color: colors.text
		},
		buttonTitle: {
			color: 'white',
			fontSize: size.s_16,
			fontWeight: 'bold'
		},
		userItem: {
			flexDirection: 'row',
			gap: size.s_8,
			alignItems: 'center',
			padding: size.s_10,
			marginVertical: size.s_2
		},
		username: {
			color: colors.text,
			paddingHorizontal: size.s_10
		},
		searchText: {
			paddingHorizontal: size.s_10
		},
		fullscreenModal: {
			width: '100%',
			height: '100%',
			backgroundColor: colors.primary,
			justifyContent: 'space-between',
			paddingHorizontal: size.s_30,
			paddingVertical: size.s_30
		},
		modalHeader: {
			marginTop: size.s_20,
			textAlign: 'left'
		},
		successText: {
			fontSize: size.h3,
			fontWeight: 'bold',
			color: colors.white
		},
		amountText: {
			fontSize: size.h3,
			fontWeight: 'bold',
			color: colors.white
		},
		modalBody: {
			width: '100%',
			height: '45%'
		},
		infoRow: {
			flexDirection: 'column',
			justifyContent: 'space-between',
			paddingVertical: size.s_10
		},
		label: {
			fontSize: size.s_14,
			marginBottom: size.s_8,
			color: colors.text
		},
		value: {
			fontSize: size.s_18,
			fontWeight: 'bold',
			color: colors.white
		},
		button: {
			backgroundColor: '#5a62f4',
			justifyContent: 'center',
			alignItems: 'center',
			height: size.s_50,
			borderRadius: size.s_50
		},
		textButton: {
			fontSize: size.s_14,
			fontWeight: 'bold',
			color: 'white'
		},
		cardWallet: {
			borderRadius: size.s_10,
			marginBottom: size.s_20,
			backgroundColor: colors.border,
			borderWidth: 0.3,
			borderColor: colors.textDisabled
		},
		cardWalletWrapper: {
			padding: size.s_16,
			paddingVertical: size.s_14,
			gap: size.s_14
		},
		cardWalletLine: {
			flexDirection: 'row',
			alignItems: 'flex-end',
			justifyContent: 'space-between'
		},
		cardTitle: {
			fontSize: size.s_12,
			fontWeight: '600',
			color: colors.text
		},
		cardAmount: {
			fontSize: size.s_18,
			fontWeight: 'bold',
			color: colors.white
		},
		empty: {
			alignSelf: 'center',
			justifyContent: 'center',
			alignItems: 'center',
			gap: size.s_20,
			paddingVertical: size.s_20,
			marginBottom: size.s_20
		},
		iconEmpty: {
			backgroundColor: colors.secondaryLight,
			width: size.s_70,
			height: size.s_70,
			borderRadius: size.s_70,
			alignItems: 'center',
			justifyContent: 'center'
		},
		text: {
			fontSize: size.s_16,
			fontWeight: 'bold',
			color: colors.text
		},

		walletHeader: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			marginBottom: size.s_20
		},
		walletTitle: {
			fontSize: size.s_18,
			fontWeight: 'bold',
			color: colors.white
		},
		closeButton: {
			padding: size.s_8
		},
		statusRow: {
			flexDirection: 'row',
			alignItems: 'center',
			marginBottom: size.s_20
		},
		statusText: {
			color: '#16A34A',
			fontWeight: 'bold',
			marginLeft: size.s_4
		},
		section: {
			marginBottom: size.s_20
		},
		valueBox: {
			backgroundColor: colors.secondaryLight,
			borderRadius: size.s_6,
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'center',
			padding: size.s_10,
			marginBottom: size.s_10
		},
		valueText: {
			color: colors.text,
			fontSize: size.s_14,
			flex: 1
		},
		copyButton: {
			marginLeft: size.s_8,
			paddingHorizontal: size.s_4
		},
		showButton: {
			backgroundColor: colors.secondaryLight,
			borderRadius: size.s_6,
			padding: size.s_10,
			alignItems: 'center',
			marginBottom: size.s_10,
			flexDirection: 'row',
			justifyContent: 'center'
		},
		showButtonText: {
			color: colors.text,
			fontWeight: 'bold',
			marginLeft: size.s_8,
			fontSize: size.s_14
		},
		warningBox: {
			borderWidth: 1,
			borderColor: 'rgb(154 52 18)',
			backgroundColor: '#413232',
			borderRadius: size.s_10,
			padding: size.s_14,
			marginTop: size.s_20
		},
		warningTitle: {
			color: '#FED7AB',
			fontWeight: 'bold',
			fontSize: size.s_14,
			marginBottom: size.s_8
		},
		warningText: {
			color: '#F5B471',
			fontSize: size.s_14,
			marginBottom: size.s_4
		},
		phraseContainer: {
			flexDirection: 'row',
			flexWrap: 'wrap',
			justifyContent: 'space-between',
			marginTop: size.s_6,
			marginBottom: size.s_20,
			padding: size.s_12,
			borderRadius: size.s_8,
			gap: size.s_12,
			backgroundColor: colors.secondary
		},
		wordBox: {
			width: '30%',
			backgroundColor: colors.primary,
			borderRadius: size.s_12,
			paddingVertical: size.s_6,
			gap: size.s_4,
			justifyContent: 'center',
			alignItems: 'center',
			borderWidth: 1,
			borderColor: colors.border
		},
		wordIndex: {
			fontSize: size.s_12,
			color: colors.textDisabled
		},
		word: {
			fontSize: size.s_14,
			color: colors.text
		}
	});
