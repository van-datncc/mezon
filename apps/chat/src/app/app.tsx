import { MezonStoreProvider, initStore } from "@mezon/store";
import { RouterProvider  } from "react-router-dom";
import { MezonContextProvider, CreateNakamaClientOptions } from "@mezon/transport";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { MezonUiProvider } from "@mezon/ui";
import { routes } from "./routes/index";


import './app.module.scss';

import { preloadedState } from './mock/state'

const store = initStore(preloadedState);

const nakama: CreateNakamaClientOptions = {
  host: "172.16.100.126",
  port: "7350",
  key: "defaultkey",
  ssl: false,
}

const theme =  'light';

export function App() {
  return (
    <MezonStoreProvider store={store}>
      <MezonUiProvider themeName={theme}>
        <MezonContextProvider nakama={nakama} connect={true}>
          <RouterProvider router={routes} />
        </MezonContextProvider>
      </MezonUiProvider>
    </MezonStoreProvider>
  );
}

export default App;
