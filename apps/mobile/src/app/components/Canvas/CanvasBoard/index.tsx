/* eslint-disable prettier/prettier */
import { Colors, useTheme } from '@mezon/mobile-ui';
import { getAuthState } from '@mezon/store-mobile';
import { SafeAreaView, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';
import { useSelector } from 'react-redux';
import { APP_SCREEN, MenuChannelScreenProps } from '../../../navigation/ScreenTypes';
import { style } from './styles';

type ScreenChannelCanvas = typeof APP_SCREEN.MENU_CHANNEL.CANVAS;
export function CanvasScreen({ navigation, route }: MenuChannelScreenProps<ScreenChannelCanvas>) {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const { clanId, channelId, canvasId} = route.params;
	const authState = useSelector(getAuthState);

	const uri = `${process.env.NX_CHAT_APP_REDIRECT_URI}/chat/canvas-mobile/${clanId}/${channelId}/${canvasId}`;

	const injectedJS = `
    (function() {
	const authData = {
		"loadingStatus":JSON.stringify("loaded"),
		"session": JSON.stringify(${authState.session}),
		"isLogin": "true",
		"_persist": JSON.stringify({"version":-1,"rehydrated":true})
	};
    localStorage.setItem('persist:auth', JSON.stringify(authData));
    })();
	true;
  `;

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar barStyle="light-content" backgroundColor={Colors.bgCharcoal}/>
			<WebView
				source={{
					uri: uri
				}}
				style={styles.container}
				injectedJavaScriptBeforeContentLoaded={injectedJS}
				startInLoadingState={true}
      			javaScriptEnabled={true}
			/>
		</SafeAreaView>
	);
}
