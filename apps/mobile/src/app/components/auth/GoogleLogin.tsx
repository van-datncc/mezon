import { accountActions, authActions, useAppDispatch } from '@mezon/store';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useNavigation } from '@react-navigation/native';
<<<<<<< HEAD
<<<<<<< HEAD
import { APP_SCREEN } from '../../navigation/ScreenTypes';
const GoogleLogin = () => {


    React.useEffect(() => {
        GoogleSignin.configure({
            webClientId: "1089303247801-qp0lhju8efratqkuk2murphealgdcseu.apps.googleusercontent.com",
            offlineAccess: true
        });
    }, [])
=======
=======
import Images from 'apps/mobile/src/assets/Images';
import React, { useEffect } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
>>>>>>> 6a65afff118dc3638f31f5b2701f418f515d7819
const GOOGLE_ANDROID_ID = '648946579638-qtugur5pktrkh30q0ampp76fnaekcmk7.apps.googleusercontent.com';
const GOOGLE_WEB_ID = '648946579638-331cst20cdecpef6ov0o0qauupfhq41n.apps.googleusercontent.com';

const GoogleLogin = () => {
<<<<<<< HEAD
    useEffect(() => {
        GoogleSignin.configure({
            webClientId: GOOGLE_ANDROID_ID,
            offlineAccess: true,
            forceCodeForRefreshToken: true,
        });
    }, []);
>>>>>>> 05f7575e2b5e65bfd20e8a6cbb1960a9109d225c
    const navigation = useNavigation()
    async function onGoogleButtonPress() {
        try {
            // Get the users ID token
            await GoogleSignin.hasPlayServices();
            const { idToken } = await GoogleSignin.signIn();
<<<<<<< HEAD

            // Create a Google credential with the token
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);
            console.log({ idToken });

            // Sign-in the user with the credential
            auth().signInWithCredential(googleCredential);
            navigation.navigate(APP_SCREEN.SERVERS.HOME)

        } catch (error) {
            console.log("Loi", JSON.stringify(error));
            console.log("LOi", error);

=======
            console.log('Tom log  => idToken', idToken);
        } catch (error) {
            console.log('error onGoogleButtonPress', error);
>>>>>>> 05f7575e2b5e65bfd20e8a6cbb1960a9109d225c
        }

    }
    const GoogleSingUp = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            await GoogleSignin.signIn().then(result => { console.log(result) });
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
                alert('User cancelled the login flow !');
            } else if (error.code === statusCodes.IN_PROGRESS) {
                alert('Signin in progress');
                // operation (f.e. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                alert('Google play services not available or outdated !');
                // play services not available or outdated
            } else {
                console.log(error)
            }
        }
    };

    return (
        <Pressable style={styles.googleButton}
            onPress={onGoogleButtonPress}
        >
            <View style={styles.socialButtonsContainer}>
                <View style={styles.signinButtonLogoContainer}>
                    <Image source={Images.ICON_GOOGLE} style={styles.signinButtonLogo} />
                </View>
                <Text style={styles.socialSigninButtonText}>Continue with Google</Text>
            </View>
        </Pressable>
    )
}
=======
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
>>>>>>> 6a65afff118dc3638f31f5b2701f418f515d7819

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
