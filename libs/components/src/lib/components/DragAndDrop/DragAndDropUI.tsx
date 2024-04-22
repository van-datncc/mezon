import { useDragAndDrop } from '@mezon/core';
import { selectCurrentChannel } from '@mezon/store';
import { DragEvent, useState } from 'react';
import { useSelector } from 'react-redux';

type DragAndDropUIProps = {
	channelID?: string;
	userID?: string;
	onDragEnter: (e: DragEvent<HTMLElement>) => void;
	onDragOver: (e: DragEvent<HTMLElement>) => void;
	onDragLeave: (e: DragEvent<HTMLElement>) => void;
	onDrop: (e: DragEvent<HTMLElement>) => void;
	onLeaveChildDiv: (e: DragEvent<HTMLElement>) => void;
	onOverChildDiv: (e: DragEvent<HTMLElement>) => void;
};

function DragAndDropUI({ channelID, onDragEnter, onDragOver, onDragLeave, onDrop, onLeaveChildDiv, onOverChildDiv }: DragAndDropUIProps) {
	const currentChannel = useSelector(selectCurrentChannel);
	const { draggingState, setDraggingState } = useDragAndDrop();

	const [notLeave, setNotLeave] = useState(false);
	const [isOverChild, setIsOverChild] = useState(false);
	return (
		// <div>
		// 	<div
		// 		id="form-file-upload"
		// 		onDragEnter={() => {
		// 			setDraggingState(true);
		// 		}} // onDragOver={onDragOver}
		// 		onDragLeave={() => {
		// 			if (notLeave) {
		// 				setDraggingState(true);
		// 			} else if (!notLeave) {
		// 				setDraggingState(false);
		// 			}
		// 		}}
		// 		onDrop={onDrop}
		// 		className="w-screen h-screen flex justify-center items-center bg-black  opacity-90 absolute top-0 left-0 z-30"
		// 	>
		// 		<div
		// 			onDragEnter={() => {
		// 				setDraggingState(true);
		// 				setNotLeave(true);
		// 			}}
		// 			onDragOver={() => {
		// 				setDraggingState(true);
		// 			}}
		// 			onDragLeave={() => {
		// 				setDraggingState(true);
		// 			}}
		// 			className="w-[25rem] h-[15rem] bg-[#5865F2] flex flex-row justify-center  items-center rounded-lg z-50 absolute"
		// 		></div>{' '}
		// 	</div>
		// </div>
		<div>
			<div
				id="form-file-upload"
				onDragEnter={() => {
					setDraggingState(true);
				}}
				onDragLeave={() => {
					if (!isOverChild) {
						// Nếu không ở trên div con, setDraggingState(false)
						setDraggingState(false);
					}
					setNotLeave(false);
				}}
				onDrop={onDrop}
				className="w-screen h-screen flex justify-center items-center bg-black  opacity-90 absolute top-0 left-0 z-30"
			>
				<div
					onDragEnter={() => {
						setIsOverChild(true); // Đang ở trên div con
						setDraggingState(true);
						setNotLeave(true);
					}}
					onDragOver={() => {
						setIsOverChild(true);
						setDraggingState(true);
					}}
					onDragLeave={() => {
						setIsOverChild(false); // Rời khỏi div con
					}}
					className="w-[25rem] h-[15rem] bg-[#5865F2] flex flex-row justify-center  items-center rounded-lg z-50 absolute"
				></div>{' '}
			</div>
		</div>
	);
}

export default DragAndDropUI;

{
	/* <div onDragEnter={onDragEnter} onDragLeave={onDragLeave} className="absolute -top-12 flex flex-col justify-center -z-10"> */
}
{
	/* <DocumentThumbnail /> */
}
{
	/* <div className="flex flex-col justify-center">
						<div className=" w-full flex flex-row justify-center">
							<h1 className=" font-bold text-2xl mt-[1rem] text-center">Upload To #{currentChannel?.channel_label}</h1>
						</div>
						<div className=" w-full flex flex-row justify-center text-center mt-[1rem]">
							<p className="w-[85%]">You can add comments before uploading. Hold shift to upload directly.</p>
						</div>
					</div> */
}
{
	/* </div> */
}

{
	/* <div className="border-2 border-white w-[90%] h-[86%] rounded-lg border-dashed"></div> */
}
