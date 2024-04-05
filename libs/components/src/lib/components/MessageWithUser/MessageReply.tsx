import { selectMemberByUserId, selectReferenceMessage } from '@mezon/store';
import { IMessageWithUser } from '@mezon/utils';
import { useSelector } from 'react-redux';
import * as Icons from '../Icons/index';

type MessageReplyProps = {
	message: IMessageWithUser;
};

// TODO: refactor component for message lines
const MessageReply = ({ message }: MessageReplyProps) => {
	// const senderMessage = useSelector(
	// 	selectMemberByUserId((message.references && message.references[0].message_sender_id && message?.references[0].message_sender_id) || ''),
	// );

	console.log(message);
	const refMessage = useSelector(selectReferenceMessage);
	console.log(refMessage);

	return (
		<div>
			{message.references && message?.references.length > 0 && (
				<div className="rounded flex flex-row gap-1 items-center justify-start w-fit text-[14px] ml-5 mb-[-5px] mt-1 replyMessage">
					<Icons.ReplyCorner />
					<div className="flex flex-row gap-1 mb-2 pr-12">
						<div className="w-5 h-5">
							{/* <img
								className="rounded-full min-w-5 max-h-5 object-cover"
								src={senderMessage?.user && senderMessage.user?.avatar_url}
								alt={senderMessage?.user && senderMessage.user?.avatar_url}
							></img> */}
						</div>
						<p className="gap-1 flex">
							<span className=" text-[#84ADFF] font-bold hover:underline cursor-pointer tracking-wide">
								{/* @{senderMessage.user?.username}{' '} */}
							</span>
							<span className="text-[13px] font-manrope hover:text-white cursor-pointer text-[#A8BAB8] one-line break-all">
								{message?.content.t}
							</span>
						</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default MessageReply;
