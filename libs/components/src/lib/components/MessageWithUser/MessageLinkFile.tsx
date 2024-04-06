import { ApiMessageAttachment } from "vendors/mezon-js/packages/mezon-js/dist/api.gen";

export type MessageImage = {
	content?: string;
	attachmentData: ApiMessageAttachment;
};
function formatFileSize(bytes:number) {
    if (bytes >= 1000000) {
        return (bytes / 1000000).toFixed(1) + ' MB';
    } else if (bytes >= 1000) {
        return (bytes / 1000).toFixed(1) + ' kB';
    } else {
        return bytes + ' bytes';
    }
}

function MessageLinkFile({ attachmentData }: MessageImage) {
	const handleDownload = () => {
		window.open(attachmentData.url);
	};
	return (
		<div className="break-all cursor-pointer  flex mt-[10px]" onClick={handleDownload}>
			{attachmentData.filetype === "application/pdf" ? (<img src="/assets/images/pdficon.png"className="w-[60px] mr-[10px]" alt="imageTextChat"></img>):(null)}
			{attachmentData.filetype === "text/plain" ? (<img src="/assets/images/text.png"className="w-[60px] mr-[10px]" alt="imageTextChat"></img>):(null)}
			{attachmentData.filetype === "application/vnd.openxmlformats-officedocument.presentationml.presentation" ? (<img src="/assets/images/pptfile.png"className="w-[60px] mr-[10px]" alt="imageTextChat"></img>):(null)}
			<div className="">
				<p className="text-blue-500 underline">
					{attachmentData.filename}
				</p>
				<p>
					size: {formatFileSize(attachmentData.size || 0)}
				</p>
			</div>
		</div>
	);
}

export default MessageLinkFile;
