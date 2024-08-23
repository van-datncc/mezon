import { Spinner } from 'flowbite-react';
import { ApiMessageAttachment } from 'mezon-js/api.gen';
import { useMemo } from 'react';

export type MessageImage = {
	readonly attachmentData: ApiMessageAttachment;
	readonly hideSpinning?: boolean;
};

function MessageVideo({ attachmentData, hideSpinning }: MessageImage) {
	const isUploadSuccessfully = useMemo(() => {
		return attachmentData.size && attachmentData.size > 0;
	}, [attachmentData.size]);
	return (
		<div className="relative w-full h-[200px]">
			{!isUploadSuccessfully && !hideSpinning && (
				<div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
					<Spinner aria-label="Loading spinner" />
				</div>
			)}
			<video src={attachmentData.url} controls={true} autoPlay={false} className="w-full h-full object-cover"></video>
		</div>
	);
}

export default MessageVideo;
