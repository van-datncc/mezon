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
import { categoriesReducer } from './categories/categories.slice'
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { MezonContextValue } from '@mezon/transport'
import { useDispatch } from 'react-redux';
import React from 'react';
import { trackActionError } from '@mezon/utils';

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
  categories: categoriesReducer
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
    middleware: (getDefaultMiddleware,) => getDefaultMiddleware({
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

export function useAppDispatch(): AppDispatch {
  const dispatch = useDispatch<AppDispatch>();
  const dispatchRef = React.useRef(dispatch);

  const appDispatch: (typeof dispatch) = React.useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (action: any) => {
      const result = dispatchRef.current(action);
      if (result instanceof Promise) {
        return result.then((res) => {
          trackActionError(res);
          return res;
        });
      }
      trackActionError(result);
      return result;
    },
    [],
  );

  return appDispatch;
}