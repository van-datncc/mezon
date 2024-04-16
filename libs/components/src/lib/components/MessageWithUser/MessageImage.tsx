import { notImplementForGifOrStickerSendFromPanel } from '@mezon/utils';
import { Modal, ModalBody } from 'flowbite-react';
import { ApiMessageAttachment } from 'mezon-js/api.gen';
import { useEffect, useState } from 'react';

export type MessageImage = {
	content?: string;
	attachmentData: ApiMessageAttachment;
};

function MessageImage({ attachmentData }: MessageImage) {
	const [openModal, setOpenModal] = useState(false);
	const [scale, setScale] = useState(1);
	const isDimensionsValid = attachmentData.height && attachmentData.width && attachmentData.height > 0 && attachmentData.width > 0;
	const checkImage = notImplementForGifOrStickerSendFromPanel(attachmentData);

	const handleWheel = (event: any) => {
		const deltaY = event.deltaY;
		setScale((prevScale) => {
			let newScale = prevScale;
			if (deltaY > 0) {
				newScale = Math.max(1, prevScale - 0.05);
			} else {
				newScale = Math.min(5, prevScale + 0.05);
			}
			return newScale;
		});
	};

	useEffect(() => {
		setScale(1);
	}, [openModal]);

	return (
		<>
			<div className="break-all">
				<img
					className={`max-w-[100%] max-h-[30vh] object-cover my-2 rounded ${!isDimensionsValid && !checkImage ? `cursor-pointer` : `cursor-default`}`}
					src={attachmentData.url?.toString()}
					alt={attachmentData.url}
					onClick={() => {
						if (!isDimensionsValid && !checkImage) {
							setOpenModal(true);
						} else return;
					}}
					style={{
						width: isDimensionsValid ? `${attachmentData.width}%` : undefined,
						height: isDimensionsValid ? `${attachmentData.height}%` : undefined,
					}}
				/>
			</div>

			<Modal
				show={openModal}
				dismissible={true}
				onClose={() => setOpenModal(false)}
				className="bg-[#111111] bg-opacity-80 modalImage hide-scrollbar"
				onWheel={handleWheel}
				style={{ transform: `scale(${scale})`, transition: 'transform 0.5s ease' }}
			>
				<ModalBody className="bg-transparent p-0 hide-scrollbar">
					<div className="flex justify-center items-center hide-scrollbar">
						{attachmentData.url && <img className="max-h-[80vh]" src={attachmentData.url} alt={attachmentData.url} />}
					</div>
				</ModalBody>
			</Modal>
		</>
	);
}

export default MessageImage;
