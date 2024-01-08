import { MezonStoreProvider, initStore, PreloadedRootState } from "@mezon/store";
import { RouterProvider  } from "react-router-dom";
import { NakamaContextProvider, CreateNakamaClientOptions } from "@mezon/transport";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { MezonUiProvider } from "@mezon/ui";
import { routes } from "./routes/index";


import './app.module.scss';

const preloadedState: PreloadedRootState = {
  app: {
    theme: 'light',
    loadingStatus: 'loaded', 
  },
  auth: {
    loadingStatus: 'loaded',
  },
  clans: {
    loadingStatus: 'loaded',
    entities: {
      'clan1': {
        id: 'clan1',
        name: 'Clan 1',
        description: 'Clan 1 description',
        image: 'https://avatars.githubusercontent.com/u/57796807?s=280&v=4',
        channelIds: ['channel1'],
        memberIds: ['user1'],
        categories: [{
          id: 'category1',
          name: 'Category 1',
          channelIds: ['channel1'],
          clanId: 'clan1',
        }],
        categoryIds: [],
      }
    },
    ids: ['clan1'],
  },
  channels: {
    loadingStatus: 'loaded',
    entities: {
      'channel1': {
        id: 'channel1',
        name: 'Channel 1',
        clanId: 'clan1',
        categoryId: 'category1',
        unread: false,
        memberIds: [],
        threadIds: [],
      }
    },
    ids: ['channel1'],
  },
  threads: {
    loadingStatus: 'loaded',
    entities: {},
    ids: [],
  },
  messages: {
    loadingStatus: 'loaded',
    entities: {
      '1': {
        id: '1',
        content: 'Hello',
        channelId: 'channel1',
        clanId: 'clan1',
        date: new Date().toLocaleString(),
        name: 'User 1',
        user: {
          id: 'user1',
          name: 'User 1',
          avatarSm: 'https://static.vecteezy.com/system/resources/previews/013/042/571/original/default-avatar-profile-icon-social-media-user-photo-in-flat-style-vector.jpg',
          username: 'user1',
        }
      },
      '2': {
        id: '2',
        content: 'Hello',
        channelId: 'channel1',
        clanId: 'clan1',
        date: new Date().toLocaleString(),
        name: 'User 2',
        user: {
          id: 'user2',
          name: 'User 2',
          avatarSm: 'https://static.vecteezy.com/system/resources/previews/013/042/571/original/default-avatar-profile-icon-social-media-user-photo-in-flat-style-vector.jpg',
          username: 'user2',
        }
      },
      '3': {
        id: '3',
        content: 'Hello',
        channelId: 'channel1',
        clanId: 'clan1',
        date: new Date().toLocaleString(),
        name: 'User 3',
        user: {
          id: 'user3',
          name: 'User 3',
          avatarSm: 'https://static.vecteezy.com/system/resources/previews/013/042/571/original/default-avatar-profile-icon-social-media-user-photo-in-flat-style-vector.jpg',
          username: 'user3',
        }
      }
    },
    ids: ['1', '2', '3'],
  },
  users: {
    loadingStatus: 'loaded',
    entities: {},
    ids: [],
  },
}

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
