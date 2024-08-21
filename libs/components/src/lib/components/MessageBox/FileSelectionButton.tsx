import { useChatSending } from '@mezon/core';
import { referencesActions, selectAttachmentAfterUpload, selectNewMesssageUpdateImage, useAppDispatch } from '@mezon/store';
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

	const dispatch = useAppDispatch();
	const session = sessionRef.current;
	const client = clientRef.current;
	const attachmentAfterUpload = useSelector(selectAttachmentAfterUpload);
	console.log('attachmentAfterUpload: ', attachmentAfterUpload);
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

	useEffect(() => {
		console.log(attachmentAfterUpload);
		if (client && session && attachmentAfterUpload.length > 0) {
			const promises = attachmentAfterUpload.map((file) => handleUploadFile(client, session, currentClanId, currentChannelId, file.name, file));

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
				.catch((error) => {
					console.error('Error uploading files:', error);
				});
		}
		dispatch(referencesActions.removeAttachmentAfterUpload([]));
	}, [newMessage]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			handleFiles(Array.from(e.target.files), setAttachmentPreview);
			dispatch(referencesActions.setAtachmentAfterUpload(Array.from(e.target.files)));
			e.target.value = '';
		}
	};

	return (
		<label className="pl-2 flex items-center h-11">
			<input id="preview_img" type="file" onChange={handleChange} className="w-full hidden" multiple />
			<div className="flex flex-row h-6 w-6 items-center justify-center ml-2 mb cursor-pointer">
				<Icons.AddCircle className="w-6 h-6 dark:text-textThreadPrimary text-buttonProfile dark:hover:text-textPrimary hover:text-bgPrimary" />
			</div>
		</label>
	);
}

export default FileSelectionButton;
