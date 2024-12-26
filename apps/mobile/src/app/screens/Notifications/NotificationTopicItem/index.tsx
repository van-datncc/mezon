import { useAuth, useGetPriorityNameFromUserClan } from '@mezon/core';
import { useTheme } from '@mezon/mobile-ui';
import { getStoreAsync, selectAllUserClans, topicsActions, useAppSelector } from '@mezon/store-mobile';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MezonAvatar } from '../../../componentUI';
import { useMessageParser } from '../../../hooks/useMessageParser';
import { APP_SCREEN } from '../../../navigation/ScreenTypes';
import { parseObject } from '../NotificationMentionItem';
import { ENotifyBsToShow, NotifyProps } from '../types';
import { style } from './styles';

const NotificationTopicItem = React.memo(({ notify, onLongPressNotify, onPressNotify }: NotifyProps) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const navigation = useNavigation<any>();
	const data = parseObject(notify?.content);
	const memberClan = useAppSelector(selectAllUserClans);
	const { userId } = useAuth();
	const { priorityAvatar: priorityAvatarSender } = useGetPriorityNameFromUserClan(notify?.sender_id);
	const { priorityAvatar: priorityAvatarContentSender } = useGetPriorityNameFromUserClan(notify?.content?.sender_id);
	const message = Object.assign({}, data, { create_time: notify?.create_time, avatar: priorityAvatarContentSender });
	const { messageTimeDifference } = useMessageParser(message);
	const initMessage = JSON.parse(notify?.subject)?.t;
	const userIds = notify.content.repliers;
	const [subjectTopic, setSubjectTopic] = useState('');

	const usernames = useMemo(() => {
		return memberClan
			.filter((profile) => (userIds || []).includes(profile?.user?.id || '') && profile?.user?.id !== userId)
			.map((profile) => profile?.user?.username);
	}, [memberClan, userIds, userId]);

	useEffect(() => {
		if (usernames.length === 0) {
			setSubjectTopic('Topic and you');
		}
		if (usernames.length === 1) {
			setSubjectTopic(`${usernames[0]} and you`);
		}
		if (usernames.length > 1) {
			setSubjectTopic(`${usernames[usernames.length - 1]} and ${usernames.length - 1} others`);
		}
	}, [usernames, userIds]);

	const handlePressNotify = async () => {
		onPressNotify(notify);
		const store = await getStoreAsync();
		const promises = [];
		promises.push(store.dispatch(topicsActions.setValueTopic(message)));
		promises.push(store.dispatch(topicsActions.setCurrentTopicId(notify.id || '')));
		promises.push(
			store.dispatch(topicsActions.setIsShowCreateTopic({ channelId: notify?.content?.channel_id as string, isShowCreateTopic: true }))
		);

		await Promise.all(promises);

		navigation.navigate(APP_SCREEN.MESSAGES.STACK, {
			screen: APP_SCREEN.MESSAGES.TOPIC_DISCUSSION
		});
	};

	return (
		<TouchableOpacity
			onPress={() => {
				handlePressNotify();
			}}
			onLongPress={() => {
				onLongPressNotify(ENotifyBsToShow.removeNotification, notify);
			}}
		>
			<View style={styles.notifyContainer}>
				<View style={styles.notifyHeader}>
					<View style={styles.boxImage}>
						<MezonAvatar avatarUrl={priorityAvatarSender} username={notify?.content?.userName}></MezonAvatar>
					</View>
					<View style={styles.notifyContent}>
						<Text numberOfLines={2} style={[styles.notifyHeaderTitle, styles.username]}>
							{subjectTopic.toUpperCase()}
						</Text>
						<Text numberOfLines={2} style={styles.notifyHeaderTitle}>
							<Text style={styles.username}>{'Replied To: '}</Text>
							{data.content.t}
						</Text>
						<Text numberOfLines={2} style={styles.notifyHeaderTitle}>
							<Text style={styles.username}>{`${usernames[usernames.length - 1]}: `} </Text>
							{initMessage}
						</Text>
					</View>
					<Text style={styles.notifyDuration}>{messageTimeDifference}</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
});

export default NotificationTopicItem;
