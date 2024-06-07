import { CreateMezonClientOptions, MezonContextProvider } from '@mezon/transport';
import React from 'react';
import RootNavigation from './RootNavigator';
import i18n from '@mezon/translations';
import { I18nextProvider } from 'react-i18next';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { toastConfig } from '../configs/toastConfig';

const mezon: CreateMezonClientOptions = {
	host: process.env.NX_CHAT_APP_API_HOST as string,
	key: process.env.NX_CHAT_APP_API_KEY as string,
	port: process.env.NX_CHAT_APP_API_PORT as string,
	ssl: process.env.NX_CHAT_APP_API_SECURE === 'true',
};

const App = () => {
	return (
		<SafeAreaProvider>
			<I18nextProvider i18n={i18n}>
				<MezonContextProvider mezon={mezon} connect={true}>
					<RootNavigation />
					<Toast config={toastConfig} />
				</MezonContextProvider>
			</I18nextProvider>
		</SafeAreaProvider>
	);
};

export default App;
