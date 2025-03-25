import { useClans } from '@mezon/core';
import { size, ThemeModeBase, useTheme } from '@mezon/mobile-ui';
import { getAuthState, selectAllAccount, selectAllChannelMembers, selectAppChannelById, useAppSelector } from '@mezon/store-mobile';
import { MiniAppEventType, sleep } from '@mezon/utils';
import { useNavigation } from '@react-navigation/native';
import { useCallback, useMemo, useRef, useState } from 'react';
import { StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { Chase } from 'react-native-animated-spinkit';
import WebView from 'react-native-webview';
import { useSelector } from 'react-redux';
import MezonIconCDN from '../../../../componentUI/MezonIconCDN';
import { IconCDN } from '../../../../constants/icon_cdn';
import { style } from './styles';

const ChannelAppScreen = ({ route }) => {
	const { themeValue, themeBasic } = useTheme();
	const styles = style(themeValue);
	const authState = useSelector(getAuthState);
	const session = JSON.stringify(authState.session);
	const { channelId } = route?.params || {};
	const [loading, setLoading] = useState(true);
	const { currentClanId } = useClans();
	const channelApp = useAppSelector((state) => selectAppChannelById(state, channelId as string));
	const userProfile = useSelector(selectAllAccount);
	const userChannels = useAppSelector((state) => selectAllChannelMembers(state, channelApp?.channel_id));
	const webviewRef = useRef<WebView>(null);
	const [channelTitle, setChannelTitle] = useState<string>('');
	const navigation = useNavigation();
	const miniAppDataHash = useMemo(() => {
		return `userChannels=${JSON.stringify(userChannels)}`;
	}, [userChannels]);

	const uri = `${process.env.NX_CHAT_APP_REDIRECT_URI}/chat/clans/${currentClanId}/channels/${channelId}`;

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

	const injectSelector = `#mainChat > div`;

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
	(function() {
	setTimeout(() => {
		window.ReactNativeWebView.postMessage("huh");
      let element = document.querySelector("#mainChat > div > div > div.flex-shrink.flex.flex-col.dark\\:bg-bgPrimary.bg-bgLightPrimary.h-auto.relative.w-full > div.flex.gap-2.px-3.pt-2.dark\\:text-channelTextLabel.text-colorTextLightMode > div:nth-child(1)");
      if (element) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          id: element.id,
          innerText: element.innerText,
          classList: Array.from(element.classList)
        }));
      } else {
        window.ReactNativeWebView.postMessage(JSON.stringify({ error: "Không tìm thấy #mainChat" }));
      }
    }, 5000);
	})();
	true;
  `;

	const handlePing = useCallback(() => {
		const message = JSON.stringify({ eventType: MiniAppEventType.CURRENT_USER_INFO, eventData: userProfile });
		webviewRef?.current?.postMessage(message);
	}, [userProfile]);

	const handleReload = () => {
		webviewRef?.current?.reload();
	};

	const handleMessage = useCallback((event) => {
		if (event?.nativeEvent?.title) {
			setChannelTitle(event?.nativeEvent?.title);
		}
	}, []);

	const handleClose = () => {
		navigation.goBack();
	};

	const handleGoback = () => {
		webviewRef?.current?.goBack();
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
					<Chase color={'#cdcdcd'} />
				</View>
			)}
			<StatusBar barStyle={themeBasic === ThemeModeBase.LIGHT ? 'dark-content' : 'light-content'} backgroundColor={themeValue.charcoal} />
			<View style={styles.topBar}>
				<TouchableOpacity onPress={handleClose} style={styles.backButton}>
					<MezonIconCDN icon={IconCDN.closeLargeIcon} height={size.s_20} width={size.s_20} />
				</TouchableOpacity>
				<Text style={styles.title}>{channelTitle}</Text>
				<View style={styles.row}>
					<TouchableOpacity onPress={handleGoback} style={styles.backButton}>
						<MezonIconCDN icon={IconCDN.chevronSmallLeftIcon} height={size.s_20} width={size.s_20} />
					</TouchableOpacity>
					<TouchableOpacity onPress={handleReload} style={styles.backButton}>
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
				nestedScrollEnabled={true}
				onLoadEnd={async () => {
					await sleep(500);
					setLoading(false);
					handlePing();
				}}
				onMessage={handleMessage}
			/>
		</View>
	);
};

export default ChannelAppScreen;
