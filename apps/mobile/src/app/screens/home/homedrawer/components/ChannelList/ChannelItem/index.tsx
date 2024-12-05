import { useTheme } from '@mezon/mobile-ui';
import { selectBuzzStateByChannelId, useAppSelector } from '@mezon/store-mobile';
import { IChannel } from '@mezon/utils';
import { ChannelStreamMode, ChannelType } from 'mezon-js';
import React, { useMemo } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import BuzzBadge from '../../../../../../components/BuzzBadge/BuzzBadge';
import { ChannelBadgeUnread } from '../ChannelBadgeUnread';
import { StatusVoiceChannel } from '../ChannelListItem';
import { style } from '../ChannelListItem/styles';
import { ChannelStatusIcon } from '../ChannelStatusIcon';

interface IChannelItemProps {
	onPress: () => void;
	onLongPress: () => void;
	data: IChannel;
	isUnRead?: boolean;
	isActive?: boolean;
}

function ChannelItem({ onLongPress, onPress, data, isUnRead, isActive }: IChannelItemProps) {
	const { themeValue, theme } = useTheme();
	const styles = style(themeValue);
	const buzzState = useAppSelector((state) => selectBuzzStateByChannelId(state, data?.channel_id ?? ''));
	const numberNotification = useMemo(() => {
		return data?.count_mess_unread ? data?.count_mess_unread : 0;
	}, [data?.count_mess_unread]);

	return (
		<TouchableOpacity
			activeOpacity={1}
			onPress={() => onPress()}
			onLongPress={onLongPress}
			style={[
				styles.channelListLink,
				isActive && styles.channelListItemActive,
				isActive && { backgroundColor: theme === 'light' ? themeValue.secondaryWeight : themeValue.secondaryLight }
			]}
		>
			<View style={[styles.channelListItem]}>
				{isUnRead && <View style={styles.dotIsNew} />}

				<ChannelStatusIcon channel={data} isUnRead={isUnRead} />
				<Text style={[styles.channelListItemTitle, isUnRead && styles.channelListItemTitleActive]} numberOfLines={1}>
					{data?.channel_label}
				</Text>
			</View>
			{data?.type === ChannelType.CHANNEL_TYPE_VOICE && data?.status === StatusVoiceChannel.No_Active && (
				<ActivityIndicator color={themeValue.white} />
			)}

			{buzzState?.isReset && (
				<BuzzBadge
					timestamp={buzzState?.timestamp as number}
					isReset={buzzState?.isReset}
					channelId={data?.channel_id as string}
					senderId={buzzState?.senderId as string}
					mode={ChannelStreamMode.STREAM_MODE_CHANNEL}
				/>
			)}

			{Number(numberNotification || 0) > 0 && <ChannelBadgeUnread countMessageUnread={Number(numberNotification || 0)} />}
		</TouchableOpacity>
	);
}
export default React.memo(ChannelItem);
