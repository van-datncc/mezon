import { useChatSending, useFileContext } from '@mezon/core';
import { referencesActions, selectAttachmentByChannelId, selectNewMesssageUpdateImage, useAppDispatch } from '@mezon/store';
import { handleUploadFile, useMezon } from '@mezon/transport';
import { Icons } from '@mezon/ui';
import { EUploadingStatus, failAttachment } from '@mezon/utils';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export type FileSelectionButtonProps = {
	currentClanId: string;
	currentChannelId: string;
};

function FileSelectionButton({ currentClanId, currentChannelId }: FileSelectionButtonProps) {
	const { sessionRef, clientRef } = useMezon();

	const dispatch = useAppDispatch();
	const session = sessionRef.current;
	const client = clientRef.current;
	const attachmentFilteredByChannelId = useSelector(selectAttachmentByChannelId(currentChannelId));
	const newMessage = useSelector(selectNewMesssageUpdateImage);

	const { updateImageLinkMessage } = useChatSending({ channelId: newMessage.channel_id ?? '', mode: newMessage.mode ?? 0 });

	const { getFiles, addFiles, resetFiles } = useFileContext();

	useEffect(() => {
		if (newMessage.message_id === '') return;
		if (attachmentFilteredByChannelId?.messageId !== '' && getFiles(currentChannelId) && client && session) {
			const promises = getFiles(currentChannelId)?.map((file) => {
				return handleUploadFile(client, session, currentClanId, currentChannelId, file.name, file);
			});
			Promise.all(promises)
				.then((results) => {
					updateImageLinkMessage(
						newMessage.clan_id,
						newMessage.channel_id ?? '',
						newMessage.mode,
						newMessage.content,
						newMessage.message_id,
						newMessage.mentions,
						results,
						undefined,
						false,
					);
				})
				.then(() => {
					dispatch(
						referencesActions.setUploadingStatus({
							channelId: currentChannelId,
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
						false,
					);
					dispatch(
						referencesActions.setUploadingStatus({
							channelId: currentChannelId,
							messageId: attachmentFilteredByChannelId?.messageId ?? '',
							statusUpload: EUploadingStatus.ERROR,
							count: attachmentFilteredByChannelId?.files?.length,
						}),
					);
					console.error('Error uploading files:', error);
				});
			dispatch(
				referencesActions.setUploadingStatus({
					channelId: currentChannelId,
					messageId: attachmentFilteredByChannelId?.messageId ?? '',
					statusUpload: EUploadingStatus.LOADING,
					count: attachmentFilteredByChannelId?.files?.length,
				}),
			);
			resetFiles(currentChannelId);
			dispatch(
				referencesActions.setAtachmentAfterUpload({
					channelId: currentChannelId,
					messageId: '',
					files: [],
				}),
			);
		}
	}, [attachmentFilteredByChannelId?.messageId, currentChannelId]);

	useEffect(() => {
		if (newMessage.isMe && attachmentFilteredByChannelId?.files.length > 0) {
			dispatch(
				referencesActions.updateAttachmentMessageId({
					channelId: currentChannelId,
					messageId: newMessage.message_id ?? '',
				}),
			);
		}
	}, [newMessage]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const fileArr = Array.from(e.target.files);
			addFiles(currentChannelId, fileArr);
			dispatch(
				referencesActions.setAtachmentAfterUpload({
					channelId: currentChannelId,
					messageId: '',
					files: fileArr.map((file) => ({
						filename: file.name,
						filetype: file.type,
						size: file.size,
						url: URL.createObjectURL(file),
					})),
				}),
			),
				(e.target.value = '');
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
