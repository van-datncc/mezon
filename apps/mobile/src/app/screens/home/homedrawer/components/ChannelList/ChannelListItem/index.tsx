import { BottomSheetModal } from '@gorhom/bottom-sheet';
import {
	ActionEmitEvent,
	STORAGE_CHANNEL_CURRENT_CACHE,
	STORAGE_DATA_CLAN_CHANNEL_CACHE,
	getUpdateOrAddClanChannelCache,
	load,
	save
} from '@mezon/mobile-components';
import {
	channelsActions,
	getStoreAsync,
	selectCategoryExpandStateByCategoryId,
	selectIsUnreadChannelById,
	useAppSelector
} from '@mezon/store-mobile';
import { IChannel } from '@mezon/utils';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { ChannelType } from 'mezon-js';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DeviceEventEmitter, Linking, SafeAreaView, View } from 'react-native';
import { MezonBottomSheet } from '../../../../../../componentUI';
import useTabletLandscape from '../../../../../../hooks/useTabletLandscape';
import { linkGoogleMeet } from '../../../../../../utils/helpers';
import JoinStreamingRoomBS from '../../StreamingRoom/JoinStreamingRoomBS';
import ChannelItem from '../ChannelItem';
import ListChannelThread from '../ChannelListThread';
import UserListVoiceChannel from '../ChannelListUserVoice';

interface IChannelListItemProps {
	data: any;
	image?: string;
}

export enum StatusVoiceChannel {
	Active = 1,
	No_Active = 0
}

export enum IThreadActiveType {
	Active = 1
}

export const ChannelListItem = React.memo(
	(props: IChannelListItemProps) => {
		const bottomSheetChannelStreamingRef = useRef<BottomSheetModal>(null);
		const isUnRead = useAppSelector((state) => selectIsUnreadChannelById(state, props?.data?.id));
		const [isActive, setIsActive] = useState<boolean>(false);
		const isCategoryExpanded = useAppSelector((state) => selectCategoryExpandStateByCategoryId(state, props?.data?.category_id as string));
		const isUnReadThreads = useMemo(() => {
			if (!props?.data?.threads || !props?.data?.threads?.length) return false;
			return props?.data?.threads?.some((thread) => {
				return !!thread?.count_mess_unread;
			});
		}, [props?.data]);

		const isChannelVoice = useMemo(() => {
			return props?.data?.type === ChannelType.CHANNEL_TYPE_GMEET_VOICE || props?.data?.type === ChannelType.CHANNEL_TYPE_STREAMING;
		}, [props?.data?.type]);

		const timeoutRef = useRef<any>();
		const navigation = useNavigation();
		const isTabletLandscape = useTabletLandscape();

		const dataThreads = useMemo(() => {
			return !props?.data?.threads
				? []
				: props?.data?.threads.filter(
						(thread: { active: IThreadActiveType; count_mess_unread: number }) =>
							thread?.active === IThreadActiveType.Active || !thread?.count_mess_unread
					);
		}, [props?.data?.threads]);

		useEffect(() => {
			const event = DeviceEventEmitter.addListener(ActionEmitEvent.CHANNEL_ID_ACTIVE, (channelId: string) => {
				if (channelId === props?.data?.id) {
					setIsActive(true);
				} else {
					if (isActive) setIsActive(false);
				}
			});

			return () => {
				event.remove();
				timeoutRef.current && clearTimeout(timeoutRef.current);
			};
		}, [props?.data?.id, isActive]);

		const handleRouteData = useCallback(
			async (thread?: IChannel) => {
				if (props?.data?.type === ChannelType.CHANNEL_TYPE_STREAMING) {
					bottomSheetChannelStreamingRef.current?.present();
					return;
				}
				if (props?.data?.type === ChannelType.CHANNEL_TYPE_GMEET_VOICE) {
					if (props?.data?.status === StatusVoiceChannel.Active && props?.data?.meeting_code) {
						const urlVoice = `${linkGoogleMeet}${props?.data?.meeting_code}`;
						await Linking.openURL(urlVoice);
					}
				} else {
					const channelId = thread ? thread?.channel_id : props?.data?.channel_id;
					const clanId = thread ? thread?.clan_id : props?.data?.clan_id;
					const channelsCache = load(STORAGE_CHANNEL_CURRENT_CACHE) || [];
					const isCached = channelsCache?.includes(channelId);
					const store = await getStoreAsync();
					store.dispatch(channelsActions.setCurrentChannelId({ clanId, channelId }));
					if (!isTabletLandscape) {
						navigation.dispatch(DrawerActions.closeDrawer());
					}
					timeoutRef.current = setTimeout(async () => {
						DeviceEventEmitter.emit(ActionEmitEvent.ON_SWITCH_CHANEL, isCached ? 100 : 0);
						store.dispatch(
							channelsActions.joinChannel({
								clanId: clanId ?? '',
								channelId: channelId,
								noFetchMembers: false,
								isClearMessage: true,
								noCache: true
							})
						);
					}, 0);
					const dataSave = getUpdateOrAddClanChannelCache(clanId, channelId);
					save(STORAGE_DATA_CLAN_CHANNEL_CACHE, dataSave);
				}
			},
			[
				isTabletLandscape,
				navigation,
				props?.data?.channel_id,
				props?.data?.clan_id,
				props?.data?.meeting_code,
				props?.data?.status,
				props?.data?.type
			]
		);

		const handleLongPressChannel = useCallback(() => {
			DeviceEventEmitter.emit(ActionEmitEvent.ON_LONG_PRESS_CHANNEL, { channel: props?.data });
		}, [props?.data]);

		const handleLongPressThread = useCallback(() => {
			DeviceEventEmitter.emit(ActionEmitEvent.ON_LONG_PRESS_CHANNEL, { channel: props?.data, isThread: true });
		}, [props?.data]);

		if (!isCategoryExpanded && !isUnRead && !isChannelVoice && !isActive && !isUnReadThreads) return;
		return (
			<View>
				{!isChannelVoice && (
					<ChannelItem
						onPress={handleRouteData}
						onLongPress={handleLongPressChannel}
						data={props?.data}
						isUnRead={isUnRead}
						isActive={isActive}
					/>
				)}
				{!!dataThreads?.length && <ListChannelThread threads={dataThreads} onPress={handleRouteData} onLongPress={handleLongPressThread} />}
				{isChannelVoice && (
					<UserListVoiceChannel
						channelId={props?.data?.channel_id}
						isCategoryExpanded={isCategoryExpanded}
						onPress={handleRouteData}
						onLongPress={handleLongPressChannel}
						data={props?.data}
						isUnRead={false}
						isActive={isActive}
					/>
				)}
				<MezonBottomSheet ref={bottomSheetChannelStreamingRef} snapPoints={['45%']}>
					<SafeAreaView>
						<JoinStreamingRoomBS channel={props?.data} ref={bottomSheetChannelStreamingRef} />
					</SafeAreaView>
				</MezonBottomSheet>
			</View>
		);
	},
	(prevProps, nextProps) => {
		return (
			prevProps?.data?.channel_id === nextProps?.data?.channel_id &&
			prevProps?.data?.count_mess_unread === nextProps?.data?.count_mess_unread &&
			prevProps?.data?.threads === nextProps?.data?.threads
		);
	}
);
