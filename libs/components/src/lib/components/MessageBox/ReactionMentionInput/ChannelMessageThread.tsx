import { IMessageWithUser } from '@mezon/utils';
import MessageWithUser from '../../MessageWithUser';
import { useMessageSender } from '../../MessageWithUser/useMessageSender';
import { useSelector } from 'react-redux';
import { selectMemberByUserId } from '@mezon/store';
import MessageContent from '../../MessageWithUser/MessageContent';
import { useMessageParser } from '../../MessageWithUser/useMessageParser';
import { ChannelStreamMode } from 'mezon-js';

type ChannelMessageThreadProps = {
	message: IMessageWithUser;
};

const ChannelMessageThread = (props: ChannelMessageThreadProps) => {
	const { message } = props;
    const user = useSelector(selectMemberByUserId(message.sender_id));
	return (
		<div className='mb-3'>
			<MessageWithUser
					message={message}
					user={user}
					isMessNotifyMention={true}
					mode={ChannelStreamMode.STREAM_MODE_CHANNEL}
					newMessage={message.content.t}
					isMention={true}
				/>
		</div>
	);
};

export default ChannelMessageThread;
