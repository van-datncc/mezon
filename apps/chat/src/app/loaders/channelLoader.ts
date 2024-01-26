import { LoaderFunction, json } from 'react-router-dom';
import { authActions, channelsActions, clansActions, getStoreAsync } from '@mezon/store';

export const channelLoader: LoaderFunction = async ({params}) => {
  try {
    const {channelId} = params
    const store = await getStoreAsync();
    if(!channelId) {
     throw new Error('Channel ID null')
    }
    const response = store.dispatch(channelsActions.joinChanel(channelId));
    return response;
  } catch (e: unknown) {
    console.error(e);
    throw json(
      { message: "Error occured while fetching data" },
    );
  }
}