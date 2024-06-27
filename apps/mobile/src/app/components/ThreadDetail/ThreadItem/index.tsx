import { AngleRightIcon } from '@mezon/mobile-components';
import { Colors } from '@mezon/mobile-ui';
import { ChannelsEntity, channelsActions, getStoreAsync, messagesActions, selectMemberByUserId } from '@mezon/store-mobile';
import { IChannel, convertTimeMessage } from '@mezon/utils';
import { useNavigation } from '@react-navigation/native';
import { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useMessageSender } from '../../../hooks/useMessageSender';
import { APP_SCREEN } from '../../../navigation/ScreenTypes';
import { styles } from './ThreadItem.style';

interface IThreadItemProps {
	thread: ChannelsEntity;
}
const ThreadItem = ({ thread }: IThreadItemProps) => {
	const navigation = useNavigation();
	const user = useSelector(selectMemberByUserId(thread?.last_sent_message?.sender_id as string));

	const { username } = useMessageSender(user);
	const handleNavigateThread = async (thread?: IChannel) => {
		const store = await getStoreAsync();
		navigation.navigate(APP_SCREEN.HOME as never);
		const channelId = thread?.channel_id;
		const clanId = thread?.clan_id;
		store.dispatch(messagesActions.jumpToMessage({ messageId: '', channelId: channelId }));
		store.dispatch(channelsActions.joinChannel({ clanId: clanId ?? '', channelId: channelId, noFetchMembers: false }));
	};
	const timeMessage = useMemo(() => {
		if (thread && thread.last_sent_message && thread.last_sent_message.timestamp) {
			const lastTime = convertTimeMessage(thread.last_sent_message.timestamp);
			return lastTime;
		}
	}, [thread]);

	return (
		<Pressable
			onPress={() => {
				handleNavigateThread(thread);
			}}
			style={styles.threadItemWrapper}
		>
			<View>
				<Text style={styles.threadName}>{thread?.channel_label}</Text>
				<View style={styles.threadContent}>
					<Text style={styles.textThreadCreateBy}>{username}</Text>
					<Text numberOfLines={1} ellipsizeMode="tail" style={styles.messageContent}>
						{!!JSON.parse(thread?.last_sent_message?.content)?.['t'] ? JSON.parse(thread?.last_sent_message?.content)?.['t'] : ''}
					</Text>
					<Text style={styles.bullet}>•</Text>
					<Text style={styles.createTime}>{timeMessage}</Text>
				</View>
			</View>
			<AngleRightIcon width={25} height={25} color={Colors.white} />
		</Pressable>
	);
};

export default ThreadItem;
