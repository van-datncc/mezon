import { IChannelMember, IMessageWithUser } from '@mezon/utils';
import { useMessageParser } from './useMessageParser';
import { useMessageSender } from './useMessageSender';

type IMessageAvatarProps = {
	user?: IChannelMember | null;
	message: IMessageWithUser;
	isCombine: boolean;
	isReply?: boolean;
};

const MessageAvatar = ({ user, message, isCombine, isReply }: IMessageAvatarProps) => {
	const { hasAvatar, avatarChar, avatarImg } = useMessageSender(user);

	const { messageHour } = useMessageParser(message);

	if ((!isReply && isCombine) || (!isReply && !user)) {
		return (
			<div className="w-[38px] flex items-center justify-center min-w-[38px]">
				<div className="hidden group-hover:text-zinc-400 group-hover:text-[10px] group-hover:block cursor-default">{messageHour}</div>
			</div>
		);
	}

	return (
		<div>
			{hasAvatar ? (
				<img className="w-[38px] h-[38px] rounded-full object-cover min-w-[38px] min-h-[38px] cursor-pointer" src={avatarImg} alt={avatarImg} />
			) : (
				<div className="w-[38px] h-[38px] bg-bgDisable rounded-full flex justify-center items-center text-contentSecondary text-[16px]">
					{avatarChar}
				</div>
			)}
		</div>
	);
};

export default MessageAvatar;
