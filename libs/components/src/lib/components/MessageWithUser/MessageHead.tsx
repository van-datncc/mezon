import { IChannelMember, IMessageWithUser } from '@mezon/utils';
import { useMessageParser } from './useMessageParser';
import { useMessageSender } from './useMessageSender';

type IMessageHeadProps = {
	user?: IChannelMember | null;
	message: IMessageWithUser;
	isCombine: boolean;
	replyMessageStatus?: boolean;
};

const MessageHead = ({ user, message, isCombine, replyMessageStatus }: IMessageHeadProps) => {
	const { username } = useMessageSender(user);
	const { messageTime } = useMessageParser(message);

	if (isCombine && !replyMessageStatus) {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	return (
		<div className="flex-row items-center w-full gap-4 flex">
			<div className="font-['Manrope'] text-sm text-white font-[600] text-[15px] tracking-wider cursor-pointer break-all">{username}</div>
			<div className=" text-zinc-400 font-['Manrope'] text-[10px] cursor-default">{messageTime}</div>
		</div>
	);
};

export default MessageHead;
