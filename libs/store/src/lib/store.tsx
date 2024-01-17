import { StateFromReducersMapObject, combineReducers, configureStore } from '@reduxjs/toolkit'

import { appReducer } from './app/app.slice'
import { accountReducer } from './account/account.slice'
import { authReducer  } from './auth/auth.slice'
import { clansReducer } from './clans/clans.slice'
import { channelsReducer } from './channels/channels.slice'
import { threadsReducer } from './threads/threads.slice'
import { messagesReducer } from './messages/messages.slice'
import { usersReducer } from './users/users.slice'

const reducer = combineReducers({
  app: appReducer,
  account: accountReducer,
  auth: authReducer,
  clans: clansReducer,
  channels: channelsReducer,
  threads: threadsReducer,
  messages: messagesReducer,
  users: usersReducer,
});

export type RootState = StateFromReducersMapObject<typeof reducer>

export type PreloadedRootState = Partial<RootState>

export const initStore = (preloadedState: PreloadedRootState) => {
  return configureStore({
    reducer,
    preloadedState
  })
}

type Store = ReturnType<typeof initStore>

export type AppDispatch = Store['dispatch']