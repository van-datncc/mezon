import { IChannelMember } from '@mezon/utils';
import React from 'react';
import { View } from 'react-native';
import UserVoiceItem from '../ChannelListUserVoiceItem';
import { memo } from 'react';

interface IUserListVoiceChannelProps {
	userListVoice: IChannelMember[];
}

export default memo(function ChannelListUserVoice({ userListVoice }: IUserListVoiceChannelProps) {
	return (
		<View>
			{
				userListVoice?.length
					? userListVoice?.map((userVoice) => <UserVoiceItem userVoice={userVoice} />)
					: null
			}
		</View>
	)
});
