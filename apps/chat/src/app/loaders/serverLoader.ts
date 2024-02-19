import { LoaderFunction, ShouldRevalidateFunction } from 'react-router-dom';
import { clansActions, getStoreAsync } from '@mezon/store';

export const serverLoader: LoaderFunction = async ({params, request}) => {
  const {serverId} = params
  const store = await getStoreAsync();
  if(!serverId) {
   throw new Error('Server ID null')
  }
  store.dispatch(clansActions.changeCurrentClan({ clanId: serverId,  }));
  return null;
}

export const shouldRevalidateServer: ShouldRevalidateFunction = (ctx) => {
  const {currentParams, nextParams} = ctx;
  const { serverId: currentServerId } = currentParams;
  const { serverId: nextServerId } = nextParams;
  return currentServerId !== nextServerId;
}