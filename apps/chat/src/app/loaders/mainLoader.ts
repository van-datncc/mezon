import { clansActions, getStoreAsync } from '@mezon/store';

export const mainLoader = async () => {
  const store = await getStoreAsync();
  store.dispatch(clansActions.fetchClans());
  return null;
}

export const shouldRevalidateMain = () => {
  return false
}