import { useTheme } from '@mezon/mobile-ui';
import { selectMemberByUserId } from '@mezon/store-mobile';
import { MezonAvatar } from 'apps/mobile/src/app/temp-ui';
import React from 'react';
import { Pressable, View } from 'react-native';
import { useSelector } from 'react-redux';
import { style } from './styles';

interface IProps {
	onPress: () => void;
	id: string;
	defaultAvatar: string;
	username: string;
	isShow: boolean;
}
export const AvatarMessage = React.memo(({ isShow, onPress, id, username, defaultAvatar }: IProps) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const userById = useSelector(selectMemberByUserId(id || ''));

	if (isShow) {
		return (
			<Pressable onPress={onPress} style={styles.wrapperAvatar}>
				<MezonAvatar
					avatarUrl={defaultAvatar || userById?.user?.avatar_url}
					username={username}
				/>
			</Pressable>
		);
	}

	return <View style={styles.wrapperAvatarCombine} />;
});
