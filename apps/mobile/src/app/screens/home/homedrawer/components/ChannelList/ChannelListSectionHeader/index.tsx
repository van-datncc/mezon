import { Icons, SortIcon } from '@mezon/mobile-components';
import { useTheme } from '@mezon/mobile-ui';
import { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { style } from './styles';

interface IChannelListSectionHeaderProps {
	title: string;
	onPress: any;
	onLongPress: () => void;
	isCollapsed: boolean;
	onPressSortChannel: () => void;
}

export const ChannelListSectionHeader = memo((props: IChannelListSectionHeaderProps) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	return (
		<TouchableOpacity
			activeOpacity={0.8}
			onPress={props?.onPress}
			onLongPress={props?.onLongPress}
			key={Math.floor(Math.random() * 9999999).toString()}
			style={styles.channelListHeader}
		>
			<View style={styles.channelListHeaderItem}>
				<Icons.ChevronSmallDownIcon width={20} height={20} style={[props?.isCollapsed && { transform: [{ rotate: '-90deg' }] }]} />
				<Text style={styles.channelListHeaderItemTitle}>{props.title}</Text>

				<TouchableOpacity onPress={props?.onPressSortChannel} style={styles.sortButton}>
					<SortIcon width={20} height={20} color={themeValue.text} />
				</TouchableOpacity>
			</View>
		</TouchableOpacity>
	);
});
