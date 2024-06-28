// eslint-disable-next-line @nx/enforce-module-boundaries
import Images from 'apps/mobile/src/assets/Images';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const GoogleLogin = ({ onGoogleButtonPress }: any) => {
	return (
		<TouchableOpacity style={styles.googleButton} onPress={onGoogleButtonPress}>
			<View style={styles.socialButtonsContainer}>
				<Image source={Images.ICON_GOOGLE} style={styles.signinButtonLogo} />
				<Text style={styles.socialSigninButtonText}>Continue with Google</Text>
			</View>
		</TouchableOpacity>
	);
};

export default GoogleLogin;

const styles = StyleSheet.create({
	googleButton: {
		backgroundColor: '#f3f6fc',
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
