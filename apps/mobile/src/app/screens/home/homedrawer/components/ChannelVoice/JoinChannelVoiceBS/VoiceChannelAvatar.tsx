import { size, useTheme } from '@mezon/mobile-ui';
import ImageNative from 'apps/mobile/src/app/components/ImageNative';
import React from 'react';
import { View } from 'react-native';
import { style } from './JoinChannelVoiceBS.styles';

const VoiceChannelAvatar = ({ userId, member }) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);

	return (
		<View key={userId} style={styles.avatarCircle}>
			<ImageNative url={member?.clan_avatar} style={{ width: size.s_40, height: size.s_40 }} />
		</View>
	);
};

export default React.memo(VoiceChannelAvatar);
