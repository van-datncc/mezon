import {
	Icons,
	STORAGE_KEY_CLAN_CURRENT_CACHE,
	getUpdateOrAddClanChannelCache,
	save,
} from '@mezon/mobile-components';
import { useTheme } from '@mezon/mobile-ui';
import {
	channelsActions,
	getStoreAsync,
	messagesActions,
	selectIsUnreadChannelById,
	selectLastChannelTimestamp,
	selectNotificationMentionCountByChannelId,
	selectVoiceChannelMembersByChannelId,
} from '@mezon/store-mobile';
import { ChannelStatusEnum, IChannel } from '@mezon/utils';
import { ChannelType } from 'mezon-js';
import React from 'react';
import { Linking, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { linkGoogleMeet } from '../../../../../../utils/helpers';
import { ChannelListContext } from '../../../Reusables';
import ListChannelThread from '../ChannelListThread';
import UserListVoiceChannel from '../../../UserListVoiceChannel';
import { style } from './styles';

function useChannelBadgeCount(channelId: string) {
	const lastChannelTimestamp = useSelector(selectLastChannelTimestamp(channelId));
	const numberNotification = useSelector(selectNotificationMentionCountByChannelId(channelId, lastChannelTimestamp));

	return numberNotification;
}

interface IChannelListItemProps {
	data: any;
	image?: string;
	isActive: boolean;
	currentChanel: IChannel;
	onLongPress: () => void
}

export const ChannelListItem = React.memo((props: IChannelListItemProps) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const useChannelListContentIn = React.useContext(ChannelListContext);
	const isUnRead = useSelector(selectIsUnreadChannelById(props?.data?.id));
	const voiceChannelMember = useSelector(selectVoiceChannelMembersByChannelId(props?.data?.channel_id));
	const numberNotification = useChannelBadgeCount(props.data?.channel_id);

	const handleRouteData = async (thread?: IChannel) => {
		const store = await getStoreAsync();
		if (props?.data?.type === ChannelType.CHANNEL_TYPE_VOICE && props?.data?.status === 1 && props?.data?.meeting_code) {
			const urlVoice = `${linkGoogleMeet}${props?.data?.meeting_code}`;
			await Linking.openURL(urlVoice);
			return;
		}
		useChannelListContentIn.navigation.closeDrawer();
		const channelId = thread ? thread?.channel_id : props?.data?.channel_id;
		const clanId = thread ? thread?.clan_id : props?.data?.clan_id;
		const dataSave = getUpdateOrAddClanChannelCache(clanId, channelId);
		save(STORAGE_KEY_CLAN_CURRENT_CACHE, dataSave);
		store.dispatch(messagesActions.jumpToMessage({ messageId: '', channelId: channelId }));
		store.dispatch(channelsActions.joinChannel({ clanId: clanId ?? '', channelId: channelId, noFetchMembers: false }));
	};

	return (
		<View>
			<TouchableOpacity
				activeOpacity={1}
				onPress={() => handleRouteData()}
				onLongPress={props.onLongPress}
				style={[styles.channelListLink, props.isActive && styles.channelListItemActive]}
			>
				<View style={[styles.channelListItem]}>
					{isUnRead && <View style={styles.dotIsNew} />}

					{props?.data?.channel_private === ChannelStatusEnum.isPrivate && props?.data?.type === ChannelType.CHANNEL_TYPE_VOICE && (
						<Icons.VoiceLockIcon
							width={16} height={16}
							color={isUnRead ? themeValue.textStrong : themeValue.text}
						/>
					)}
					{props?.data?.channel_private === ChannelStatusEnum.isPrivate && props?.data?.type === ChannelType.CHANNEL_TYPE_TEXT && (
						<Icons.TextLockIcon
							width={16} height={16}
							color={isUnRead ? themeValue.textStrong : themeValue.text}
						/>
					)}
					{props?.data?.channel_private === undefined && props?.data?.type === ChannelType.CHANNEL_TYPE_VOICE && (
						<Icons.VoiceNormalIcon
							width={16} height={16}
							color={isUnRead ? themeValue.textStrong : themeValue.text}
						/>
					)}
					{props?.data?.channel_private === undefined &&
						props?.data?.type === ChannelType.CHANNEL_TYPE_TEXT &&
						<Icons.TextIcon
							width={16} height={16}
							color={isUnRead ? themeValue.textStrong : themeValue.text}
						/>
					}

					<Text
						style={[styles.channelListItemTitle, isUnRead && styles.channelListItemTitleActive]} numberOfLines={1}>{props.data.channel_label}
					</Text>
				</View>

				{numberNotification > 0 &&
					<View style={styles.channelDotWrapper}>
						<Text style={styles.channelDot}>{numberNotification}</Text>
					</View>
				}
			</TouchableOpacity>

			{!!props?.data?.threads?.length && (
				<ListChannelThread threads={props?.data?.threads} currentChanel={props.currentChanel} onPress={handleRouteData} />
			)}
			{!!voiceChannelMember?.length && <UserListVoiceChannel userListVoice={voiceChannelMember} />}
		</View>
	);
},
);
