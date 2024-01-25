import { json } from 'react-router-dom';
import { accountActions, authActions, getStoreAsync } from '@mezon/store';

export const authLoader = async () => {
  try {
    const store = await getStoreAsync();
    const response = await store.dispatch(authActions.refreshSession());
    await store.dispatch(accountActions.getUserProfile())
    return response;
  } catch (e: unknown) {
    console.error(e);
    throw json(
      { message: "Error occured while fetching data" },
    );
  }
}