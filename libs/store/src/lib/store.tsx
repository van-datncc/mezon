import { PreloadedState, StateFromReducersMapObject, configureStore } from '@reduxjs/toolkit'


import { appReducer } from './app/app.slice'
import { authReducer  } from './auth/auth.slice'
import { clansReducer } from './clans/clans.slice'
import { channelsReducer } from './channels/channels.slice'
import { threadsReducer } from './threads/threads.slice'
import { messagesReducer } from './messages/messages.slice'
import { usersReducer } from './users/users.slice'

const reducer = {
  app: appReducer,
  auth: authReducer,
  clans: clansReducer,
  channels: channelsReducer,
  threads: threadsReducer,
  messages: messagesReducer,
  users: usersReducer,
};

export type RootState = StateFromReducersMapObject<typeof reducer>

export type PreloadedRootState = PreloadedState<RootState>

export const initStore = (preloadedState: PreloadedRootState) => {
  return configureStore({
    reducer,
    preloadedState
  })
}

type Store = ReturnType<typeof initStore>

export type AppDispatch = Store['dispatch']