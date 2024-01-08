import { Provider } from 'react-redux'
import { Store } from 'redux'
import { RootState } from './store'

type Props = {
    children: React.ReactNode
    store: Store<RootState>
}

export function MezonStoreProvider({ children, store }: Props) {
  return <Provider store={store}>{children}</Provider>
}