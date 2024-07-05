import { useTheme } from '@mezon/mobile-ui';
import { selectCurrentChannel } from '@mezon/store-mobile';
import { ICategoryChannel, IChannel } from '@mezon/utils';
import { memo } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { ChannelListItem } from '../ChannelListItem';
import { ChannelListSectionHeader } from '../ChannelListSectionHeader';
import { style } from './styles';

interface IChannelListSectionProps {
	data: ICategoryChannel;
	index: number;
	onPressHeader: any;
	collapseItems: any;
	onLongPressCategory: (channel: ICategoryChannel) => void;
	onPressSortChannel: (channel: ICategoryChannel) => void;
	onLongPressChannel: (channel: IChannel) => void;
}

export const ChannelListSection = memo((props: IChannelListSectionProps) => {
	
	const styles = style(useTheme().themeValue);
	const isCollapsed = props?.collapseItems?.includes?.(props?.index?.toString?.());
	const currentChanel = useSelector(selectCurrentChannel);
  if (!props?.data?.category_name?.trim()) {
    return;
  }
	return (
		<View key={Math.floor(Math.random() * 9999999).toString()} style={styles.channelListSection}>
			<ChannelListSectionHeader
				title={props.data.category_name}
				onPress={() => props?.onPressHeader?.(props?.index?.toString?.())}
				onLongPress={() => props?.onLongPressCategory(props.data)}
				onPressSortChannel={() => props?.onPressSortChannel(props?.data)}
				isCollapsed={isCollapsed}
			/>

			<View style={{ display: isCollapsed ? 'none' : 'flex' }}>
				{props.data.channels?.map((item: any, index: number) => {
					const isActive = currentChanel?.id === item.id;

					return (
						<ChannelListItem
							data={item}
							key={Math.floor(Math.random() * 9999999).toString() + index}
							isActive={isActive}
							currentChanel={currentChanel}
							onLongPress={() => {
								props?.onLongPressChannel(item);
							}}
						/>
					);
				})}
			</View>
		</View>
	);
});
