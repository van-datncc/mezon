import { IMessageSender } from "./useMessageSender";
import { IParsedMessage } from "./useMessageParser";

type IMessageAvatarProps = {
    sender: IMessageSender;
    parsedMessage: IParsedMessage
}

const MessageAvatar = ({ sender, parsedMessage }: IMessageAvatarProps) => {
    const { hasAvatar, avatarChar, avatarImg } = sender

    const { messageHour, isCombine } = parsedMessage;

    if (isCombine) {
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