import { notImplementForGifOrStickerSendFromPanel } from '@mezon/utils';
import { Modal, ModalBody } from 'flowbite-react';
import { ApiMessageAttachment } from 'mezon-js/api.gen';
import { useState } from 'react';

export type MessageImage = {
	content?: string;
	attachmentData: ApiMessageAttachment;
};

function MessageImage({ attachmentData }: MessageImage) {
	const [openModal, setOpenModal] = useState(false);
	const isDimensionsValid = attachmentData.height && attachmentData.width && attachmentData.height > 0 && attachmentData.width > 0;
	const checkImage = notImplementForGifOrStickerSendFromPanel(attachmentData);
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
			<Modal show={openModal} dismissible={true} onClose={() => setOpenModal(false)} className="bg-[#111111]">
				<ModalBody className="bg-transparent">
					<div className="flex justify-center items-center">
						{attachmentData.url && <img className="max-h-[80vh]" src={attachmentData.url} alt={attachmentData.url} />}
					</div>
				</ModalBody>
			</Modal>
		</>
	);
}

export default MessageImage;
