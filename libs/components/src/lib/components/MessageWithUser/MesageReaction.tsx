import { ApiMessageReaction } from "vendors/mezon-js/packages/mezon-js/api.gen";

type MessageReactionProps = {
	reactions: ApiMessageReaction[] | undefined;
};

// TODO: refactor component for message lines
const MessageReaction = ({ reactions }: MessageReactionProps) => {
	
	return (
		<div>
			
		</div>
	);
};

export default MessageReaction;
