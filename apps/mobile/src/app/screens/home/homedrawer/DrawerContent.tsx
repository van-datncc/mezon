import { useCategorizedAllChannels } from '@mezon/core';
import { useTheme } from '@mezon/mobile-ui';
import { selectIsShowEmptyCategory } from '@mezon/store-mobile';
import { ICategoryChannel, IChannel } from '@mezon/utils';
import React, { useMemo, useRef } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import BackNativeListener from './BackNativeListener';
import ChannelList from './ChannelList';
import ProfileBar from './ProfileBar';
import ServerList from './ServerList';
import UserEmptyClan from './UserEmptyClan';
import { style } from './styles';

const ChannelListWrapper = React.memo(() => {
	const categorizedChannelsRaw = useCategorizedAllChannels();
	const isShowEmptyCategory = useSelector(selectIsShowEmptyCategory);
	const previousCategorizedChannels = useRef(null);

	const categorizedChannels = useMemo(() => {
		if (!categorizedChannelsRaw?.length && !!previousCategorizedChannels?.current) {
			return previousCategorizedChannels?.current;
		}
		const channelMap = new Map();
		categorizedChannelsRaw.forEach((item) => {
			if ((item as IChannel)?.channel_id) {
				channelMap.set((item as IChannel)?.channel_id, item);
			}
		});
		const dataFormat = categorizedChannelsRaw
			.filter((item) => (item as ICategoryChannel)?.channels)
			.map((category) => {
				const populatedChannels = (category as ICategoryChannel)?.channels
					.map((channelId) => channelMap.get(channelId))
					.filter((channel) => !!channel);

				if (!isShowEmptyCategory && populatedChannels.length === 0) {
					return null;
				}

				return { ...category, channels: populatedChannels };
			})
			.filter((category) => category !== null);

		previousCategorizedChannels.current = dataFormat;
		return dataFormat;
	}, [categorizedChannelsRaw, isShowEmptyCategory]);

	return (
		<>
			<UserEmptyClan />
			<MemoizedChannelList categorizedChannels={categorizedChannels} />
		</>
	);
});

const MemoizedChannelList = React.memo(ChannelList, (prevProps, nextProps) => {
	return JSON.stringify(prevProps.categorizedChannels) === JSON.stringify(nextProps.categorizedChannels);
});

const DrawerContent = React.memo(({ isTablet }: { isTablet?: boolean }) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);

	return (
		<View style={[styles.containerDrawerContent, { backgroundColor: isTablet ? themeValue.tertiary : themeValue.primary }]}>
			<View style={styles.container}>
				<View style={styles.rowContainer}>
					<ServerList />
					{!isTablet && <BackNativeListener />}
					<ChannelListWrapper />
				</View>
				{isTablet && <ProfileBar />}
			</View>
			{isTablet && <View style={styles.wall}></View>}
		</View>
	);
});

export default DrawerContent;
