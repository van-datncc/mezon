import { size, useTheme } from '@mezon/mobile-ui';
import { selectIsUnreadChannelById, selectLastChannelTimestamp, selectMentionAndReplyUnreadByChanneld, useAppSelector } from '@mezon/store';
import { ChannelThreads } from '@mezon/utils';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import LongCornerIcon from '../../../../../../../assets/svg/long-corner.svg';
import ShortCornerIcon from '../../../../../../../assets/svg/short-corner.svg';
import { style } from './styles';

interface IChannelListThreadItemProps {
	onPress?: (thread: any) => void;
	onLongPress?: (thread: ChannelThreads) => void;
	thread: any;
	isActive?: boolean;
	isFirstThread?: boolean;
}

export default function ChannelListThreadItem({ onPress, onLongPress, thread, isActive, isFirstThread }: IChannelListThreadItemProps) {
	const { themeValue, theme } = useTheme();
	const styles = style(themeValue);

	const isUnReadChannel = useAppSelector((state) => selectIsUnreadChannelById(state, thread.id));

	const getLastSeenChannel = useSelector(selectLastChannelTimestamp(thread?.channel_id ?? ''));
	const numberNotification = useSelector(
		selectMentionAndReplyUnreadByChanneld(thread?.clan_id ?? '', thread?.channel_id ?? '', getLastSeenChannel ?? 0)
	).length;

	const onPressThreadItem = () => {
		onPress && onPress(thread);
	};

	const onLongPressThreadItem = () => {
		onLongPress && onLongPress(thread);
	};

	return (
		<TouchableOpacity
			key={thread.id}
			activeOpacity={1}
			onPress={() => onPressThreadItem()}
			onLongPress={() => onLongPressThreadItem()}
			style={[styles.channelListLink]}
		>
			<View style={[styles.threadItem]}>
				{isFirstThread ? <ShortCornerIcon width={size.s_12} height={size.s_12} /> : <LongCornerIcon width={size.s_12} height={size.s_36} />}
				<Text
					style={[
						styles.titleThread,
						isUnReadChannel && styles.channelListItemTitleActive,
						isActive && { backgroundColor: theme === 'light' ? themeValue.secondaryWeight : themeValue.secondaryLight }
					]}
					numberOfLines={1}
				>
					{thread?.channel_label}
				</Text>
			</View>

			{numberNotification > 0 && (
				<View style={[styles.channelDotWrapper, isFirstThread && { top: size.s_4 }]}>
					<Text style={styles.channelDot}>{numberNotification}</Text>
				</View>
			)}
		</TouchableOpacity>
	);
}
