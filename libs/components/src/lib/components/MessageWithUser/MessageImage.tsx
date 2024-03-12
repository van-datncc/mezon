import { Modal, ModalBody } from 'flowbite-react';
import { useState } from 'react';
import { ApiMessageAttachment } from 'vendors/mezon-js/packages/mezon-js/dist/api.gen';

export type MessageImage = {
	content?: string;
	attachmentData: ApiMessageAttachment;
};

function MessageImage({ attachmentData }: MessageImage) {
	const [openModal, setOpenModal] = useState(false);
	return (
		<>
			<div className="break-all">
				<img
					className="max-w-[80%] max-h-[60vh] object-cover my-2 rounded cursor-pointer"
					src={attachmentData.url}
					alt=""
					onClick={() => setOpenModal(true)}
				/>
			</div>
			<Modal show={openModal} dismissible={true} onClose={() => setOpenModal(false)} className="bg-[#111111]">
				<ModalBody className="bg-transparent">
					<div className="flex justify-center items-center">
						{attachmentData.url && <img className="max-h-[80vh]" src={attachmentData.url} alt="" />}
					</div>
				</ModalBody>
			</Modal>
		</>
	);
}

export default MessageImage;
