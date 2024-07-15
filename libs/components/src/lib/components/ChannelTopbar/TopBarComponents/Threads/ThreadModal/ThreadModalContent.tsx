import { ChannelsEntity } from '@mezon/store';
import { useMemo } from 'react';

type ThreadModalContentProps = {
	messages: any[];
	thread: ChannelsEntity;
};

type ContentProps = {
	t: string;
};

const ThreadModalContent = ({ messages, thread }: ThreadModalContentProps) => {
	const checkType = useMemo(() => typeof thread.last_sent_message?.content === 'string', [thread.last_sent_message?.content]);

	return (
		<div className="w-full overflow-x-hidden">
			<p className="text-base font-medium text-textThreadPrimary text-ellipsis whitespace-nowrap overflow-x-hidden">
				{(messages[0]?.content?.t as string) ??
					(thread.last_sent_message && checkType
						? JSON.parse(thread.last_sent_message.content || '{}').t
						: (thread.last_sent_message?.content as unknown as ContentProps).t || '')}
			</p>
		</div>
	);
};

export default ThreadModalContent;
