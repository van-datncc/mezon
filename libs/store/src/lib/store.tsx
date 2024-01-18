import {
  Action,
  ThunkDispatch,
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
import { MezonContextValue } from '@mezon/transport'
import { useDispatch } from 'react-redux';

const persistConfig = {
  key: 'auth',
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

export const initStore = (mezon: MezonContextValue, preloadedState?: PreloadedRootState) => {
  const store = configureStore({
    reducer,
    preloadedState,
    middleware: (getDefaultMiddleware, ) => getDefaultMiddleware({
      thunk: {
        extraArgument: {
          mezon
        }
      },
      serializableCheck: false,
    }),
  });

  const persistor = persistStore(store);
  return { store, persistor };
};

type Store = ReturnType<typeof initStore>['store'];

export type AppThunkDispatch = ThunkDispatch<RootState, unknown, Action>;

export type AppDispatch = Store['dispatch'] & AppThunkDispatch;

export const useAppDispatch: () => AppDispatch = useDispatch