import { useTheme } from '@mezon/mobile-ui';
import { Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { style } from './styles';

interface IMezonClanAvatarProps {
	image?: string;
	alt?: string;
}

export default function MezonClanAvatar({ image, alt = 'unknown' }: IMezonClanAvatarProps) {
	const styles = style(useTheme().themeValue);

	return (
		<>
			{image ? (
				<FastImage source={{ uri: image }} resizeMode="cover" style={styles.image} />
			) : (
				<View style={styles.fakeBox}>
					<Text style={styles.altText}>{alt?.charAt(0).toUpperCase()}</Text>
				</View>
			)}
		</>
	);
}
