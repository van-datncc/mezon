import { MezonStoreProvider, initStore } from '@mezon/store';
import { RouterProvider } from 'react-router-dom';
import {
  MezonContextProvider,
  CreateNakamaClientOptions,
} from '@mezon/transport';
import { GoogleOAuthProvider } from '@react-oauth/google';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { MezonUiProvider } from '@mezon/ui';
import { routes } from './routes/index';
import './app.module.scss';
import { preloadedState } from './mock/state';
import { useEffect } from 'react';
import WebFont from 'webfontloader';

const store = initStore(preloadedState);
const GOOGLE_CLIENT_ID ='1089303247801-qp0lhju8efratqkuk2murphealgdcseu.apps.googleusercontent.com';

const nakama: CreateNakamaClientOptions = {
  host: 'dev-mezon.nccsoft.vn',
  port: '7350',
  key: 'defaultkey',
  ssl: false,
};

const theme = 'light';

export function App() {
  useEffect(() => {
    WebFont.load({
      google: {
        families: ['Manrope'],
      },
    });
  }, []);
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <MezonStoreProvider store={store}>
        <MezonUiProvider themeName={theme}>
          <MezonContextProvider nakama={nakama} connect={true}>
            <RouterProvider router={routes} />
          </MezonContextProvider>
        </MezonUiProvider>
      </MezonStoreProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
