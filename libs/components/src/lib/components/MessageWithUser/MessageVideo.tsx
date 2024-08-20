import { Spinner } from 'flowbite-react';
import { ApiMessageAttachment } from 'mezon-js/api.gen';

export type MessageImage = {
	readonly attachmentData: ApiMessageAttachment;
	readonly uploadingAttachment?: boolean;
};

function MessageVideo({ attachmentData, uploadingAttachment }: MessageImage) {
	return (
		<div className="relative w-full h-[200px]">
			{uploadingAttachment && (
				<div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
					<Spinner aria-label="Loading spinner" />
				</div>
			)}
			<video src={attachmentData.url} controls={true} autoPlay={false} className="w-full h-full object-cover"></video>
		</div>
	);
}

export default MessageVideo;
