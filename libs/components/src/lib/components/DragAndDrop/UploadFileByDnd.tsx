import { useDragAndDrop, useReference } from '@mezon/core';
import { referencesActions, useAppDispatch } from '@mezon/store';
import { handleFiles } from '@mezon/utils';
import { DragEvent } from 'react';
import DragAndDropUI from './DragAndDropUI';

type FileUploadByDnDOpt = {
	currentId: string;
};

function FileUploadByDnD({ currentId }: FileUploadByDnDOpt) {
	const dispatch = useAppDispatch();
	const { setDraggingState } = useDragAndDrop();
	const { setAttachmentData } = useReference(currentId);

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
		const filesArray = Array.from(files);
		handleFiles(filesArray, setAttachmentData);
		dispatch(referencesActions.setAtachmentAfterUpload(filesArray));
	};
	return <DragAndDropUI onDragEnter={handleDragEnter} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} />;
}

export default FileUploadByDnD;
