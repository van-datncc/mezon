import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Images from 'apps/mobile/src/assets/Images'
import auth from '@react-native-firebase/auth';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { useNavigation } from '@react-navigation/native';
import { APP_SCREEN } from '../../navigation/ScreenTypes';
const GoogleLogin = () => {


    React.useEffect(() => {
        GoogleSignin.configure({
            webClientId: "1089303247801-qp0lhju8efratqkuk2murphealgdcseu.apps.googleusercontent.com",
            offlineAccess: true
        });
    }, [])
    const navigation = useNavigation()
    async function onGoogleButtonPress() {
        try {
            // Check if your device supports Google Play
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            // Get the users ID token
            const { idToken } = await GoogleSignin.signIn();

            // Create a Google credential with the token
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);
            console.log({ idToken });

            // Sign-in the user with the credential
            auth().signInWithCredential(googleCredential);
            navigation.navigate(APP_SCREEN.SERVERS.HOME)

        } catch (error) {
            console.log("Loi", JSON.stringify(error));
            console.log("LOi", error);

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

export default GoogleLogin

const styles = StyleSheet.create({
    googleButton: {
        backgroundColor: "#D1E0FF",
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
        backgroundColor: "#155EEF",
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
        color: "#155EEF",
        fontSize: 16,
        lineHeight: 13 * 1.4,
    },
})