import { ChannelsEntity } from '@mezon/store-mobile';
import { IChannel } from '@mezon/utils';
import React from 'react';
import { styles } from './styles';
import ThreadListItem from './ThreadListItem';
import { View } from 'react-native';

type ThreadListChannelProps = {
	threads: IChannel[];
	currentChanel: ChannelsEntity;
	onPress: (thread: IChannel) => void;
};

const ThreadListChannel = React.memo(({ threads, currentChanel, onPress }: ThreadListChannelProps) => {
	return (
		<View style={styles.containerThreadList}>
			{threads.map((thread) => {
				const isFirstThread = threads.indexOf(thread) === 0;
				const isActive = currentChanel?.channel_id === thread.channel_id;

				return (
					<ThreadListItem
						thread={thread}
						isActive={isActive}
						isFirstThread={isFirstThread}
						onPress={onPress}
					/>
				);
			})}
		</View>
	);
});

export default ThreadListChannel;
