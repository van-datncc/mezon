import { useTheme } from '@mezon/mobile-ui';
import React from 'react';
import { View } from 'react-native';
import { style } from './JoinChannelVoiceBS.styles';
import { selectMemberClanByUserId2, useAppSelector } from '@mezon/store-mobile';
import MezonClanAvatar from 'apps/mobile/src/app/componentUI/MezonClanAvatar';

const VoiceChannelAvatar = ({ userId }) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);

	const member = useAppSelector((state) => selectMemberClanByUserId2(state, userId));

	return (
		<View style={styles.avatarCircle}>
			<MezonClanAvatar alt={member?.user?.username} image={member?.clan_avatar || member?.user?.avatar_url} lightMode />
		</View>
	);
};

export default React.memo(VoiceChannelAvatar);
