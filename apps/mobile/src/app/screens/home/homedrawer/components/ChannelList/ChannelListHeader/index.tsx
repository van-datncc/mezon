import { MenuHorizontalIcon, VerifyIcon } from '@mezon/mobile-components';
import { ClansEntity } from '@mezon/store-mobile';
import { Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { style } from './styles';
import { baseColor, useTheme } from '@mezon/mobile-ui';
interface IProps {
	onPress: () => void;
	clan: ClansEntity;
}

export default function ChannelListHeader({ onPress, clan }: IProps) {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	function handlePress() {
		onPress && onPress();
	}

	return (
		<View style={[styles.container, { height: clan?.banner ? 150 : 70 }]}>
			{clan?.banner && <FastImage source={{ uri: clan?.banner }} style={{ flex: 1 }} resizeMode="cover" />}

			<TouchableOpacity activeOpacity={0.8} onPress={handlePress} style={styles.listHeader}>
				<View style={styles.titleNameWrapper}>
					<Text numberOfLines={1} style={styles.titleServer}>
						{clan?.clan_name}
					</Text>
					<VerifyIcon width={18} height={18} color={baseColor.blurple} />
				</View>

				<TouchableOpacity
					style={[styles.actions, { backgroundColor: themeValue.primary }]}
					onPress={handlePress}>
					<MenuHorizontalIcon height={18} width={18} color={themeValue.text} />
				</TouchableOpacity>
			</TouchableOpacity>
		</View>
	);
}
