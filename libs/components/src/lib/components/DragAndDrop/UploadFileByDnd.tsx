import { useClans, useDragAndDrop, useReference } from '@mezon/core';
import { selectCurrentChannelId } from '@mezon/store';
import { handleUploadFile, useMezon } from '@mezon/transport';
import { DragEvent } from 'react';
import { useSelector } from 'react-redux';
import DragAndDropUI from './DragAndDropUI';

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

	// const handleDragOver = (e: DragEvent<HTMLElement>) => {
	// 	e.preventDefault();
	// 	e.stopPropagation();
	// 	// setDraggingState(true);

	// };

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
		<>
			<DragAndDropUI onDragEnter={handleDragEnter}
			//  onDragOver={handleDragOver} 
			 onDragLeave={handleDragLeave} onDrop={handleDrop} />
		</>
	);
}

export default FileUploadByDnD;
