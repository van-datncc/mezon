import { useChatSending } from "@mezon/core";
import { handleUploadAttachmentMobile } from "@mezon/mobile-components";
import { referencesActions, selectCurrentChannelId, selectCurrentClanId, selectNewMesssageUpdateImage, selectPendingAttachments } from "@mezon/store";
import { useAppDispatch, useAppSelector } from "@mezon/store-mobile";
import { useMezon } from "@mezon/transport";
import { ChannelStreamMode } from "mezon-js";
import { useEffect } from "react";

export default function useUpdateAttachmentMessages() {
    const { sessionRef, clientRef } = useMezon();
    const dispatch = useAppDispatch();

    const pendingAttachments = useAppSelector(selectPendingAttachments);
    const newMessage = useAppSelector(selectNewMesssageUpdateImage);
    const currentChannelId = useAppSelector(selectCurrentChannelId);
    const currentClanId = useAppSelector(selectCurrentClanId);

    const { updateImageLinkMessage } = useChatSending({ channelId: newMessage.channel_id ?? '', mode: newMessage.mode ?? 0 });

    const session = sessionRef.current;
    const client = clientRef.current;

    useEffect(() => {
        if (client && session && pendingAttachments[currentChannelId]?.length > 0) {
            console.log(pendingAttachments);

            const promises = pendingAttachments[currentChannelId]?.map((file) =>
                handleUploadAttachmentMobile(client, session, currentClanId, currentChannelId, {
                    name: file.name,
                    path: file.path,
                    type: file.type,
                    size: file.size
                }),
            );

            Promise.all(promises)
                .then((results) => {
                    console.log(results);
                    updateImageLinkMessage(
                        newMessage.mode === ChannelStreamMode.STREAM_MODE_CHANNEL ? (currentClanId ?? '') : '0',
                        newMessage.channel_id ?? '',
                        newMessage.mode,
                        newMessage.content,
                        newMessage.message_id,
                        newMessage.mentions,
                        results,
                        undefined,
                        true,
                    );
                })
                .catch((error) => {
                    console.error('Error uploading files:', error);
                });
        }
        dispatch(referencesActions.setPendingAttachment({ channelId: '', files: [] }));
    }, [newMessage]);

    return;
}