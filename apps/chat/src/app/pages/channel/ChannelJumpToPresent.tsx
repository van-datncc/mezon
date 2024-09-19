import { messagesActions, useAppDispatch } from '@mezon/store';
import classNames from 'classnames';
import { useCallback } from 'react';

type ChannelTypingProps = {
	channelId: string;
	className?: string;
};

export function ChannelJumpToPresent({ channelId, className }: ChannelTypingProps) {
	const dispatch = useAppDispatch();

	const handleJumpToPresent = useCallback(() => {
		// Jump to present
		dispatch(messagesActions.fetchMessages({ channelId, isFetchingLatestMessages: true, noCache: true }));
		dispatch(messagesActions.setIdMessageToJump(null));
	}, [channelId, dispatch]);

	return (
		<div className={classNames('w-full h-full cursor-pointer dark:text-white text-black', className)} onClick={handleJumpToPresent}>
			Viewing older messages (Click to jump to present)
		</div>
	);
}
