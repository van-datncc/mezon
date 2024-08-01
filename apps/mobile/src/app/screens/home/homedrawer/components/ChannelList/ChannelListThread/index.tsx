import { useTheme } from '@mezon/mobile-ui';
import { ChannelsEntity } from '@mezon/store-mobile';
import { ChannelThreads, IChannel } from '@mezon/utils';
import React from 'react';
import { View } from 'react-native';
import ChannelListThreadItem from '../ChannelListThreadItem';
import { style } from './styles';

type IListChannelThreadProps = {
	threads: IChannel[];
	currentChanel: ChannelsEntity;
	onPress: (thread: IChannel) => void;
	onLongPress?: (thread: ChannelThreads) => void;
};

const ListChannelThread = React.memo(({ threads, currentChanel, onPress, onLongPress }: IListChannelThreadProps) => {
	const styles = style(useTheme().themeValue);

	return (
		<View style={styles.containerThreadList}>
			{threads.map((thread, index) => {
				const isFirstThread = threads.indexOf(thread) === 0;
				const isActive = currentChanel?.channel_id === thread.channel_id;

				return (
					<ChannelListThreadItem
						key={`${thread?.id}_channel_thread_item${index}`}
						thread={thread}
						isActive={isActive}
						isFirstThread={isFirstThread}
						onPress={onPress}
						onLongPress={onLongPress}
					/>
				);
			})}
		</View>
	);
});

export default ListChannelThread;
