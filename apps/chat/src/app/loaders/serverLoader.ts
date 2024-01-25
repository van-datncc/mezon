import { LoaderFunction, json } from 'react-router-dom';
import { authActions, clansActions, getStoreAsync } from '@mezon/store';

export const serverLoader: LoaderFunction = async ({params}) => {
  try {
    const {serverId} = params
    const store = await getStoreAsync();
    if(!serverId) {
     throw new Error('Server ID null')
    }
    const response = await store.dispatch(clansActions.changeCurrentClan(serverId));
    return response;
  } catch (e: unknown) {
    console.error(e);
    throw json(
      { message: "Error occured while fetching data" },
    );
  }
}