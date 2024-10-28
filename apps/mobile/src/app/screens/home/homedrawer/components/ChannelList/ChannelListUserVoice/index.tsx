import { size } from '@mezon/mobile-ui';
import { selectStreamMembersByChannelId, selectVoiceChannelMembersByChannelId } from '@mezon/store-mobile';
import React, { memo } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import UserVoiceItem from '../ChannelListUserVoiceItem';

interface IUserListVoiceChannelProps {
	channelId: string;
	isCategoryExpanded: boolean;
}

export default memo(function ChannelListUserVoice({ channelId, isCategoryExpanded }: IUserListVoiceChannelProps) {
	const voiceChannelMember = useSelector(selectVoiceChannelMembersByChannelId(channelId));
	const streamChannelMembers = useSelector(selectStreamMembersByChannelId(channelId));

	return (
		<View style={[!isCategoryExpanded && { flexDirection: 'row', marginLeft: size.s_30 }]}>
			{voiceChannelMember?.length
				? voiceChannelMember?.map((userVoice, index) => (
						<UserVoiceItem
							key={`${index}_voice_item_${userVoice?.participant}`}
							index={index}
							userVoice={userVoice}
							isCategoryExpanded={isCategoryExpanded}
							totalMembers={voiceChannelMember?.length}
						/>
					))
				: null}
			{streamChannelMembers?.length
				? streamChannelMembers?.map((userStream, index) => (
						<UserVoiceItem
							key={`${index}_stream_item_${userStream?.participant}`}
							index={index}
							userVoice={userStream}
							isCategoryExpanded={isCategoryExpanded}
							totalMembers={streamChannelMembers?.length}
						/>
					))
				: null}
		</View>
	);
});
