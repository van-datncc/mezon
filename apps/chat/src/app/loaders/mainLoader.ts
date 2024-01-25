import { json } from 'react-router-dom';
import { clansActions, getStoreAsync } from '@mezon/store';

export const mainLoader = async () => {
  try {
    const store = await getStoreAsync();
    const response = await store.dispatch(clansActions.fetchClans());
    console.log('mainLoader', response);
    return response;
  } catch (e: unknown) {
    console.error(e);
    throw json(
      { message: "Error occured while fetching data" },
    );
  }
}