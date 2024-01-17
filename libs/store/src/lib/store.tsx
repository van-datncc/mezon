import {
  configureStore,
} from '@reduxjs/toolkit';

import { appReducer } from './app/app.slice';
import { accountReducer } from './account/account.slice';
import { authReducer } from './auth/auth.slice';
import { clansReducer } from './clans/clans.slice';
import { channelsReducer } from './channels/channels.slice';
import { threadsReducer } from './threads/threads.slice';
import { messagesReducer } from './messages/messages.slice';
import { usersReducer } from './users/users.slice';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, authReducer);

const reducer = {
  app: appReducer,
  account: accountReducer,
  auth: persistedReducer,
  clans: clansReducer,
  channels: channelsReducer,
  threads: threadsReducer,
  messages: messagesReducer,
  users: usersReducer,
};

const fakeStore = configureStore({
  reducer,
});

export type RootState = ReturnType<typeof fakeStore.getState>

export type PreloadedRootState = RootState | undefined;

export const initStore = (preloadedState?: PreloadedRootState) => {
  const store = configureStore({
    reducer,
    preloadedState,
  });

  const persistor = persistStore(store);
  return { store, persistor };
};

type Store = ReturnType<typeof initStore>['store'];

export type AppDispatch = Store['dispatch'];
