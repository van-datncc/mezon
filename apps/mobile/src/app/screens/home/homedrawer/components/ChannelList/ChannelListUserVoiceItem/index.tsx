import { AvatarUser } from '@mezon/mobile-components';
import { selectMemberByDisplayName } from '@mezon/store-mobile';
import { IChannelMember } from '@mezon/utils';
import React from 'react';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import MezonAvatar from '../../../../../../temp-ui/MezonAvatar';
import { style } from './styles';
import { useTheme } from '@mezon/mobile-ui';

interface IUserVoiceProps {
	userVoice: IChannelMember;
}
const UserVoiceItem = React.memo(({ userVoice }: IUserVoiceProps) => {
	const styles = style(useTheme().themeValue);
	const userVoiceDisplay = useSelector(selectMemberByDisplayName(userVoice?.participant || ''));

	return (
		<View style={styles.userVoiceWrapper}>
			{userVoiceDisplay ? (
				<MezonAvatar width={18} height={18} userName={userVoiceDisplay?.user?.username} avatarUrl={userVoiceDisplay?.user?.avatar_url} />
			) : (
				<AvatarUser width={18} height={18} />
			)}
			{userVoiceDisplay ? (
				<Text style={styles.userVoiceName}>{userVoiceDisplay?.user?.username}</Text>
			) : (
				<Text style={styles.userVoiceName}>{userVoice?.participant} (guest)</Text>
			)}
		</View>
	);
});

export default UserVoiceItem;
