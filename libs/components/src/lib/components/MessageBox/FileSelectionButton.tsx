import { useChatSending } from '@mezon/core';
import { referencesActions, selectAttachmentByChannelId, selectNewMesssageUpdateImage, useAppDispatch } from '@mezon/store';
import { handleUploadFile, useMezon } from '@mezon/transport';
import { Icons } from '@mezon/ui';
import { EUploadingStatus, failAttachment } from '@mezon/utils';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export type FileSelectionButtonProps = {
	currentClanId: string;
	currentChannelId: string;
};
type LightweightFile = {
	file: File;
	size: number;
};

function FileSelectionButton({ currentClanId, currentChannelId }: FileSelectionButtonProps) {
	const { sessionRef, clientRef } = useMezon();
	const session = sessionRef.current;
	const client = clientRef.current;
	const dispatch = useAppDispatch();
	const [files, setFiles] = useState<File[]>([]);

	const attachmentFilteredByChannelId = useSelector(selectAttachmentByChannelId(currentChannelId));

	const getFileBufferFromUrl = async (blobUrl: string): Promise<ArrayBuffer> => {
		// Fetch the Blob from the URL
		const response = await fetch(blobUrl);
		const blob = await response.blob();

		// Read the Blob as an ArrayBuffer
		return new Promise<ArrayBuffer>((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result as ArrayBuffer);
			reader.onerror = reject;
			reader.readAsArrayBuffer(blob);
		});
	};

	const createFileFromBuffer = async (fileInfo: { filename: string; filetype: string; size: number; url: string }): Promise<File> => {
		// Fetch the buffer
		const buffer = await getFileBufferFromUrl(fileInfo.url);

		// Create a Blob from the buffer
		const blob = new Blob([buffer], { type: fileInfo.filetype });

		// Create and return a File object
		return new File([blob], fileInfo.filename, { type: fileInfo.filetype });
	};

	const getBufferFromFile = async () => {
		// Filter out files with missing properties
		const validFiles = attachmentFilteredByChannelId?.files?.filter((file) => file.filename && file.filetype && file.size && file.url);

		// Map over valid files and create File objects
		const filesPromises = validFiles?.map(async (file) => {
			if (file.filename && file.filetype && file.size && file.url) {
				return createFileFromBuffer({
					filename: file.filename,
					filetype: file.filetype,
					size: file.size,
					url: file.url,
				});
			}
			// Handle cases where properties are missing
			throw new Error('File information is incomplete');
		});

		try {
			const files = await Promise.all(filesPromises);
			setFiles(files);
			return files;
		} catch (error) {
			console.error('Error creating files:', error);
			return [];
		}
	};

	console.log('getBufferFromFile', getBufferFromFile());

	const newMessage = useSelector(selectNewMesssageUpdateImage);

	const { updateImageLinkMessage } = useChatSending({ channelId: newMessage.channel_id ?? '', mode: newMessage.mode ?? 0 });

	useEffect(() => {
		if (attachmentFilteredByChannelId?.messageId !== '' && files && files.length > 0 && client && session) {
			const promises = files?.map((file) => {
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

	const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const fileArr = Array.from(e.target.files);
			// addFiles(currentChannelId, fileArr);
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
