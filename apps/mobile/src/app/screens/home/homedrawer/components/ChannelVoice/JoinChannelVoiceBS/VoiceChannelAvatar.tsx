import { size, useTheme } from '@mezon/mobile-ui';
import ImageNative from 'apps/mobile/src/app/components/ImageNative';
import React from 'react';
import { View } from 'react-native';
import { style } from './JoinChannelVoiceBS.styles';
import { selectMemberClanByUserId2, useAppSelector } from '@mezon/store-mobile';

const VoiceChannelAvatar = ({ userId }) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);

	const member = useAppSelector((state) => selectMemberClanByUserId2(state, userId));

	return (
		<View style={styles.avatarCircle}>
			<ImageNative url={member?.clan_avatar} style={{ width: size.s_40, height: size.s_40 }} />
		</View>
	);
};

export default React.memo(VoiceChannelAvatar);
