import i18n from '@mezon/translations';
import { CreateMezonClientOptions, MezonContextProvider } from '@mezon/transport';
import * as Sentry from '@sentry/react-native';
import React, { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import codePush from 'react-native-code-push';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import 'react-native-svg';
import VersionInfo from 'react-native-version-info';
import MezonUpdateVersionModal from '../componentUI/MezonUpdateVersionModal';
import RootNavigation from './RootNavigator';

const routingInstrumentation = new Sentry.ReactNavigationInstrumentation();

Sentry.init({
	dsn: process.env.NX_MOBILE_SENTRY_DSN,
	tracesSampleRate: 1.0,
	enabled: !__DEV__,
	integrations: [
		new Sentry.ReactNativeTracing({
			routingInstrumentation
		})
	]
});

const codePushOptions = {
	checkFrequency: codePush.CheckFrequency.MANUAL,
	installMode: codePush.InstallMode.IMMEDIATE,
	mandatoryInstallMode: codePush.InstallMode.IMMEDIATE
};

enableScreens(false);
const mezon: CreateMezonClientOptions = {
	host: process.env.NX_CHAT_APP_API_HOST as string,
	key: process.env.NX_CHAT_APP_API_KEY as string,
	port: process.env.NX_CHAT_APP_API_PORT as string,
	ssl: process.env.NX_CHAT_APP_API_SECURE === 'true'
};

const App = () => {
	const [isShowUpdateModal, setIsShowUpdateModal] = React.useState<boolean>(false);

	useEffect(() => {
		checkForUpdate();
	}, []);

	const checkForUpdate = async () => {
		const update = await codePush.checkForUpdate(process.env.NX_CODE_PUSH_KEY_MOBILE as string);
		if (VersionInfo.appVersion === update?.appVersion) {
			setIsShowUpdateModal(true);
		}
	};

	return (
		<SafeAreaProvider>
			<MezonUpdateVersionModal visible={isShowUpdateModal} onClose={() => setIsShowUpdateModal(false)} />
			<I18nextProvider i18n={i18n}>
				<MezonContextProvider mezon={mezon} connect={true} isFromMobile={true}>
					<RootNavigation />
				</MezonContextProvider>
			</I18nextProvider>
		</SafeAreaProvider>
	);
};

export default codePush(codePushOptions)(App);
