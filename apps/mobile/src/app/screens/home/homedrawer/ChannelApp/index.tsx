/* eslint-disable no-empty */
import { useClans } from '@mezon/core';
import { ActionEmitEvent } from '@mezon/mobile-components';
import { size, useTheme } from '@mezon/mobile-ui';
import { getAuthState } from '@mezon/store-mobile';
import { sleep } from '@mezon/utils';
import { useRef, useState } from 'react';
import { DeviceEventEmitter, Text, TouchableOpacity, View } from 'react-native';
import { Wave } from 'react-native-animated-spinkit';
import WebView from 'react-native-webview';
import { useSelector } from 'react-redux';
import MezonIconCDN from '../../../../componentUI/MezonIconCDN';
import { IconCDN } from '../../../../constants/icon_cdn';
import { style } from './styles';

const ChannelAppScreen = ({ channelId }) => {
	const { themeValue, themeBasic } = useTheme();
	const styles = style(themeValue);
	const authState = useSelector(getAuthState);
	const session = JSON.stringify(authState.session);
	const [loading, setLoading] = useState(true);
	const { currentClanId } = useClans();
	const webviewRef = useRef<WebView>(null);

	const uri = `${process.env.NX_CHAT_APP_REDIRECT_URI}/chat/apps-mobile/${currentClanId}/${channelId}`;
	const injectedJS = `
    (function() {
	const authData = {
		"loadingStatus":JSON.stringify("loaded"),
		"session": JSON.stringify(${session}),
		"isLogin": "true",
		"_persist": JSON.stringify({"version":-1,"rehydrated":true})
	};
    localStorage.setItem('persist:auth', JSON.stringify(authData));
    })();
	true;
	(function() {
		const persistApp = JSON.parse(localStorage.getItem('persist:apps'));
		if (persistApp) {
			persistApp.theme = JSON.stringify("${themeBasic}");
			persistApp.themeApp = JSON.stringify("${themeBasic}");
			localStorage.setItem('persist:apps', JSON.stringify(persistApp));
		}
	})();
	true;
  `;

	const injectedDataJS = `
   (function() {
      document.addEventListener('message', function(event) {
	  		window.ReactNativeWebView.postMessage(event.data);
          window.ReactNativeWebView.postMessage('Pong');
      });
    })();
	true;
	(function() {
      var style = document.createElement('style');
      style.innerHTML = \`
        .h-heightTopBar {
          display: none !important;
        }
      \`;
      document.head.appendChild(style);
    })();
	true;
  `;

	const closeChannelApp = () => {
		DeviceEventEmitter.emit(ActionEmitEvent.ON_TRIGGER_BOTTOM_SHEET, { isDismiss: true });
	};

	const reloadChannelApp = () => {
		webviewRef?.current?.reload();
	};
	const onMessage = (event) => {
		console.error('Received message from WebView:', event?.nativeEvent?.data);
	};
	return (
		<View style={styles.container}>
			{loading && (
				<View
					style={{
						alignItems: 'center',
						justifyContent: 'center',
						position: 'absolute',
						height: '100%',
						zIndex: 1,
						width: '100%',
						backgroundColor: themeValue.primary,
						flex: 1
					}}
				>
					<Wave color={themeValue.text} />
					<Text style={styles.textLoading}>Loading data, please wait a moment!</Text>
				</View>
			)}
			<View style={styles.topBar}>
				<TouchableOpacity onPress={closeChannelApp} style={styles.backButton}>
					<MezonIconCDN icon={IconCDN.closeLargeIcon} height={size.s_20} width={size.s_20} />
				</TouchableOpacity>
				<View style={styles.row}>
					<TouchableOpacity onPress={reloadChannelApp} style={styles.backButton}>
						<MezonIconCDN icon={IconCDN.reloadIcon} height={size.s_20} width={size.s_20} />
					</TouchableOpacity>
				</View>
			</View>
			<WebView
				ref={webviewRef}
				source={{
					uri: uri
				}}
				originWhitelist={['*']}
				style={styles.container}
				injectedJavaScriptBeforeContentLoaded={injectedJS}
				injectedJavaScript={injectedDataJS}
				javaScriptEnabled={true}
				onMessage={onMessage}
				nestedScrollEnabled={true}
				onLoadEnd={async () => {
					await sleep(500);
					setLoading(false);
				}}
			/>
		</View>
	);
};

export default ChannelAppScreen;
