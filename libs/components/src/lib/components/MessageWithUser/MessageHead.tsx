import { IMessageSender } from "./useMessageSender";
import { IParsedMessage } from "./useMessageParser";

type IMessageHeadProps = {
    sender: IMessageSender;
    parsedMessage: IParsedMessage
}

const MessageHead = ({ sender, parsedMessage }: IMessageHeadProps) => {
    const { username } = sender;
    const { messageTime, isCombine } = parsedMessage;

    if (isCombine) {
        // eslint-disable-next-line react/jsx-no-useless-fragment
        return <></>
    }

    return (
        <div className="flex-row items-center w-full gap-4 flex">
            <div className="font-['Manrope'] text-sm text-white font-[600] text-[15px] tracking-wider">
                {username}
            </div>
            <div className=" text-zinc-400 font-['Manrope'] text-[10px]">{messageTime}</div>
        </div>
    )
}

export default MessageHead