import { ChannelTypeHeader } from '@mezon/mobile-components';
import { size, useTheme } from '@mezon/mobile-ui';
import { ChannelUsersEntity } from '@mezon/store-mobile';
import { ChannelType } from 'mezon-js';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Text, View } from 'react-native';
import { ChannelItem } from '../ChannelItem';
import { EmptySearchPage } from '../EmptySearchPage';
import style from './ChannelsSearchTab.styles';

type ChannelsSearchTabProps = {
	listChannelSearch: ChannelUsersEntity[];
};

export const ChannelsSearchTab = ({ listChannelSearch }: ChannelsSearchTabProps) => {
	const { t } = useTranslation(['searchMessageChannel']);
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const listVoiceChannel = useMemo(
		() =>
			listChannelSearch?.filter(
				(channel) => channel?.type === ChannelType.CHANNEL_TYPE_GMEET_VOICE || channel?.type === ChannelType.CHANNEL_TYPE_MEZON_VOICE
			),
		[listChannelSearch]
	);
	const listTextChannel = useMemo(
		() =>
			listChannelSearch?.filter((channel) =>
				[
					ChannelType.CHANNEL_TYPE_CHANNEL,
					ChannelType.CHANNEL_TYPE_THREAD,
					ChannelType.CHANNEL_TYPE_APP,
					ChannelType.CHANNEL_TYPE_ANNOUNCEMENT,
					ChannelType.CHANNEL_TYPE_FORUM
				].includes(channel?.type)
			),
		[listChannelSearch]
	);
	const listStreamingChannel = useMemo(
		() => listChannelSearch?.filter((channel) => channel?.type === ChannelType.CHANNEL_TYPE_STREAMING),
		[listChannelSearch]
	);
	const combinedListChannel = useMemo(
		() => [
			...(listTextChannel?.length ? [{ title: t('textChannels'), type: ChannelTypeHeader }, ...listTextChannel] : []),
			...(listVoiceChannel?.length ? [{ title: t('voiceChannels'), type: ChannelTypeHeader }, ...listVoiceChannel] : []),
			...(listStreamingChannel?.length ? [{ title: t('streamingChannels'), type: ChannelTypeHeader }, ...listStreamingChannel] : [])
		],
		[listTextChannel, listVoiceChannel, listStreamingChannel, t]
	);

	const renderItem = useCallback(({ item }) => {
		if (item?.type === ChannelTypeHeader) {
			return <Text style={styles.title}>{item.title}</Text>;
		}
		return <ChannelItem channelData={item} />;
	}, []);
	const keyExtractor = useCallback((item, index) => item?.id?.toString() + `${index}_item_search_channel` + item?.title, []);

	return (
		<View style={styles.container}>
			<FlatList
				data={listChannelSearch?.length > 0 ? combinedListChannel : []}
				renderItem={renderItem}
				keyExtractor={keyExtractor}
				showsVerticalScrollIndicator={false}
				initialNumToRender={1}
				maxToRenderPerBatch={1}
				windowSize={2}
				updateCellsBatchingPeriod={50}
				scrollEventThrottle={16}
				removeClippedSubviews={true}
				keyboardShouldPersistTaps={'handled'}
				viewabilityConfig={{
					itemVisiblePercentThreshold: 50,
					minimumViewTime: 300
				}}
				style={styles.listBox}
				contentOffset={{ x: 0, y: 0 }}
				contentContainerStyle={{ paddingBottom: size.s_50 }}
				ListEmptyComponent={() => <EmptySearchPage />}
			/>
		</View>
	);
};
