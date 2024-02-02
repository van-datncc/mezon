import { LoaderFunction } from 'react-router-dom';
import { channelsActions, getStoreAsync } from '@mezon/store';

export const directLoader: LoaderFunction = async ({params}) => {
  const {channelId} = params
//   const store = await getStoreAsync();
//   if(!channelId) {
//    throw new Error('DirectMessage ID null')
//   }
//   store.dispatch(channelsActions.joinChanel(channelId));
  return null;
}