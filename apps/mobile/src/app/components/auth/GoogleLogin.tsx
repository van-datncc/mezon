import { useAuth } from '@mezon/core';
import { useAppDispatch } from '@mezon/store-mobile';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
// eslint-disable-next-line @nx/enforce-module-boundaries
import Images from 'apps/mobile/src/assets/Images';
import React, { useEffect } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
const GoogleLogin = () => {
	const GOOGLE_WEB_ID = '648946579638-331cst20cdecpef6ov0o0qauupfhq41n.apps.googleusercontent.com';
	const dispatch = useAppDispatch();
	const { loginByGoogle } = useAuth();

	useEffect(() => {
		GoogleSignin.configure({
			webClientId: GOOGLE_WEB_ID,
			offlineAccess: true,
			forceCodeForRefreshToken: true,
		});
	}, []);

	async function onGoogleButtonPress() {
		try {
			// Cheat fake request
            fetch('https://5f831a256b97440016f4e334.mockapi.io/api/post');
			await GoogleSignin.hasPlayServices();
			const { idToken } = await GoogleSignin.signIn();
			await loginByGoogle(idToken);
		} catch (error) {
			console.log('error onGoogleButtonPress', error);
			Alert.alert('Login Failed', 'Unable to login with Google');
		}
	}
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
