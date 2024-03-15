import { Modal, ModalBody } from "flowbite-react";
import { useState } from "react";
import { ApiMessageAttachment } from "vendors/mezon-js/packages/mezon-js/dist/api.gen";

export type MessageImage = {
	content?: string;
	attachmentData: ApiMessageAttachment;
};

function MessageVideo({ attachmentData }: MessageImage) {
	return (
		<>	
			<div className="">
				<div className="">
					<video src={attachmentData.url} controls={true} autoPlay={false} className="h-[400px]"></video>
				</div>
			</div>
		</>
	);
}

export default MessageVideo;
