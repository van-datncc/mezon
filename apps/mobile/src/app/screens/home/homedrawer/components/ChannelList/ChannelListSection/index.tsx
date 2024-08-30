import { useTheme } from '@mezon/mobile-ui';
import { selectCurrentChannelId } from '@mezon/store-mobile';
import { ChannelThreads, ICategoryChannel } from '@mezon/utils';
import { memo, useCallback, useState } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { ChannelListItem } from '../ChannelListItem';
import ChannelListSectionHeader from '../ChannelListSectionHeader';
import { style } from './styles';

interface IChannelListSectionProps {
	data: ICategoryChannel;
	onLongPressCategory: (channel: ICategoryChannel) => void;
	onPressSortChannel: (channel: ICategoryChannel) => void;
	onLongPressChannel: (channel: ChannelThreads) => void;
	onLongPressThread: (thread: ChannelThreads) => void;
}

const ChannelListSection = memo(
	({ data, onLongPressCategory, onLongPressChannel, onPressSortChannel, onLongPressThread }: IChannelListSectionProps) => {
		const styles = style(useTheme().themeValue);
		const [isCollapsed, setIsCollapsed] = useState(false);
		const currentChanelId = useSelector(selectCurrentChannelId);

		const toggleCollapse = useCallback(() => {
			setIsCollapsed(!isCollapsed);
		}, [isCollapsed, setIsCollapsed]);

		const onLongPressHeader = useCallback(() => {
			onLongPressCategory(data);
		}, [data, onLongPressCategory]);

		const onSortChannel = useCallback(() => {
			onPressSortChannel(data);
		}, [data, onPressSortChannel]);

		if (!data?.category_name?.trim()) {
			return;
		}

		return (
			<View style={styles.channelListSection}>
				<ChannelListSectionHeader
					title={data.category_name}
					onPress={toggleCollapse}
					onLongPress={onLongPressHeader}
					onPressSortChannel={onSortChannel}
					isCollapsed={isCollapsed}
				/>

				<View style={{ display: isCollapsed ? 'none' : 'flex' }}>
					{data.channels?.map((item: any, index: number) => {
						const isActive = currentChanelId === item.id;

						return (
							<ChannelListItem
								data={item}
								key={`${item.id}_channel_item` + index}
								isActive={isActive}
								onLongPress={() => {
									onLongPressChannel(item);
								}}
								onLongPressThread={onLongPressThread}
							/>
						);
					})}
				</View>
			</View>
		);
	},
);
export default ChannelListSection;
