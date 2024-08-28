import { useChatSending } from "@mezon/core";
import { handleUploadAttachmentMobile } from "@mezon/mobile-components";
import { referencesActions, selectAttachmentByChannelId, selectCurrentChannelId, selectCurrentClanId, selectDmGroupCurrentId, selectNewMesssageUpdateImage } from "@mezon/store";
import { useAppDispatch, useAppSelector } from "@mezon/store-mobile";
import { useMezon } from "@mezon/transport";
import { EUploadingStatus, failAttachment } from "@mezon/utils";
import { ChannelStreamMode } from "mezon-js";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";

export default function useUpdateAttachmentMessages({ mode }: { mode: ChannelStreamMode }) {
    const { sessionRef, clientRef } = useMezon();
    const dispatch = useAppDispatch();

    const newMessage = useAppSelector(selectNewMesssageUpdateImage);
    const currentChannelId = useAppSelector(selectCurrentChannelId);
    const currentClanId = useAppSelector(selectCurrentClanId);
    const currentDMChannelId = useSelector(selectDmGroupCurrentId);

    const channelId = useMemo(() => {
        return mode == ChannelStreamMode.STREAM_MODE_DM
            ? currentDMChannelId || "0"
            : currentChannelId || "0"
    }, [currentChannelId, currentDMChannelId]);

    const attachmentFilteredByChannelId = useAppSelector(selectAttachmentByChannelId(channelId));

    const { updateImageLinkMessage } = useChatSending({ channelId: newMessage.channel_id ?? '', mode: newMessage.mode ?? 0 });

    const session = sessionRef.current;
    const client = clientRef.current;

    useEffect(() => {
        if (attachmentFilteredByChannelId?.messageId !== '' &&
            attachmentFilteredByChannelId !== null &&
            attachmentFilteredByChannelId.files.length > 0 &&
            client &&
            session) {

            dispatch(
                referencesActions.setAtachmentAfterUpload({
                    channelId: channelId,
                    messageId: '',
                    files: [],
                }),
            );

            const promises = attachmentFilteredByChannelId?.files?.map((file) =>
                handleUploadAttachmentMobile(client, session, currentClanId, channelId, {
                    name: file.filename,
                    path: file.url,
                    type: file.filetype,
                    size: file.size
                }),
            );

            Promise.all(promises)
                .then((results) => {
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
                .then(() => {
                    dispatch(
                        referencesActions.setUploadingStatus({
                            channelId: channelId,
                            messageId: attachmentFilteredByChannelId?.messageId ?? '',
                            statusUpload: EUploadingStatus.SUCCESSFULLY,
                            count: attachmentFilteredByChannelId?.files?.length,
                        }),
                    );
                })
                .catch((error) => {
                    updateImageLinkMessage(
                        newMessage.clan_id,
                        newMessage.channel_id ?? '',
                        newMessage.mode,
                        newMessage.content,
                        newMessage.message_id,
                        newMessage.mentions,
                        [failAttachment],
                        undefined,
                        true
                    );

                    dispatch(
                        referencesActions.setUploadingStatus({
                            channelId: channelId,
                            messageId: attachmentFilteredByChannelId?.messageId ?? '',
                            statusUpload: EUploadingStatus.ERROR,
                            count: attachmentFilteredByChannelId?.files?.length,
                        }),
                    );
                    console.error('Error uploading files:', error);
                });
        }

        dispatch(
            referencesActions.setUploadingStatus({
                channelId: channelId,
                messageId: attachmentFilteredByChannelId?.messageId ?? '',
                statusUpload: EUploadingStatus.LOADING,
                count: attachmentFilteredByChannelId?.files?.length,
            }),
        );
    }, [attachmentFilteredByChannelId?.messageId, channelId]);

    useEffect(() => {
        if (newMessage.isMe && attachmentFilteredByChannelId?.files.length > 0) {
            dispatch(
                referencesActions.updateAttachmentMessageId({
                    channelId: channelId,
                    messageId: newMessage.message_id ?? '',
                }),
            );
        }
    }, [newMessage]);

    return;
}