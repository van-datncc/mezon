import { useChatTypings } from '@mezon/core';
import { useMemo } from 'react';

type ChannelTypingProps = {
	channelId: string;
	mode: number;
};

export function ChannelTyping({ channelId, mode }: ChannelTypingProps) {
	const { typingUsers } = useChatTypings({ channelId, mode });

	const typingLabel = useMemo(() => {
		if (typingUsers.length === 1) {
			return (
				<>
					<span className='dark:text-textDarkTheme text-textPrimaryLight text-xs font-semibold [&:nth-child(2)]:delay-500 [&:nth-child(1)]:delay-1000'>
						<span className='up-and-down-animated absolute left-0'>•</span>
						<span className='up-and-down-animated absolute left-2'>•</span>
						<span className='up-and-down-animated absolute left-3'>•</span>
					</span>

					<span className='dark:text-textDarkTheme text-textPrimaryLight text-xs font-semibold mr-[2px] '>

						{`${typingUsers[0].clan_nick || typingUsers[0].user?.display_name || typingUsers[0].user?.username}`}
					</span>
					is typing...
				</>
			)
		}
		if (typingUsers.length > 1) {
			return 'Several people are typing...';
		}
		return '';
	}, [typingUsers]);

	return <div className="text-xs dark:text-bgIconDark text-textPrimaryLight absolute bottom-0 left-4 pl-4 cursor-default">{typingLabel}</div>;
}
