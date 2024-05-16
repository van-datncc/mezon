import { Icons, MessageVideo } from '@mezon/components';
import { ApiMessageAttachment } from 'mezon-js/api.gen';
import { typeFileImage, typeFileVideo, typeFormats } from './TypeFormats';

export const RenderAttachmentThumbnail = (attachment: ApiMessageAttachment, size?: string, pos?: string) => {
	const fileType = attachment.filetype;

	const renderIcon = typeFormats.find((typeFormat) => typeFormat.type === fileType);

	const hasFileImage = fileType && typeFileImage.includes(fileType);

	const hasFileVideo = fileType && typeFileVideo.includes(fileType);

	return (
		<div>
			{hasFileImage && <img key="image-thumbnail" src={attachment.url} role="presentation" className="w-[174px]" alt={attachment.url} />}

			{hasFileVideo && (
				<div className={`w-35 h-32 flex flex-row justify-center items-center relative mt-[-10px]`}>
					<MessageVideo attachmentData={attachment} />
				</div>
			)}

			{renderIcon && <renderIcon.icon defaultSize={size} />}

			{!hasFileImage && !hasFileVideo && !renderIcon && <Icons.EmptyType defaultSize={size} />}
		</div>
	);
};
