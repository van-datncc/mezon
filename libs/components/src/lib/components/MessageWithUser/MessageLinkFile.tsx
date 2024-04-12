import { RenderAttachmentThumbnail } from '@mezon/ui';
import { ApiMessageAttachment } from 'vendors/mezon-js/packages/mezon-js/dist/api.gen';

export type MessageImage = {
	content?: string;
	attachmentData: ApiMessageAttachment;
};
function formatFileSize(bytes: number) {
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
	const thumbnailAttachment = RenderAttachmentThumbnail(attachmentData, 'w-12 h-12');

	return (
		<div className="break-all cursor-pointer gap-3 flex mt-[10px]" onClick={handleDownload}>
			<div>{thumbnailAttachment}</div>
			<div className="">
				<p className="text-blue-500 underline">{attachmentData.filename}</p>
				<p>size: {formatFileSize(attachmentData.size || 0)}</p>
			</div>
		</div>
	);
}

export default MessageLinkFile;
