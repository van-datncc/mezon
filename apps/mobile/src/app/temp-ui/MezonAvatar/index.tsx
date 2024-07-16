import { Block } from '@mezon/mobile-ui';
import React from 'react';
import { Image, Text, View } from 'react-native';
import { styles as s } from './styles';

interface IMezonAvatarProps {
	avatarUrl: string;
	userName: string;
	width?: number;
	height?: number;
	userStatus?: boolean;
	isBorderBoxImage?: boolean;
}
const MezonAvatar = React.memo((props: IMezonAvatarProps) => {
	const { avatarUrl, userName, width = 40, height = 40, userStatus, isBorderBoxImage } = props;
	return (
		<View style={[s.containerItem, { height, width }]}>
			<View style={[s.boxImage, { height, width }, isBorderBoxImage && s.borderBoxImage]}>
				{avatarUrl ? (
					<Image
						style={[s.image]}
						source={{
							uri: avatarUrl,
						}}
					/>
				) : (
					<Block style={s.avatarMessageBoxDefault}>
						<Text style={s.textAvatarMessageBoxDefault}>{userName?.charAt(0)?.toUpperCase() || 'A'}</Text>
					</Block>
				)}
			</View>
			{userStatus && <View style={[s.statusCircle, userStatus ? s.online : s.offline]} />}
		</View>
	);
});

export default MezonAvatar;
