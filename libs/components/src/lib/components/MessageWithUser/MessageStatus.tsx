
import * as Icons from '../Icons/index';
import { IParsedMessage } from './useMessageParser';
import { IMessageSender } from './useMessageSender';

type IMessageStatusProps = {
    sender: IMessageSender;
    parsedMessage: IParsedMessage
}

const MessageStatus = ({ parsedMessage }: IMessageStatusProps) => {
    const { isCombine } = parsedMessage;

    return (
        <div
            className={`absolute top-[100] right-2  flex-row items-center gap-x-1 text-xs text-gray-600 ${isCombine ? 'hidden' : 'flex'}`}
        >
            <Icons.Sent />
        </div>
    )
}

export default MessageStatus;
