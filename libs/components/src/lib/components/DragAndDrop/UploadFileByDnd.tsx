import { useClans, useDragAndDrop, useReference } from '@mezon/core';
import { selectCurrentChannelId } from '@mezon/store';
import { handleUploadFile, useMezon } from '@mezon/transport';
import { DragEvent } from 'react';
import { useSelector } from 'react-redux';
import { Icons } from '../../components';

function FileUploadByDnD() {
	const { draggingState, setDraggingState } = useDragAndDrop();
	const { attachmentDataRef, setAttachmentData } = useReference();
	const { sessionRef, clientRef } = useMezon();
	const { currentClanId } = useClans();
	const currentChannelId = useSelector(selectCurrentChannelId);

	const handleDragEnter = (e: DragEvent<HTMLElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setDraggingState(true);
	};

	const handleDragOver = (e: DragEvent<HTMLElement>) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const handleDragLeave = (e: DragEvent<HTMLElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setDraggingState(false);
	};

	const handleDrop = (e: DragEvent<HTMLElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setDraggingState(false);
		const files = e.dataTransfer.files;
		const session = sessionRef.current;
		const client = clientRef.current;
		if (!files || !client || !session || !currentChannelId) {
			throw new Error('Client or files are not initialized');
		}

		const promises = Array.from(files).map((file) => {
			const fullfilename = `${currentClanId}/${currentChannelId}`.replace(/-/g, '_') + '/' + file.name;
			return handleUploadFile(client, session, fullfilename, file);
		});
		Promise.all(promises).then((attachments) => {
			attachments.forEach((attachment) => setAttachmentData(attachment));
		});
	};

	return (
		<div
			id="form-file-upload"
			onDragEnter={handleDragEnter}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
			className="w-screen h-screen flex justify-center items-center bg-black bg-opacity-90 absolute top-0 left-0 z-50"
		>
			<Icons.WaitingUpload />
		</div>
	);
}

export default FileUploadByDnD;
