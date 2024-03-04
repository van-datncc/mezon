import { IChannelMember, IMessageWithUser } from "@mezon/utils";
import { useMessageSender } from "./useMessageSender";
import { useMessageParser } from "./useMessageParser";

type IMessageHeadProps = {
    user?: IChannelMember | null;
    message: IMessageWithUser;
    isCombine: boolean;
}

const  MessageHead = ({ user, message, isCombine }: IMessageHeadProps) => {
    const { username } = useMessageSender(user)
    const { messageTime } = useMessageParser(message)
    
    if(isCombine) {
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