import { Block, size, useTheme } from '@mezon/mobile-ui';
import { Image, StyleProp, TextStyle, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Images from '../../../assets/Images';
import { style } from './styles';

interface IMezonClanAvatarProps {
	image?: string;
	alt?: string;
	defaultColor?: string;
	textStyle?: StyleProp<TextStyle>;
	noDefaultText?: boolean;
	lightMode?: boolean;
}

export default function MezonClanAvatar({
	image,
	alt = 'anonymous',
	defaultColor,
	textStyle,
	noDefaultText = false,
	lightMode
}: IMezonClanAvatarProps) {
	const { themeValue } = useTheme();

	const styles = style(themeValue);

	return (
		<Block>
			{image ? (
				<FastImage source={{ uri: image }} resizeMode="cover" style={styles.image} />
			) : (
				<View style={[styles.fakeBox, { backgroundColor: defaultColor || themeValue.colorAvatarDefault }]}>
					{!noDefaultText ? (
						<Image source={Images.ANONYMOUS_AVATAR} style={{ width: size.s_40, height: size.s_40, borderRadius: size.s_40 }} />
					) : null}
				</View>
			)}
		</Block>
	);
}
