import { selectCurrentChannel } from '@mezon/store';
import { DragEvent } from 'react';
import { useSelector } from 'react-redux';
import DocumentThumbnail from './DocumentThumbnail';

type DragAndDropUIProps = {
	channelID?: string;
	userID?: string;
	onDragEnter: (e: DragEvent<HTMLElement>) => void;
	// onDragOver: (e: DragEvent<HTMLElement>) => void;
	onDragLeave: (e: DragEvent<HTMLElement>) => void;
	onDrop: (e: DragEvent<HTMLElement>) => void;
};

function DragAndDropUI({ channelID, onDragEnter,
    //  onDragOver,
      onDragLeave, onDrop }: DragAndDropUIProps) {
	const currentChannel = useSelector(selectCurrentChannel);

	return (
		<div
			id="form-file-upload"
			onDragEnter={onDragEnter}
			// onDragOver={onDragOver}
			onDragLeave={onDragLeave}
			onDrop={onDrop}
			className="w-screen h-screen flex justify-center items-center bg-black bg-opacity-90 absolute top-0 left-0 z-10"
		>
			{/* <div className="w-[25rem] h-[15rem] bg-[#5865F2] flex flex-row justify-center items-center rounded-lg relative border -z-10">
				<div className="absolute -top-12 flex flex-col justify-center -z-10">
					<DocumentThumbnail />
					<div className="flex flex-col justify-center">
						<div className=" w-full flex flex-row justify-center">
							<h1 className=" font-bold text-2xl mt-[1rem] text-center">Upload To #{currentChannel?.channel_label}</h1>
						</div>
						<div className=" w-full flex flex-row justify-center text-center mt-[1rem]">
							<p className="w-[85%]">You can add comments before uploading. Hold shift to upload directly.</p>
						</div>
					</div>
				</div>

				<div className="border-2 border-white w-[90%] h-[86%] rounded-lg border-dashed"></div>
			</div>{' '} */}
		</div>
	);
}

export default DragAndDropUI;
