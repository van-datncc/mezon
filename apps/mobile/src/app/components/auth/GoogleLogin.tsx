import { accountActions, authActions, useAppDispatch } from '@mezon/store';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useNavigation } from '@react-navigation/native';
import Images from 'apps/mobile/src/assets/Images';
import React, { useEffect } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
const GOOGLE_ANDROID_ID = '648946579638-qtugur5pktrkh30q0ampp76fnaekcmk7.apps.googleusercontent.com';
const GOOGLE_WEB_ID = '648946579638-331cst20cdecpef6ov0o0qauupfhq41n.apps.googleusercontent.com';

const GoogleLogin = () => {
	const dispatch = useAppDispatch();

	useEffect(() => {
		GoogleSignin.configure({
			webClientId: GOOGLE_WEB_ID,
			offlineAccess: true,
			forceCodeForRefreshToken: true,
		});
	}, []);
	const navigation = useNavigation();
	async function onGoogleButtonPress() {
		try {
			// Get the users ID token
			await GoogleSignin.hasPlayServices();
			const { idToken } = await GoogleSignin.signIn();
			const action = await dispatch(authActions.authenticateGoogle(idToken));
			const session = action.payload;
			console.log('Tom log  => session', session);
			dispatch(accountActions.setAccount(session));
		} catch (error) {
			console.log('error onGoogleButtonPress', error);
		}
	}
	return (
		<Pressable style={styles.googleButton} onPress={onGoogleButtonPress}>
			<View style={styles.socialButtonsContainer}>
				<View style={styles.signinButtonLogoContainer}>
					<Image source={Images.ICON_GOOGLE} style={styles.signinButtonLogo} />
				</View>
				<Text style={styles.socialSigninButtonText}>Continue with Google</Text>
			</View>
		</Pressable>
	);
};

export default GoogleLogin;

const styles = StyleSheet.create({
	googleButton: {
		backgroundColor: '#D1E0FF',
		paddingVertical: 15,
		marginHorizontal: 20,
		borderRadius: 8,
		justifyContent: 'center',
		alignItems: 'center',
	},
	socialButtonsContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
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
