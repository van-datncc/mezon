import { AppleIcon, GoogleIcon } from '@mezon/mobile-components';
import { Block, size } from '@mezon/mobile-ui';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const LoginSocial = ({ onGoogleButtonPress, onAppleButtonPress }: any) => {
	return (
		<Block gap={size.s_20}>
			{Platform.OS === 'ios' && (
				<TouchableOpacity style={styles.appleButton} onPress={onAppleButtonPress}>
					<View style={styles.socialButtonsContainer}>
						<AppleIcon width={size.s_18} height={size.s_18} />
						<Text style={[styles.socialSigninButtonText, { color: 'white' }]}>Continue with Apple</Text>
					</View>
				</TouchableOpacity>
			)}
			<TouchableOpacity style={styles.googleButton} onPress={onGoogleButtonPress}>
				<View style={styles.socialButtonsContainer}>
					<GoogleIcon width={size.s_18} height={size.s_18} color={'#155EEF'} />
					<Text style={styles.socialSigninButtonText}>Continue with Google</Text>
				</View>
			</TouchableOpacity>
		</Block>
	);
};

export default LoginSocial;

const styles = StyleSheet.create({
	googleButton: {
		backgroundColor: '#f3f6fc',
		paddingVertical: 15,
		marginHorizontal: 20,
		borderRadius: 4,
		justifyContent: 'center',
		alignItems: 'center',
	},
	appleButton: {
		backgroundColor: 'black',
		paddingVertical: 15,
		marginHorizontal: 20,
		borderRadius: 4,
		justifyContent: 'center',
		alignItems: 'center',
	},
	socialButtonsContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
		gap: 10,
	},
	signinButtonLogoContainer: {
		backgroundColor: '#155EEF',
		padding: 2,
		borderRadius: 3,
		position: 'absolute',
		left: 25,
	},
	signinButtonLogo: {
		height: 18,
		width: 18,
	},
	socialSigninButtonText: {
		color: '#155EEF',
		fontSize: 16,
		lineHeight: 13 * 1.4,
	},
});
