import React from 'react';
import {CreateMezonClientOptions, MezonContextProvider} from "@mezon/transport";
import RootNavigation from "./RootNavigator";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { NX_CHAT_APP_API_HOST } from '@env';

const mezon: CreateMezonClientOptions = {
	host: process.env.NX_CHAT_APP_API_HOST as string,
	port: process.env.NX_CHAT_APP_API_PORT as string,
	key: process.env.NX_CHAT_APP_API_KEY as string,
	ssl: process.env.NX_CHAT_APP_API_SECURE === 'true',
};

const App = () => {
	return (
		<MezonContextProvider mezon={mezon} connect={true}>
			<RootNavigation />
		</MezonContextProvider>
	);
};

export default App;
