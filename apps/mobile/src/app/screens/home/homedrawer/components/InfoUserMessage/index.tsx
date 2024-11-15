import { Text, useTheme } from '@mezon/mobile-ui';
import { selectAllRolesClan } from '@mezon/store-mobile';
import { DEFAULT_MESSAGE_CREATOR_NAME_DISPLAY_COLOR, convertTimeString } from '@mezon/utils';
import { ChannelStreamMode } from 'mezon-js';
import React, { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { style } from './styles';

interface IProps {
	onPress: () => void;
	senderDisplayName: string;
	createTime: string;
	isShow: boolean;
	messageSenderId: string;
	mode: number;
}
export const InfoUserMessage = React.memo(({ createTime, isShow, onPress, senderDisplayName, messageSenderId, mode }: IProps) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);

	const rolesClan = useSelector(selectAllRolesClan);

	const userRolesClan = useMemo(() => {
		const activeRoles = rolesClan?.filter((role) => role?.role_user_list?.role_users?.some((user) => user?.id === messageSenderId)) || [];

		const highestPermissionRole = activeRoles?.reduce((highest, role) => {
			return role?.max_level_permission > (highest?.max_level_permission || 0) ? role : highest;
		}, null);

		return {
			highestPermissionRoleColor: highestPermissionRole?.color || activeRoles[0]?.color || DEFAULT_MESSAGE_CREATOR_NAME_DISPLAY_COLOR
		};
	}, [messageSenderId, rolesClan]);

	const colorSenderName = useMemo(() => {
		return mode === ChannelStreamMode.STREAM_MODE_CHANNEL || mode === ChannelStreamMode.STREAM_MODE_THREAD
			? userRolesClan.highestPermissionRoleColor
			: DEFAULT_MESSAGE_CREATOR_NAME_DISPLAY_COLOR;
	}, [userRolesClan.highestPermissionRoleColor, mode]);

	if (isShow) {
		return (
			<TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.messageBoxTop}>
				<Text style={{ ...styles.userNameMessageBox, color: colorSenderName }}>{senderDisplayName}</Text>
				<Text style={styles.dateMessageBox}>{createTime ? convertTimeString(createTime) : ''}</Text>
			</TouchableOpacity>
		);
	}

	return <View style={styles.wrapperAvatarCombine} />;
});
