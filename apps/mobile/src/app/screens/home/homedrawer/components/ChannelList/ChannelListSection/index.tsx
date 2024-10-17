import { size, useTheme } from '@mezon/mobile-ui';
import {
	categoriesActions,
	selectCategoryExpandStateByCategoryId,
	selectCategoryIdSortChannel,
	selectChannelMetaEntities,
	selectCurrentChannel,
	useAppDispatch
} from '@mezon/store-mobile';
import { ChannelThreads, ICategoryChannel, IChannel } from '@mezon/utils';
import { ChannelType } from 'mezon-js';
import { memo, useCallback } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { ChannelsPositionRef } from '../../../ChannelList';
import { ChannelListItem, IThreadActiveType } from '../ChannelListItem';
import ChannelListSectionHeader from '../ChannelListSectionHeader';
import { style } from './styles';

interface IChannelListSectionProps {
	data: ICategoryChannel;
	onLongPressCategory: (channel: ICategoryChannel) => void;
	onLongPressChannel: (channel: ChannelThreads) => void;
	onLongPressThread: (thread: ChannelThreads) => void;
	channelsPositionRef: ChannelsPositionRef;
	onPressCollapse: (isCollapse: boolean) => void;
}

const ChannelListSection = memo(
	({ data, onLongPressCategory, onLongPressChannel, onLongPressThread, channelsPositionRef, onPressCollapse }: IChannelListSectionProps) => {
		const styles = style(useTheme().themeValue);
		const categoryIdSortChannel = useSelector(selectCategoryIdSortChannel);
		const dispatch = useAppDispatch();
		const categoryExpandState = useSelector(selectCategoryExpandStateByCategoryId(data?.clan_id || '', data?.category_id));
		const allChannelMetaEntities = useSelector(selectChannelMetaEntities);
		const currentChannel = useSelector(selectCurrentChannel);

		const handleOnPressSortChannel = useCallback(() => {
			dispatch(
				categoriesActions.setCategoryIdSortChannel({
					isSortChannelByCategoryId: !categoryIdSortChannel[data?.category_id],
					categoryId: data?.category_id
				})
			);
		}, [categoryIdSortChannel, dispatch]);

		const toggleCollapse = useCallback(
			(category: ICategoryChannel) => {
				const payload = {
					clanId: category.clan_id || '',
					categoryId: category.id,
					expandState: !categoryExpandState
				};
				dispatch(categoriesActions.setCategoryExpandState(payload));
				onPressCollapse(categoryExpandState);
			},
			[dispatch, onPressCollapse, categoryExpandState]
		);

		const onLongPressHeader = useCallback(() => {
			onLongPressCategory(data);
		}, [data, onLongPressCategory]);

		if (!data?.category_name?.trim()) {
			return;
		}

		const handlePositionChannel = (item, event) => {
			const { y } = event.nativeEvent.layout;
			let threadY = 0;
			const heightChannel = y;
			if (item?.threads?.length) {
				const threadActives = item?.threads.filter((thread: { active: IThreadActiveType }) => thread?.active === IThreadActiveType.Active);
				threadActives?.forEach((thread) => {
					const threadHeight = size.s_36;
					threadY += threadHeight;
					channelsPositionRef.current = {
						...channelsPositionRef.current,
						[`${thread.id}`]: {
							cateId: item?.category_id,
							height: y + threadY
						}
					};
				});
			}
			channelsPositionRef.current = {
				...channelsPositionRef.current,
				[`${item.id}`]: {
					height: heightChannel
				}
			};
		};

		const isUnreadChannel = (channelId: string) => {
			return allChannelMetaEntities[channelId]?.lastSeenTimestamp < allChannelMetaEntities[channelId]?.lastSentTimestamp;
		};
		return (
			<View style={styles.channelListSection}>
				<ChannelListSectionHeader
					title={data.category_name}
					onPress={toggleCollapse}
					onLongPress={onLongPressHeader}
					onPressSortChannel={handleOnPressSortChannel}
					isCollapsed={categoryExpandState}
					category={data}
				/>

				{data?.channels?.map((item: IChannel, index: number) => {
					const shouldRender =
						categoryExpandState ||
						isUnreadChannel(item?.id) ||
						item.type === ChannelType.CHANNEL_TYPE_VOICE ||
						item?.id === currentChannel?.channel_id;
					if (shouldRender) {
						return (
							<View key={`${item?.id}`} onLayout={(event) => handlePositionChannel(item, event)}>
								<ChannelListItem
									data={item}
									key={`${item.id}_channel_item` + index}
									onLongPress={() => {
										onLongPressChannel(item);
									}}
									onLongPressThread={onLongPressThread}
								/>
							</View>
						);
					}
					return null;
				})}
			</View>
		);
	}
);
export default ChannelListSection;
