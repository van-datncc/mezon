import { selectAllDirectMessages, selectAllFriends } from "@mezon/store";
import { useSelector } from "react-redux";
import React, { useMemo } from "react";
import { useChannelMembers } from "./useChannelMembers";
import { useMessages } from "./useMessages";
import { useThreads } from "./useThreads";
import { selectCurrentClanId, clansActions, useAppDispatch, selectAllAccount, selectUnreadMessageIdByChannelId, selectLastMessageIdByChannelId } from "@mezon/store";
import { IMessage } from "@mezon/utils";
import { useMezon } from "@mezon/transport";
import { checkMessageSendingAction } from "@mezon/store";
import { ApiInviteUserRes, ApiLinkInviteUser } from "vendors/mezon-js/packages/mezon-js/dist/api.gen";
// @deprecated

export function useChatDirect(directMessageID: string | undefined) {
    const friends = useSelector(selectAllFriends);
    const listDM = useSelector(selectAllDirectMessages);
    const { clientRef, sessionRef, socketRef, channelRef } = useMezon();
    const { userProfile } = useSelector(selectAllAccount);

    //sendMessage Direct Actions
    const dispatch = useAppDispatch();
    const sendDirectMessage = React.useCallback(
        async (message: IMessage) => {
            // TODO: send message to server using nakama client
            const session = sessionRef.current;
            const client = clientRef.current;
            const socket = socketRef.current;
            const channel = channelRef.current;
            const currentClanId = "093b8667-1ce3-4982-9140-790dfebcf3c9";

            console.log("client", client);
            console.log("session", session);
            console.log("socker", socket);
            console.log("channel", channel);
            console.log("currentClan", currentClanId);

            if (!client || !session || !socket || !channel || !currentClanId) {
                console.log(client, session, socket, channel, currentClanId);
                throw new Error("Client is not initialized");
            }

            const payload = {
                ...message,
                id: Math.random().toString(),
                date: new Date().toLocaleString(),
                user: {
                    name: userProfile?.user?.display_name || "",
                    username: userProfile?.user?.username || "",
                    id: userProfile?.user?.id || "idUser",
                    avatarSm: userProfile?.user?.avatar_url || "",
                },
            };
            if (!payload.channel_id) {
                payload.channel_id = directMessageID || "";
            }
            const ack = await socket.writeChatMessage("", channel.id, payload);
            ack && dispatch(checkMessageSendingAction());
        },
        [sessionRef, clientRef, socketRef, channelRef, userProfile?.user?.display_name, userProfile?.user?.username, userProfile?.user?.id, userProfile?.user?.avatar_url, dispatch, directMessageID],
    );

    return useMemo(
        () => ({
            friends,
            listDM,
            sendDirectMessage,
        }),
        [friends, listDM, sendDirectMessage],
    );
}
