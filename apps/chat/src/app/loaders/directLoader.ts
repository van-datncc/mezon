import { LoaderFunction } from 'react-router-dom';
import { channelsActions, directActions, getStoreAsync } from '@mezon/store';
import { ChannelTypeEnum } from '@mezon/utils';

export const directLoader: LoaderFunction = async () => {
    const store = await getStoreAsync();
    store.dispatch(
        directActions.fetchDirectMessage({
            clanId: '',
            channelType: ChannelTypeEnum.DM_CHAT | ChannelTypeEnum.GROUP_CHAT,
        }),
    );

    return null;
};
