import { useChatSending, useReference } from '@mezon/core';
import { messagesActions, referencesActions, selectNewMesssageUpdateImage, selectSendingMessageActionStatus, useAppDispatch } from '@mezon/store';
import { handleUploadFile, useMezon } from '@mezon/transport';
import { Icons } from '@mezon/ui';
import { handleFiles } from '@mezon/utils';
import { ChannelStreamMode } from 'mezon-js';
import { ApiMessageAttachment } from 'mezon-js/api.gen';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export type FileSelectionButtonProps = {
	currentClanId: string;
	currentChannelId: string;
	onFinishUpload: (attachment: ApiMessageAttachment) => void;
};
function FileSelectionButton({ currentClanId, currentChannelId, onFinishUpload }: FileSelectionButtonProps) {
	const { sessionRef, clientRef } = useMezon();
	const { setStatusLoadingAttachment } = useReference();

	const messageSendingStatus = useSelector(selectSendingMessageActionStatus);
	const dispatch = useAppDispatch();
	const session = sessionRef.current;
	const client = clientRef.current;
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const [attachmentPreview, setAttachmentPreview] = useState<ApiMessageAttachment[]>([]);

	const newMessage = useSelector(selectNewMesssageUpdateImage);
	const { updateImageLinkMessage } = useChatSending({ channelId: newMessage.channel_id ?? '', mode: newMessage.mode ?? 0 });

	useEffect(() => {
		if (attachmentPreview && attachmentPreview?.length > 0) {
			dispatch(
				referencesActions.setAttachmentData({
					channelId: currentChannelId,
					attachments: attachmentPreview ?? [],
				}),
			);
		}
	}, [attachmentPreview]);
	console.log('newMessage', newMessage);

	useEffect(() => {
		if (messageSendingStatus && attachmentPreview?.length > 0 && client && session && selectedFiles.length > 0) {
			const promises = Array.from(selectedFiles).map((file) => {
				dispatch(referencesActions.setSpinnerStatus(true));
				return handleUploadFile(client, session, currentClanId, currentChannelId, file.name, file);
			});

			Promise.all(promises).then((result) => {
				console.log('resul', result);
				console.log('newMessage', newMessage);
				updateImageLinkMessage(
					newMessage.mode === ChannelStreamMode.STREAM_MODE_CHANNEL ? (currentClanId ?? '') : '0',
					newMessage.channel_id ?? '',
					newMessage.mode,
					newMessage.content,
					newMessage.message_id ?? '',
					newMessage.mentions,
					result,
					undefined,
					true,
				);

				setStatusLoadingAttachment(false);
				dispatch(referencesActions.setSpinnerStatus(false));
				dispatch(messagesActions.setSendingMessageActionStatus(false));
			});
		}
	}, [messageSendingStatus, attachmentPreview, selectedFiles, newMessage]);

	return (
		<label className="pl-2 flex items-center h-11">
			<input
				id="preview_img"
				type="file"
				onChange={(e) => {
					if (e.target.files) {
						handleFiles(e, setAttachmentPreview);
						setSelectedFiles(Array.from(e.target.files));
					}
					e.target.value = '';
				}}
				className="w-full hidden"
				multiple
			/>
			<div className="flex flex-row h-6 w-6 items-center justify-center ml-2 mb cursor-pointer">
				<Icons.AddCircle className="w-6 h-6 dark:text-textThreadPrimary text-buttonProfile dark:hover:text-textPrimary hover:text-bgPrimary" />
			</div>
		</label>
	);
}

export default FileSelectionButton;
