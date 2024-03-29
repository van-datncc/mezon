import { ApiMessageRef } from "vendors/mezon-js/packages/mezon-js/api.gen";

type MessageReplyProps = {
	references: ApiMessageRef[] | undefined;
};

// TODO: refactor component for message lines
const MessageReply = ({ references }: MessageReplyProps) => {
	
	return (
		<div>
			
		</div>
	);
};

export default MessageReply;
