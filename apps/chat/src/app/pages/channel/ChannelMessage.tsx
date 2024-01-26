import { MessageWithUser } from '@mezon/components'
import { IMessage, IMessageWithUser } from '@mezon/utils'
import { format } from 'date-fns';

type MessageProps = {
    message: IMessageWithUser
}
const formatDate = (dateString?: string | undefined) => {
    if (!dateString) {
      return '';
    }
    const date = new Date(dateString);
    return format(date, 'MMMM dd, yyyy');
  };
export function ChannelMessage(props: MessageProps) {
    const { message } = props
    
    return (
        <div>
            <MessageWithUser message={message} />
            {message.lastSeen && (
               <div itemID="last-seen-message" className="divider__8cf56 hasContent__8519e divider_b9338f isUnread__6f880 hasContent_fea365" id="---new-messages-bar" role="separator" aria-label="June 27, 2023">
                <span className="content_d67847">{formatDate(message.create_time)}</span>
               <span className="unreadPill__715fc endCap__95d53">
                <svg className="unreadPillCap__96b8d" aria-hidden="true" role="img" width="8" height="13" viewBox="0 0 8 13">
                    <path className="unreadPillCapStroke__12c0b" stroke="currentColor" fill="transparent" d="M8.16639 0.5H9C10.933 0.5 12.5 2.067 12.5 4V9C12.5 10.933 10.933 12.5 9 12.5H8.16639C7.23921 12.5 6.34992 12.1321 5.69373 11.4771L0.707739 6.5L5.69373 1.52292C6.34992 0.86789 7.23921 0.5 8.16639 0.5Z">
                    </path>
                </svg>new</span>
                </div>
            )}
        </div>
    )
}
