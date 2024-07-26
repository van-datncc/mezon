import { ChannelsEntity, selectChannelsEntities } from '@mezon/store';
import { ChannelType } from 'mezon-js';
import { useSelector } from 'react-redux';

type IChannelHashtag = {
	channelHashtagId: string;
};
export const ChannelHashtag = ({ channelHashtagId }: IChannelHashtag) => {
	const channelsEntities = useSelector(selectChannelsEntities);

	const getChannelById = (channelHashtagId: string): ChannelsEntity => {
		const channel = channelsEntities?.[channelHashtagId];
		if (channel) {
			return channel;
		} else {
			return {
				id: channelHashtagId,
				channel_label: 'unknown',
			};
		}
	};

	const channel = getChannelById(channelHashtagId);
	
	const dataPress = `${channel.type}_${channel.channel_id}_${channel.clan_id}_${channel.status}_${channel.meeting_code}`;

	if (channel.type === ChannelType.CHANNEL_TYPE_VOICE) {
		return `[${channel.channel_label}](##voice${JSON.stringify(dataPress)})`;
	}
	return channel['channel_id'] ? `[#${channel.channel_label}](#${JSON.stringify(dataPress)})` : `[\\# ${channel.channel_label}](#${JSON.stringify(dataPress)})`;
};
