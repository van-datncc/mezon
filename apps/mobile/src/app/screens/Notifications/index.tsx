import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { useChannels, useNotification } from '@mezon/core';
import { TrashIcon } from '@mezon/mobile-components';
import { Colors, size } from '@mezon/mobile-ui';
import { INotification, NotificationEntity, channelsActions, getStoreAsync, messagesActions } from '@mezon/store-mobile';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import moment from 'moment';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Feather from 'react-native-vector-icons/Feather';
import { APP_SCREEN } from '../../navigation/ScreenTypes';
import NotificationIndividualItem from './NotificationIndividualItem';
import NotificationItem from './NotificationItem';
import NotificationOption from './NotificationOption';
import { styles } from './Notifications.styles';
import { EActionDataNotify, ENotifyBsToShow } from './types';

const Notifications = () => {
	const { notification, deleteNotify } = useNotification();
	const { t } = useTranslation(['notification']);
	const { channels } = useChannels();
	const [content, setContent] = useState<React.ReactNode>(<View />);
	const navigation = useNavigation();

	const [sortedNotifications, setSortedNotifications] = useState<NotificationEntity[]>([]);

	const handleFilterNotify = (tabNotify) => {
		const dataSort = notification.sort((a, b) => moment(b.create_time).valueOf() - moment(a.create_time).valueOf());

		switch (tabNotify) {
			case EActionDataNotify.Individual:
				setSortedNotifications(
					dataSort.filter((item) => item.code !== -9 && channels.some((channel) => channel.channel_id === item.content.channel_id)),
				);
				break;
			case EActionDataNotify.Mention:
				setSortedNotifications(
					dataSort.filter((item) => item.code === -9 && channels.some((channel) => channel.channel_id === item.content.channel_id)),
				);
				break;
			case EActionDataNotify.All:
				setSortedNotifications(dataSort.filter((item) => channels.some((channel) => channel.channel_id === item.content.channel_id)));
				break;
			default:
				setSortedNotifications([]);
				break;
		}
	};

	useEffect(() => {
		handleFilterNotify(EActionDataNotify.All);
	}, [notification, channels]);
	const bottomSheetRef = useRef<BottomSheet>(null);

	const snapPoints = ['35%', '55%'];
	const openBottomSheet = (type: ENotifyBsToShow, notify?: INotification) => {
		switch (type) {
			case ENotifyBsToShow.notification:
				bottomSheetRef.current?.snapToIndex(1);
				setContent(
					<NotificationOption
						channels={channels}
						onChange={(value) => {
							handleFilterNotify(value);
						}}
					/>,
				);
				break;
			case ENotifyBsToShow.removeNotification:
				bottomSheetRef.current?.snapToIndex(0);
				setContent(
					<TouchableOpacity onPress={() => handleDeleteNotify(notify)} style={styles.removeNotifyContainer}>
						<TrashIcon />
						<Text style={styles.removeNotifyText}>{t('removeNotification')}</Text>
					</TouchableOpacity>,
				);
				break;
			default:
				setContent(
					<NotificationOption
						channels={channels}
						onChange={(value) => {
							handleFilterNotify(value);
						}}
					/>,
				);
				bottomSheetRef.current?.snapToIndex(1);
				break;
		}
	};

	const handleDeleteNotify = (notify?: INotification) => {
		notify && deleteNotify(notify.id);
		closeBottomSheet();
	};

	const handleOnPressNotify = async (notify: INotification) => {
		const store = await getStoreAsync();
		navigation.navigate(APP_SCREEN.HOME as never);

		store.dispatch(messagesActions.jumpToMessage({ messageId: notify.content.message_id, channelId: notify.content.channel_id }));
		store.dispatch(
			channelsActions.joinChannel({
				clanId: notify.content.clan_id ?? '',
				channelId: notify.content.channel_id,
				noFetchMembers: false,
			}),
		);
		navigation.dispatch(DrawerActions.closeDrawer());
	};

	const closeBottomSheet = () => {
		bottomSheetRef.current?.close();
	};

	const renderBackdrop = useCallback(
		(props) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} onPress={closeBottomSheet} />,
		[],
	);

	return (
		<View style={styles.notifications}>
			<View style={styles.notificationsHeader}>
				<Text style={styles.notificationHeaderTitle}>{t('headerTitle')}</Text>
				<Pressable onPress={() => openBottomSheet(ENotifyBsToShow.notification)}>
					<View style={styles.notificationHeaderIcon}>
						<Feather name="more-horizontal" size={20} color={'white'} />
					</View>
				</Pressable>
			</View>
			<View style={styles.notificationsList}>
				<FlatList
					data={sortedNotifications}
					renderItem={({ item }) => {
						return item.code === -9 ? (
							<NotificationItem onPressNotify={handleOnPressNotify} notify={item} onLongPressNotify={openBottomSheet} />
						) : (
							<NotificationIndividualItem notify={item} onLongPressNotify={openBottomSheet} />
						);
					}}
					keyExtractor={(item) => item.id}
				/>
			</View>
			<BottomSheet
				ref={bottomSheetRef}
				enablePanDownToClose={true}
				backdropComponent={renderBackdrop}
				index={-1}
				snapPoints={snapPoints}
				backgroundStyle={{ backgroundColor: Colors.secondary }}
				style={{ padding: size.s_16 }}
			>
				<BottomSheetView style={styles.contentContainer}>{content}</BottomSheetView>
			</BottomSheet>
		</View>
	);
};

export default Notifications;
