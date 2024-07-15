import { IChannelMember } from '@mezon/utils';
import React, { memo } from 'react';
import { View } from 'react-native';
import UserVoiceItem from '../ChannelListUserVoiceItem';

interface IUserListVoiceChannelProps {
	userListVoice: IChannelMember[];
}

export default memo(function ChannelListUserVoice({ userListVoice }: IUserListVoiceChannelProps) {
	return (
		<View>
			{userListVoice?.length
				? userListVoice?.map((userVoice, index) => (
						<UserVoiceItem key={`${index}_voice_item_${userVoice?.participant}`} userVoice={userVoice} />
					))
				: null}
		</View>
	);
});
