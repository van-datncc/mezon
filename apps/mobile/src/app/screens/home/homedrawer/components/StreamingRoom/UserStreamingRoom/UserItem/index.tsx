import { size, useTheme } from '@mezon/mobile-ui';
import { selectMemberClanByUserId } from '@mezon/store';
import { useAppSelector } from '@mezon/store-mobile';
import React from 'react';
import { MezonAvatar } from '../../../../../../../componentUI';
import { useMixImageColor } from '../../../../../../../hooks/useMixImageColor';
import { style } from '../UserStreamingRoom.styles';

function UserItem(user) {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const { color } = useMixImageColor(user.user.avatar);
	const userStream = useAppSelector(selectMemberClanByUserId(user?.user?.user_id ?? ''));

	console.log('userStream: ', userStream);
	console.log('user: ', user);

	return (
		// <View style={{ ...styles.userContainer, backgroundColor: color }}>
		<MezonAvatar width={size.s_60} height={size.s_60} username={userStream?.user?.username} avatarUrl={userStream?.user?.avatar_url} />
		/* <View style={styles.userNameBox}>
				<Icons.SpeakerMuteIcon width={size.s_14} height={size.s_14} />
				<Text style={styles.userText}>{user.user.name}</Text>
			</View> */
		// </View>
	);
}

export default React.memo(UserItem);
