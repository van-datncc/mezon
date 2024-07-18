import { Block, useTheme } from '@mezon/mobile-ui';
import React from 'react';
import { Image, Text, View } from 'react-native';
import { style } from './styles';

interface IMezonAvatarProps {
	avatarUrl: string;
	userName: string;
	width?: number;
	height?: number;
	userStatus?: boolean;
	isBorderBoxImage?: boolean;
}
const MezonAvatar = React.memo((props: IMezonAvatarProps) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const { avatarUrl, userName, width = 40, height = 40, userStatus, isBorderBoxImage } = props;
	return (
		<View style={[styles.containerItem, { height, width }]}>
			<View style={[styles.boxImage, { height, width }, isBorderBoxImage && styles.borderBoxImage]}>
				{avatarUrl ? (
					<Image
						style={[styles.image]}
						source={{
							uri: avatarUrl,
						}}
					/>
				) : (
					<Block style={styles.avatarMessageBoxDefault}>
						<Text style={styles.textAvatarMessageBoxDefault}>{userName?.charAt(0)?.toUpperCase() || 'A'}</Text>
					</Block>
				)}
			</View>
			{userStatus && <View style={[styles.statusCircle, userStatus ? styles.online : styles.offline]} />}
		</View>
	);
});

export default MezonAvatar;
