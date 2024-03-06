import { IChannelMember, IMessageWithUser } from "@mezon/utils";
import { useMessageParser } from "./useMessageParser";
import MessageImage from "./MessageImage";
import MessageLinkFile from "./MessageLinkFile";
import MessageLine from "./MesageLine";

type IMessageContentProps = {
    user?: IChannelMember | null;
    message: IMessageWithUser;
    isCombine: boolean;
}

const MessageContent = ({ user, message, isCombine }: IMessageContentProps) => {
    const { attachments, lines } = useMessageParser(message);

    if (attachments && attachments.length > 0 && attachments[0].filetype?.indexOf('image') !== -1) {
        // TODO: render multiple attachments
        return <MessageImage attachmentData={attachments[0]} />;
    }

    if (attachments && attachments.length > 0 && attachments[0].filetype?.indexOf('image') === -1) {
        return <MessageLinkFile attachmentData={attachments[0]} />;
    }

    return (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <>
            {lines?.map((line: string, index: number) =>
                <MessageLine line={line} key={index} />
            )}
        </>
    );
}

export default MessageContent;
