import {
    directActions,
    selectAllDirectMessages,
    selectAllFriends,
} from '@mezon/store';
import { useSelector } from 'react-redux';
import React, { useMemo } from 'react';
import { useChannelMembers } from './useChannelMembers';
import { useMessages } from './useMessages';
import { useThreads } from './useThreads';
import {
    selectCurrentClanId,
    clansActions,
    useAppDispatch,
    selectAllAccount,
    selectUnreadMessageIdByChannelId,
    selectLastMessageIdByChannelId,
} from '@mezon/store';
import { IMessage } from '@mezon/utils';
import { useMezon } from '@mezon/transport';
import {
    ApiInviteUserRes,
    ApiLinkInviteUser,
} from 'vendors/mezon-js/packages/mezon-js/dist/api.gen';
// @deprecated

export function useChatDirect(directMessageID: string | undefined) {
    const friends = useSelector(selectAllFriends);
    // const listDM = useSelector(selectAllDirectMessages);
    const { clientRef, sessionRef, socketRef, channelRef } = useMezon();
    const { userProfile } = useSelector(selectAllAccount);
    const { messages } = useMessages({ channelId: directMessageID });
    const client = clientRef.current;
    const dispatch = useAppDispatch();

    const listDM = [
        {
            clan_id: '00000000-0000-0000-0000-000000000000',
            parrent_id: '00000000-0000-0000-0000-000000000000',
            channel_id: 'dc9465ff-0a9e-4a34-9f6b-6ca73a5e5d00',
            category_id: 'c8fe32eb-eeff-40e0-b315-d2db5d3166c1',
            category_name: '00000000-0000-0000-0000-000000000000',
            type: 2,
            creator_id: '26e7e1ff-7b83-4f46-bb87-58991d0cbdb1',
            channel_lable: 'p-channelPro',
        },
        {
            clan_id: '00000000-0000-0000-0000-000000000000',
            parrent_id: '00000000-0000-0000-0000-000000000000',
            channel_id: 'e1ee58c1-3424-427b-98b3-3be2247deff4',
            category_id: 'c8fe32eb-eeff-40e0-b315-d2db5d3166c1',
            category_name: '00000000-0000-0000-0000-000000000000',
            type: 2,
            creator_id: '26e7e1ff-7b83-4f46-bb87-58991d0cbdb1',
            channel_lable: 'general',
        },
        {
            clan_id: '00000000-0000-0000-0000-000000000000',
            parrent_id: '00000000-0000-0000-0000-000000000000',
            channel_id: 'dc9465ff-0a9e-4a34-9f6b-6ca73a5e5d00',
            category_id: 'c8fe32eb-eeff-40e0-b315-d2db5d3166c1',
            category_name: '00000000-0000-0000-0000-000000000000',
            type: 3,
            creator_id: '26e7e1ff-7b83-4f46-bb87-58991d0cbdb1',
            channel_lable: 'GANGZ1, GANGZ2, GANGZ3, GANGZ4',
        },
        {
            clan_id: '00000000-0000-0000-0000-000000000000',
            parrent_id: '00000000-0000-0000-0000-000000000000',
            channel_id: 'e1ee58c1-3424-427b-98b3-3be2247deff4',
            category_id: 'c8fe32eb-eeff-40e0-b315-d2db5d3166c1',
            category_name: '00000000-0000-0000-0000-000000000000',
            type: 3,
            creator_id: '26e7e1ff-7b83-4f46-bb87-58991d0cbdb1',
            channel_lable: 'PHONG, NGUYEN, HOANG, TIEN, THUY, TRANG, USER 1',
        },
    ];

    const sendDirectMessage = React.useCallback(
        async (message: IMessage) => {
            // TODO: send message to server using nakama client
            const session = sessionRef.current;
            const client = clientRef.current;
            const socket = socketRef.current;
            const channel = channelRef.current;
            const currentClanId = '093b8667-1ce3-4982-9140-790dfebcf3c9';

            if (!client || !session || !socket || !channel || !currentClanId) {
                console.log(client, session, socket, channel, currentClanId);
                throw new Error('Client is not initialized');
            }

            const payload = {
                ...message,
                id: Math.random().toString(),
                date: new Date().toLocaleString(),
                user: {
                    name: userProfile?.user?.display_name || '',
                    username: userProfile?.user?.username || '',
                    id: userProfile?.user?.id || 'idUser',
                    avatarSm: userProfile?.user?.avatar_url || '',
                },
            };
            if (!payload.channel_id) {
                payload.channel_id = directMessageID || '';
            }
            const ack = await socket.writeChatMessage('', channel.id, payload);
        },
        [
            messages,
            sessionRef,
            clientRef,
            socketRef,
            channelRef,
            userProfile?.user?.display_name,
            userProfile?.user?.username,
            userProfile?.user?.id,
            userProfile?.user?.avatar_url,
            dispatch,
            directMessageID,
            listDM,
        ],
    );

    return useMemo(
        () => ({
            friends,
            client,
            messages,
            sendDirectMessage,
            dispatch,
            directMessageID,
            listDM,
        }),
        [
            friends,
            listDM,
            client,
            messages,
            sendDirectMessage,
            messages,
            listDM,
        ],
    );
}
