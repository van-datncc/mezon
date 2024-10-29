import { ChannelsEntity } from '@mezon/store-mobile';
import { ChannelStreamMode, ChannelType } from 'mezon-js';
import ChannelMessages from './ChannelMessages';

type ChannelMediaProps = {
	currentChannel: ChannelsEntity | null;
};

export const ChannelMedia = ({ currentChannel }: ChannelMediaProps) => {
	if (
		currentChannel?.type === ChannelType.CHANNEL_TYPE_TEXT ||
		currentChannel?.type === ChannelType.CHANNEL_TYPE_THREAD ||
		currentChannel?.type === ChannelType.CHANNEL_TYPE_STREAMING
	) {
		const mode =
			currentChannel?.type === ChannelType.CHANNEL_TYPE_THREAD ? ChannelStreamMode.STREAM_MODE_THREAD : ChannelStreamMode.STREAM_MODE_CHANNEL;
		return (
			<ChannelMessages
				key={currentChannel.id}
				clanId={currentChannel?.clan_id || ''}
				channelId={currentChannel?.id}
				channelLabel={currentChannel.channel_label}
				type={currentChannel?.type}
				mode={mode}
			/>
		);
	}
	return <ChannelMessages.Skeleton />;
};
