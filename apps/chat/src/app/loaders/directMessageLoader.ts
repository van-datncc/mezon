import { LoaderFunction } from 'react-router-dom';
import { channelsActions, getStoreAsync } from '@mezon/store';

export const directMessageLoader: LoaderFunction = async ({params}) => {
  const {directId} = params

  const store = await getStoreAsync();
  if(!directId) {
   throw new Error('DirectMessage ID null')
  }
//   store.dispatch(channelsActions.joinChanel(channelId));
  return null;
}