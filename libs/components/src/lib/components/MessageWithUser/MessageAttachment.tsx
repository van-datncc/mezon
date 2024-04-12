import { ApiMessageAttachment } from 'vendors/mezon-js/packages/mezon-js/api.gen';

type MessageAttachmentProps = {
	attachments: ApiMessageAttachment[] | undefined;
};

// TODO: refactor component for message lines
const MessageAttachment = ({ attachments }: MessageAttachmentProps) => {
	return <div></div>;
};

export default MessageAttachment;
