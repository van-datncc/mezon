import { useAuth } from '@mezon/core';
import { useTheme } from '@mezon/mobile-ui';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMemo, useState } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import WebView from 'react-native-webview';
import StatusBarHeight from '../../../components/StatusBarHeight/StatusBarHeight';
import useTabletLandscape from '../../../hooks/useTabletLandscape';
import { generateCodeChallenge, generateCodeVerifier } from '../../../utils/helpers';
import { style } from './styles';

const NewLoginScreen = () => {
	const { themeValue } = useTheme();
	const isTabletLandscape = useTabletLandscape();
	const styles = style(themeValue, isTabletLandscape);
	const OAUTH2_AUTHORIZE_URL = process.env.NX_CHAT_APP_OAUTH2_AUTHORIZE_URL;
	const CLIENT_ID = process.env.NX_CHAT_APP_OAUTH2_CLIENT_ID;
	const REDIRECT_URI = encodeURIComponent(process.env.NX_CHAT_APP_OAUTH2_REDIRECT_URI as string);
	const RESPONSE_TYPE = process.env.NX_CHAT_APP_OAUTH2_RESPONSE_TYPE;
	const SCOPE = process.env.NX_CHAT_APP_OAUTH2_SCOPE;
	const CODE_CHALLENGE_METHOD = process.env.NX_CHAT_APP_OAUTH2_CODE_CHALLENGE_METHOD;
	const STATE = useMemo(() => {
		const randomState = Math.random().toString(36).substring(2, 15);
		AsyncStorage.setItem('oauth_state', randomState);
		return randomState;
	}, []);
	const [authUri, setAuthUri] = useState(null);
	const [modalVisible, setModalVisible] = useState(false);
	const { loginByEmail } = useAuth();

	const handleLogin = async () => {
		const codeVerifier = generateCodeVerifier();
		const codeChallenge = await generateCodeChallenge(codeVerifier);
		AsyncStorage.setItem('code_verifier', codeVerifier);

		const authUrl = `${OAUTH2_AUTHORIZE_URL}?client_id=${CLIENT_ID}&prompt=consent&response_type=${RESPONSE_TYPE}&scope=${SCOPE}&redirect_uri=${REDIRECT_URI}&code_challenge=${codeChallenge}&code_challenge_method=${CODE_CHALLENGE_METHOD}&state=${STATE}`;
		setAuthUri(authUrl);
		if (authUrl) {
			setModalVisible(true);
		}
	};

	const handleNavigationStateChange = (newNavState) => {
		if (newNavState?.url?.includes('code') && newNavState?.url?.includes('state')) {
			setModalVisible(false);
			setAuthUri(null);
			const code = new URLSearchParams(newNavState?.url?.split('?')[1]).get('code');
			const state = new URLSearchParams(newNavState?.url?.split('?')[1]).get('state');
			AsyncStorage.getItem('oauth_state').then(async (storedState) => {
				if (state === storedState) {
					await loginByEmail(code);
				} else {
					// todo: handle error or ignore
				}
			});
		} else if (newNavState.url.includes('error')) {
			setModalVisible(false);
			setAuthUri(null);
			Toast.show({
				type: 'error',
				text1: 'Login Failed',
				text2: 'Invalid email or password'
			});
		}
	};

	return (
		<View style={styles.supperContainer}>
			<StatusBarHeight />
			<View style={styles.headerContainer}>
				<Text style={styles.headerTitle}>WELCOME BACK</Text>
				<Text style={styles.headerContent}>So glad to meet you again!</Text>
			</View>
			<TouchableOpacity onPress={handleLogin} style={styles.button}>
				<Text style={styles.buttonText}>Login</Text>
			</TouchableOpacity>
			{authUri && (
				<Modal visible={modalVisible} onRequestClose={() => setAuthUri(null)} transparent={true} style={styles.modal}>
					<View style={styles.modalView}>
						<View style={styles.webView}>
							<WebView source={{ uri: authUri }} onNavigationStateChange={handleNavigationStateChange} />
						</View>
					</View>
				</Modal>
			)}
		</View>
	);
};

export default NewLoginScreen;
