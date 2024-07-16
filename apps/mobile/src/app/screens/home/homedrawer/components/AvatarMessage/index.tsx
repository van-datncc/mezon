import { Text, useTheme } from '@mezon/mobile-ui';
import { selectMemberByUserId } from '@mezon/store';
import React from 'react';
import { Image, Pressable, View } from 'react-native';
import { useSelector } from 'react-redux';
import { style } from './styles';

export const AvatarMessage = React.memo(({ message, showUserInformation, onPress }: any) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const user = useSelector(selectMemberByUserId(message?.sender_id));

	const isCombine = !message?.isStartedMessageGroup;
	const isShowInfoUser = !isCombine || !!(!!message?.references?.length && !!user);

	if (isShowInfoUser || showUserInformation) {
		return (
			<Pressable onPress={onPress} style={styles.wrapperAvatar}>
				{user?.user?.avatar_url ? (
					<Image source={{ uri: user?.user?.avatar_url }} style={styles.logoUser} />
				) : (
					<View style={styles.avatarMessageBoxDefault}>
						<Text style={styles.textAvatarMessageBoxDefault}>{user?.user?.username?.charAt(0)?.toUpperCase() || 'A'}</Text>
					</View>
				)}
			</Pressable>
		);
	}

	return <View style={styles.wrapperAvatarCombine} />;
});
