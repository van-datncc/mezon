import { ApiMessageAttachment } from "vendors/mezon-js/packages/mezon-js/dist/api.gen";

export type MessageImage = {
	content?: string;
	attachmentData: ApiMessageAttachment;
};

function MessageLinkFile({ attachmentData }: MessageImage) {
	const handleDownload = () => {
		window.open(attachmentData.url);
	};
	return (
		<>
			<div className="break-all cursor-pointer text-blue-500 underline" onClick={handleDownload}>
				{attachmentData.url}
			</div>
		</>
	);
}

export default MessageLinkFile;
