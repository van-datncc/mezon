import { Icons } from '@mezon/mobile-components';
import { size, useTheme } from '@mezon/mobile-ui';
import React from 'react';
import { Text, View } from 'react-native';
import { MezonAvatar } from '../../../../../../../componentUI';
import { useMixImageColor } from '../../../../../../../hooks/useMixImageColor';
import { style } from '../UserStreamingRoom.styles';

export default function UserItem(user) {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const { color } = useMixImageColor(user.user.avatar);

	return (
		<View style={{ ...styles.userContainer, backgroundColor: color }}>
			<MezonAvatar width={size.s_60} height={size.s_60} username={user.user.name} avatarUrl={user.user.avatar} />
			<View style={styles.userNameBox}>
				<Icons.SpeakerMuteIcon width={size.s_14} height={size.s_14} />
				<Text style={styles.userText}>{user.user.name}</Text>
			</View>
		</View>
	);
}
