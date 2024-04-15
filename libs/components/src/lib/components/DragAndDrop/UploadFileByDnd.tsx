import { useDragAndDrop } from '@mezon/core';
import { useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';

const fileTypes = ['JPG', 'PNG', 'GIF'];

function FileUploadByDnD() {
	const { draggingState, setDraggingState } = useDragAndDrop();
	const [file, setFile] = useState(null);
	const handleChange = (file: any) => {
		setFile(file);
	};
	const getDraggingState = (dragging: boolean) => {
		setDraggingState(dragging);
	};

	return (
		<>
			<FileUploader
				multiple={true}
				handleChange={handleChange}
				name="file"
				types={fileTypes}
				onDraggingStateChange={getDraggingState}
				dropMessageStyle={{ backgroundColor: 'red' }}
			/>
		</>
	);
}

export default FileUploadByDnD;
