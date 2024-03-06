import { IChannelMember, IMessageWithUser } from "@mezon/utils";
import { useMessageSender } from "./useMessageSender";
import { useMessageParser } from "./useMessageParser";

type IMessageAvatarProps = {
    user?: IChannelMember | null;
    message: IMessageWithUser;
    isCombine: boolean;
}

const MessageAvatar = ({ user, message, isCombine }: IMessageAvatarProps) => {
    const { hasAvatar, avatarChar, avatarImg } = useMessageSender(user)

    const { messageHour } = useMessageParser(message)

    if (isCombine || !user) {
        return (
            <div className="w-[38px] flex items-center justify-center min-w-[38px]">
                <div className="hidden group-hover:text-zinc-400 group-hover:text-[10px] group-hover:block">
                    {messageHour}
                </div>
            </div>
        )
    }

    return (
        <div>
            {hasAvatar ? (
                <img
                    className="w-[38px] h-[38px] rounded-full object-cover min-w-[38px] min-h-[38px]"
                    src={avatarImg}
                    alt={avatarImg}
                />
            ) : (
                <div className="w-[38px] h-[38px] bg-bgDisable rounded-full flex justify-center items-center text-contentSecondary text-[16px]">
                    {avatarChar}
                </div>
            )}
        </div>
    )
}

export default MessageAvatar;