import { useTheme } from '@mezon/mobile-ui';
import { selectMemberClanByUserId } from '@mezon/store-mobile';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { style } from '../styles';

export const ReactionMember = React.memo((props: { userId: string; onSelectUserId: (userId: string) => void }) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const { userId, onSelectUserId } = props;
	const user = useSelector(selectMemberClanByUserId(userId || ''));
	const showUserInformation = () => {
		onSelectUserId(user?.user?.id);
	};

	return (
		<TouchableOpacity style={styles.memberWrapper} onPress={() => showUserInformation()}>
			<View style={styles.imageWrapper}>
				{user?.user?.avatar_url ? (
					<View>
						<Image source={{ uri: user?.user?.avatar_url }} resizeMode="cover" style={styles.image} />
					</View>
				) : (
					<View style={styles.avatarBoxDefault}>
						<Text style={styles.textAvatarBoxDefault}>{user?.user?.username?.charAt(0)?.toUpperCase()}</Text>
					</View>
				)}
			</View>
			<Text style={styles.memberName}>{user?.user?.display_name}</Text>
			<Text style={styles.mentionText}>@{user?.user?.username}</Text>
		</TouchableOpacity>
	);
});
