import { MessageWithUser, UnreadMessageBreak } from '@mezon/components';
import { useChatMessage } from '@mezon/core';
import { IMessageWithUser } from '@mezon/utils';
import * as Icons from 'libs/components/src/lib/components/Icons/index';
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
		<div className="relative group">
			<MessageWithUser
				message={mess as IMessageWithUser}
				preMessage={messPre as IMessageWithUser}
				mentions={mess.mentions}
				attachments={mess.attachments}
				references={mess.references}
			/>
			{lastSeen && <UnreadMessageBreak />}
			<div className="absolute top-0 p-0.5 rounded-md right-4 w-24 flex flex-row bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:bg-slate-800">
				<button className="h-full p-1">
					<Icons.Smile />
				</button>
			</div>
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
