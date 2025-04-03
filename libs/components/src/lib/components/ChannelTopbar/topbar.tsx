import { usePathMatch } from '@mezon/core';
import { IChannel } from '@mezon/utils';
import { ChannelStreamMode } from 'mezon-js';
import { memo } from 'react';
import ChannelTopbar from '.';

export type ChannelTopbarProps = {
	readonly channel?: Readonly<IChannel> | null;
	isChannelVoice?: boolean;
	mode?: ChannelStreamMode;
	isMemberPath?: boolean;
	isChannelPath?: boolean;
};

const Topbar = memo(() => {
	const { isFriendPath } = usePathMatch({
		isFriendPath: `/chat/direct/friends`
	});
	return (
		<div
			className={`${isFriendPath ? 'hidden' : ''} dark:bg-bgPrimary bg-bgLightPrimary shadow-inner border-b-[1px] dark:border-bgTertiary border-bgLightTertiary max-sbm:z-20 flex h-heightTopBar p-3 min-w-0 items-center w-widthThumnailAttachment flex-shrink fixed right-0 z-10`}
		>
			<ChannelTopbar />
		</div>
	);
});

export default Topbar;
