import { MezonStoreProvider, initStore } from "@mezon/store";
import { RouterProvider  } from "react-router-dom";
import { NakamaContextProvider, CreateNakamaClientOptions } from "@mezon/transport";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { MezonUiProvider } from "@mezon/ui";
import { routes } from "./routes/index";


import './app.module.scss';

import { preloadedState } from './mock/state'

const store = initStore(preloadedState);

const nakama: CreateNakamaClientOptions = {
  host: "",
  port: '7350',
  key: "",
  useSSL: false,
}

const theme =  'light';

export function App() {
  return (
    <MezonStoreProvider store={store}>
      <MezonUiProvider themeName={theme}>
        <NakamaContextProvider nakama={nakama}>
          <RouterProvider router={routes} />
        </NakamaContextProvider>
      </MezonUiProvider>
    </MezonStoreProvider>
  );
}

export default App;
