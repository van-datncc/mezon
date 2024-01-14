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

const store = initStore(preloadedState);
const GOOGLE_CLIENT_ID =
  '848059125942-6sujlck9t2joksnnmjamn2o0klohmqoi.apps.googleusercontent.com';

const nakama: CreateNakamaClientOptions = {
  host: '172.16.100.126',
  port: '7350',
  key: 'defaultkey',
  ssl: false,
};

const theme = 'light';

export function App() {
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
