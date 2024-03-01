import { ApiMessageAttachment } from "vendors/mezon-js/packages/mezon-js/dist/api.gen";

export type MessageImage = {
	content?: string;
	attachmentData: ApiMessageAttachment;
};

function MessageImage({ attachmentData }: MessageImage) {	
	return (
		<div className="break-all">
			<img className="max-w-[350px] my-2 rounded" src={attachmentData.url} alt="" />
		</div>
	);
}

export default MessageImage;
