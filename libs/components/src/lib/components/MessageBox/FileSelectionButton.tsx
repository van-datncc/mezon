import { useChatSending } from '@mezon/core';
import { referencesActions, selectFilteredAttachments, selectNewMesssageUpdateImage, useAppDispatch } from '@mezon/store';
import { handleUploadFile, useMezon } from '@mezon/transport';
import { Icons } from '@mezon/ui';
import { ApiMessageAttachment } from 'mezon-js/api.gen';
import { useEffect } from 'react';
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
	const attachmentFilteredByChannelId = useSelector(selectFilteredAttachments(currentChannelId));
	const newMessage = useSelector(selectNewMesssageUpdateImage);

	const { updateImageLinkMessage } = useChatSending({ channelId: newMessage.channel_id ?? '', mode: newMessage.mode ?? 0 });

	useEffect(() => {
		if (attachmentFilteredByChannelId.length > 0 && attachmentFilteredByChannelId[0]?.messageId !== '' && client && session) {
			const promises = attachmentFilteredByChannelId[0]?.files.map((file) => {
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
						true,
					);
				})
				.then(() => {
					dispatch(
						referencesActions.setUploadingStatus({
							channelId: currentChannelId,
							messageId: attachmentFilteredByChannelId[0]?.messageId ?? '',
							hasSpinning: false,
							count: attachmentFilteredByChannelId[0]?.files?.length ?? 0,
						}),
					);
				})
				.catch((error) => {
					console.error('Error uploading files:', error);
				});
			dispatch(
				referencesActions.setUploadingStatus({
					channelId: currentChannelId,
					messageId: attachmentFilteredByChannelId[0]?.messageId ?? '',
					hasSpinning: true,
					count: attachmentFilteredByChannelId[0]?.files?.length,
				}),
			);
			dispatch(
				referencesActions.setAtachmentAfterUpload({
					channelId: currentChannelId,
					messageId: '',
					files: [],
				}),
			);
		}
	}, [attachmentFilteredByChannelId[0]?.messageId]);

	useEffect(() => {
		if (newMessage.isMe && attachmentFilteredByChannelId.length > 0 && attachmentFilteredByChannelId[0]?.files.length > 0) {
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
			dispatch(
				referencesActions.setAtachmentAfterUpload({
					channelId: currentChannelId,
					messageId: '',
					files: Array.from(e.target.files),
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
