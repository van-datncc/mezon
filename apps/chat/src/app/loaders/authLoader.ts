import { json } from 'react-router-dom';
import { accountActions, authActions, getStoreAsync } from '@mezon/store';


export const authLoader = async () => {
  const store = await getStoreAsync();
  const response = await store.dispatch(authActions.refreshSession());

  if((response as unknown as any).error) { 
    return json({ error: "Error occured while fetching data" }) 
  }

  await store.dispatch(accountActions.getUserProfile());

  return null;
}

export const shouldRevalidateAuth = () => {
  return false
}