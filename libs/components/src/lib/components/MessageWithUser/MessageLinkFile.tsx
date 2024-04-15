import { RenderAttachmentThumbnail } from '@mezon/ui';
import { ApiMessageAttachment } from 'mezon-js/api.gen';

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

	const hideTheInformationFile =
		attachmentData.filetype !== 'image/gif' &&
		attachmentData.filetype !== 'image/png' &&
		attachmentData.filetype !== 'image/jpeg' &&
		attachmentData.filetype !== 'video/mp4';

	return (
		<div className="break-all cursor-default gap-3 flex mt-[10px]">
			<div>{thumbnailAttachment}</div>
			{hideTheInformationFile && (
				<div className=" cursor-pointer " onClick={handleDownload}>
					<p className="text-blue-500 underline">{attachmentData.filename}</p>
					<p>size: {formatFileSize(attachmentData.size || 0)}</p>
				</div>
			)}
		</div>
	);
}

export default MessageLinkFile;
