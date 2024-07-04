import { ChannelsEntity } from '@mezon/store-mobile';
import { IChannel } from '@mezon/utils';
import React from 'react';
import ChannelListThreadItem from '../ChannelListThreadItem';
import { View } from 'react-native';
import { useTheme } from '@mezon/mobile-ui';
import { style } from './styles';

type IListChannelThreadProps = {
	threads: IChannel[];
	currentChanel: ChannelsEntity;
	onPress: (thread: IChannel) => void;
};

const ListChannelThread = React.memo(({ threads, currentChanel, onPress }: IListChannelThreadProps) => {
	const styles = style(useTheme().themeValue);

	return (
		<View style={styles.containerThreadList}>
			{threads.map((thread) => {
				const isFirstThread = threads.indexOf(thread) === 0;
				const isActive = currentChanel?.channel_id === thread.channel_id;

				return (
					<ChannelListThreadItem
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

export default ListChannelThread;
