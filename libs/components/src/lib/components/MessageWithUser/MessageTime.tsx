import { IParsedMessage } from "./useMessageParser";

type MessageTimeProps = {
    parsedMessage: IParsedMessage
}

const MessageTime = ({ parsedMessage }: MessageTimeProps) => {
    const { messageTime, isSameDay } = parsedMessage;
    if(!isSameDay) {
        // eslint-disable-next-line react/jsx-no-useless-fragment
        return <></>
    }
    return (
        <div className="flex flex-row w-full px-4 items-center py-3 text-zinc-400 text-[12px] font-[600]">
            <div className="w-full border-b-[1px] border-[#40444b] opacity-50 text-center"></div>
            <span className="text-center px-3 whitespace-nowrap">{messageTime}</span>
            <div className="w-full border-b-[1px] border-[#40444b] opacity-50 text-center"></div>
        </div>
    )
}

export default MessageTime;
