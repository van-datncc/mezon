import { size, useTheme } from '@mezon/mobile-ui';
import { selectMemberClanByUserId2, useAppSelector } from '@mezon/store-mobile';
import MezonIconCDN from 'apps/mobile/src/app/componentUI/MezonIconCDN';
import ImageNative from 'apps/mobile/src/app/components/ImageNative';
import { IconCDN } from 'apps/mobile/src/app/constants/icon_cdn';
import React from 'react';
import { Text, View } from 'react-native';
import { style } from './JoinChannelVoiceBS.styles';

const VoiceChannelAvatar = ({ userIds }) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const members = useAppSelector((state) => (Array.isArray(userIds) ? userIds.map((id) => selectMemberClanByUserId2(state, id)) : []));

	const display = members.slice(0, 3);
	const badge = members.length > 3 ? members.length - 3 : 0;

	if (members.length === 0) {
		return <MezonIconCDN icon={IconCDN.channelVoice} width={size.s_36} height={size.s_36} color={themeValue.textStrong} />;
	}

	return (
		<View style={{ flexDirection: 'row' }}>
			{display.map((item) => (
				<View key={item.user.id} style={styles.avatarCircle}>
					<ImageNative url={item.clan_avatar} style={{ width: size.s_40, height: size.s_40 }} />
				</View>
			))}
			{badge > 0 && (
				<View style={styles.badgeContainer}>
					<Text style={styles.text}>+{badge}</Text>
				</View>
			)}
		</View>
	);
};

export default React.memo(VoiceChannelAvatar);
