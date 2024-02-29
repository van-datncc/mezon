import { MessageWithUser, UnreadMessageBreak } from '@mezon/components';
import { useChatMessage } from '@mezon/core';
import { IMessageWithUser } from '@mezon/utils';
import { useEffect, useMemo } from 'react';

type MessageProps = {
	message: IMessageWithUser;
	preMessage?: IMessageWithUser;
	lastSeen?: boolean;
};

export function ChannelMessage(props: MessageProps) {
	const { message, lastSeen, preMessage } = props;
	const { markMessageAsSeen } = useChatMessage(message.id);

	useEffect(() => {
		markMessageAsSeen(message);
	}, [markMessageAsSeen, message]);

	// TODO: recheck this
	const mess = useMemo(() => {
		if (typeof message.content === 'object' && typeof (message.content as any).id === 'string') {
			return message.content;
		}
		return message;
	}, [message]);

	const messPre = useMemo(() => {
		if (preMessage && typeof preMessage.content === 'object' && typeof (preMessage.content as any).id === 'string') {
			return preMessage.content;
		}
		return preMessage;
	}, [preMessage]);

	return (
		<div>
			<MessageWithUser message={mess as IMessageWithUser} 
				preMessage={messPre as IMessageWithUser}
				mentions={mess.mentions}
				attachments={mess.attachments}
				references={mess.references}
			/>
			{lastSeen && <UnreadMessageBreak />}
		</div>
	);
}

ChannelMessage.Skeleton = () => {
	return (
		<div>
			<MessageWithUser.Skeleton />
		</div>
	);
};
